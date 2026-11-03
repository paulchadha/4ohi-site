const { chromium } = require('playwright');
const { createServer } = require('node:http');
const { readFileSync, mkdirSync, writeFileSync } = require('node:fs');
const { resolve, join, extname, normalize } = require('node:path');
const assert = require('node:assert/strict');
const root=resolve(__dirname,'..'), out=resolve(process.env.BOBBY_QA_OUT||'docs/visual-evidence/bobby-protector-builder-20261102');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const server=process.env.SITE_URL?null:createServer((req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://local').pathname), rel=path==='/'?'index.html':path.replace(/^\//,'');const file=normalize(join(root,rel.endsWith('/')?rel+'index.html':rel));assert(file.startsWith(root));res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(readFileSync(file));}catch{res.writeHead(404);res.end('Not found')}});
(async()=>{
 mkdirSync(out,{recursive:true}); if(server)await new Promise(r=>server.listen(4216,'127.0.0.1',r));const base=process.env.SITE_URL||'http://127.0.0.1:4216';
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const results=[];
 try{
 for(const width of (process.env.BOBBY_TILES_ONLY?[]:[320,390,768,1024,1440,1920])){
  const page=await browser.newPage({viewport:{width,height:width<768?844:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+'/bobby-the-breadasaurus.html',{waitUntil:'networkidle'});assert(response.ok());
  await page.locator('[data-continue-without-saving]').click().catch(()=>{});
  assert.equal(await page.locator('h1').innerText(),'Bobby the Breadasaurus: Tower Defense Adventures');
  const info=await page.locator('.bobby-protector-scenery img').evaluate(n=>({loaded:n.complete&&n.naturalWidth>0,w:n.naturalWidth,h:n.naturalHeight,renderW:n.clientWidth,renderH:n.clientHeight,src:n.currentSrc,fit:getComputedStyle(n).objectFit}));
  assert(info.loaded);assert(info.src.includes('protector-builder/bobby-hero-'));assert(Math.abs(info.w/info.h-16/9)<.003);assert.equal(info.fit,width<=1000?'contain':'cover');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow '+width);
  const old=await page.locator('main img').evaluateAll(ns=>ns.map(n=>n.getAttribute('src')).filter(src=>/bobby-hero-1200|bobby-gameplay|bobby-concept/.test(src)));assert.deepEqual(old,[]);
  assert.equal(errors.length,0,errors.join('; '));
  const links=await page.locator('.bobby-protector-copy .actions a').evaluateAll(ns=>ns.map(n=>({text:n.textContent,href:n.getAttribute('href')})));assert(links.some(n=>n.href.endsWith('#product-gallery-bobby')));
  await page.screenshot({path:join(out,'bobby-'+width+'.png'),fullPage:true});results.push({width,hero:info,links,status:'pass'});await page.close();
 }
 for(const route of ['index.html','games.html']){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto(base+'/'+route,{waitUntil:'networkidle'});await page.locator('[data-continue-without-saving]').click().catch(()=>{});
  const tile=page.locator('.production-card').filter({has:page.locator('img[src*="bobby-tile-800"]')}).first();assert(await tile.count(),JSON.stringify(await page.locator('a').evaluateAll(ns=>ns.filter(n=>n.href.includes('bobby')).map(n=>({class:n.className,href:n.href,image:n.querySelector('img')?.getAttribute('src')})))));await tile.scrollIntoViewIfNeeded();await tile.locator('img').evaluate(n=>n.decode());
  const info=await tile.locator('img').evaluate(n=>({src:n.currentSrc,w:n.naturalWidth,h:n.naturalHeight,ratio:getComputedStyle(n.parentElement).aspectRatio}));assert(info.src.includes('bobby-tile-800'));assert.equal(info.w,info.h);assert.equal(info.ratio,'1 / 1');
  await tile.screenshot({path:join(out,route.replace('.html','')+'-bobby-tile.png')});results.push({route,tile:info,status:'pass'});await page.close();
 }
 writeFileSync(join(out,'results.json'),JSON.stringify({base,results},null,2)+'\n');console.log('Bobby Protector + Builder responsive QA passed: '+results.length+' gates.');
 }finally{await browser.close();if(server)await new Promise(r=>server.close(r));}
})().catch(error=>{console.error(error);process.exit(1)});
