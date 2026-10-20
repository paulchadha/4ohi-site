const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),out=path.resolve(root,process.env.BLING_QA_OUT||'docs/visual-evidence/sling-bling-2026-10-20/local');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((q,r)=>{try{const u=new URL(q.url,'http://local'),rel=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname).slice(1),file=path.resolve(root,rel.endsWith('/')?rel+'index.html':rel);if(!file.startsWith(root+path.sep)||['content','docs','scripts','.git'].includes(rel.split('/')[0]))throw Error('private');r.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'application/octet-stream');r.end(fs.readFileSync(file));}catch{r.writeHead(404);r.end('Not found');}});
 if(!process.env.SITE_URL)await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=process.env.SITE_URL||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),errors=[],checks=[];
 try{
  for(const [route,widths] of [['sling-nouveau.html',[320,390,768,1440]],['index.html',[390,1440]],['news.html',[390,1440]],['news-sling-bling-gold-jewels-and-gravity.html',[390,1440]]])for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(base+'/'+route,{waitUntil:'networkidle'});assert.ok(response.ok(),route);
   await page.locator('img').evaluateAll(async ns=>{ns.forEach(n=>n.loading='eager');await Promise.all(ns.map(n=>n.decode().catch(()=>{})));});
   const broken=await page.locator('img').evaluateAll(ns=>ns.filter(n=>!n.complete||!n.naturalWidth).map(n=>n.src));assert.deepEqual(broken,[]);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
   assert.equal(await page.locator('h1').count(),1);
   if(route==='sling-nouveau.html'){assert.equal(await page.locator('h1').innerText(),'Sling Bling');assert.ok((await page.locator('main').innerText()).includes('Physics testing is incomplete'));assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://4ohi.com/sling-nouveau.html');assert.equal(await page.locator('main a').filter({hasText:/Play now|Download|Play Sling/i}).count(),0);}
   await page.screenshot({path:path.join(out,route.replace('.html','')+'-'+width+'.png'),fullPage:true});checks.push({route,width,status:response.status()});console.log('PASS '+route+' '+width);await page.close();
  }
  const context=await browser.newContext();
  for(const a of JSON.parse(fs.readFileSync(path.join(root,'content/news.json'),'utf8')).filter(a=>a.scheduledFor&&a.status==='draft')){const r=await context.request.get(base+'/news-'+a.slug+'.html');assert.equal(r.status(),404,'Future story visible: '+a.slug);}
  await context.close();assert.deepEqual(errors,[]);
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({target:base,checks,errors},null,2)+'\n');await browser.close();if(server.listening)await new Promise(r=>server.close(r));}
 console.log('PASS artwork, responsive pages, metadata, console, and future-route exclusion');
})().catch(e=>{console.error(e);process.exitCode=1;});
