const fs = require('fs'), http = require('http'), path = require('path');
const { chromium } = require('playwright');
(async () => {
  const root = process.cwd(), out = process.env.NAV_OUT || 'docs/visual-evidence/card-release-navigation';
  fs.mkdirSync(out, {recursive:true});
  const server = http.createServer((q,r) => {try {
    const u = new URL(q.url,'http://local');
    const f = path.resolve(root,'.'+u.pathname+(u.pathname.endsWith('/')?'index.html':''));
    if(!f.startsWith(root+path.sep)) throw Error('outside root');
    r.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[path.extname(f)] || 'application/octet-stream');
    r.end(fs.readFileSync(f));
  } catch {r.statusCode=404;r.end('Not found');}});
  if(!process.env.SITE_URL) await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base = process.env.SITE_URL || 'http://127.0.0.1:'+server.address().port;
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const results=[];
  for(const width of [390,768,1440]) for(const lang of ['en','en-CA']) for(const game of ['evil-doom-boy','thumb-command']) {
    const p = await browser.newPage({viewport:{width,height:900},hasTouch:width<1000});
    const issues=[], errors=[]; p.on('pageerror',e=>errors.push(e.message));
    const dismiss=async()=>{const b=p.locator('[data-continue-without-saving]');if(await b.isVisible())await b.click();};
    const menu=async()=>{const b=p.locator('.menu-toggle');if(await b.isVisible()&&await b.getAttribute('aria-expanded')!=='true')await b.click();};
    const check=(value,message)=>{if(!value)issues.push(message);};
    try {
      await p.goto(base+'/games.html?lang='+lang,{waitUntil:'networkidle'});await dismiss();
      await p.locator('#arcade-adventure a.production-card').filter({hasText:game==='evil-doom-boy'?'Evil Doom Boy':'Thumb Command'}).click();
      await p.waitForURL(u=>u.pathname==='/games/'+game+'/');
      await dismiss();await menu();await p.locator('.site-nav>a').filter({hasText:/^News/}).click();await p.waitForLoadState('networkidle');
      check(new URL(p.url()).pathname==='/news.html','News resolved to '+p.url());
      check(new URL(p.url()).searchParams.get('lang')===lang,'News lost locale');
      await p.goBack({waitUntil:'networkidle'});await dismiss();
      check(new URL(p.url()).pathname==='/games/'+game+'/','Back failed');
      if(game==='evil-doom-boy') {
        await p.getByRole('link',{name:'Meet both heroes ↗',exact:true}).click();
        check(new URL(p.url()).pathname==='/games/evil-doom-boy/'&&new URL(p.url()).hash==='#choose-hero','hero anchor escaped page');
        await p.locator('[data-doom-select="girl"]').click();
        check(await p.locator('[data-doom-dual]').getAttribute('data-active-hero')==='girl','hero selector');
      }
      await p.evaluate(()=>scrollTo(0,0));await menu();await p.locator('.site-nav .games-menu>summary').click();
      await p.locator('.view-all-games').click();await p.waitForLoadState('networkidle');
      check(new URL(p.url()).pathname==='/games.html','Games resolved to '+p.url());
      await p.goBack({waitUntil:'networkidle'});await dismiss();await p.evaluate(()=>scrollTo(0,0));
      await p.locator('.site-header .brand').click();await p.waitForLoadState('networkidle');
      check(new URL(p.url()).pathname==='/index.html','Home resolved to '+p.url());
      await p.goBack({waitUntil:'networkidle'});await dismiss();await menu();
      await p.locator('.site-nav>a').filter({hasText:/^News/}).click();await p.waitForLoadState('networkidle');
      check(new URL(p.url()).pathname==='/news.html','navigation after Back failed');
      check(errors.length===0,errors.join(' | '));
      await p.screenshot({path:path.join(out,game+'-'+width+'-'+lang+'.png')});
    } catch(e) {issues.push(e.message);}
    results.push({width,lang,game,issues});await p.close();
  }
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({target:base,results},null,2));
  console.log(JSON.stringify(results.filter(x=>x.issues.length),null,2));console.log(results.length+' nested-page navigation journeys');
  await browser.close();if(server.listening)await new Promise(r=>server.close(r));if(results.some(x=>x.issues.length))process.exitCode=1;
})();
