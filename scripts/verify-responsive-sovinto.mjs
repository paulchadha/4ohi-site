import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = resolve(import.meta.dirname, '..');
const out = resolve(process.env.RESPONSIVE_OUT || 'docs/visual-evidence/sovinto-responsive');
mkdirSync(out, { recursive: true });
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server = createServer((req,res) => { try {
  const path = new URL(req.url,'http://localhost').pathname;
  const file = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
  if (!file.startsWith(root)) throw Error('path');
  res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream'}); res.end(readFileSync(file));
} catch { res.writeHead(404); res.end(); } });
if (!process.env.SITE_URL) await new Promise(ok => server.listen(4232,'127.0.0.1',ok));
const base = process.env.SITE_URL || 'http://127.0.0.1:4232';
const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const baseline = process.env.BASELINE === '1';
const routes = ['index.html','games.html','lifestyle-apps.html','whomly.html','sleep-amigo.html','booyang-city.html','funky-town.html','gildenspire.html','about.html','news.html','support.html','solitaire.html',...(!baseline?['sovinto.html']:[])];
const results=[];
for (const [width,height,zoom] of [[320,844,1],[390,844,1],[768,900,1],[1024,900,1],[1100,900,1],[1440,900,1],[1920,900,1],[844,390,1],[1024,768,1],[768,900,2]]) {
  const page = await browser.newPage({viewport:{width,height},hasTouch:width<=1024});
  for (const route of routes) {
    const errors=[];
    const onError=e=>errors.push(e.message); page.on('pageerror',onError);
    await page.goto(base+'/'+route);
    const consent=page.locator('[data-continue-without-saving]'); if(await consent.isVisible())await consent.click();
    if(zoom===2) await page.addStyleTag({content:'html {font-size:200% !important}'});
    await page.locator('img').evaluateAll(ns=>ns.forEach(n=>n.loading='eager'));
    await page.waitForLoadState('networkidle');
    const issues=await page.evaluate(()=>{
      const issues=[];
      if(document.documentElement.scrollWidth>innerWidth+1) issues.push('page overflow');
      for(const n of document.querySelectorAll('main h1,main h2,main h3,.production-card-copy strong,.brand,.header-tools')) {
        const r=n.getBoundingClientRect();
        if(r.width && (r.right>innerWidth+1||r.left < -1 || n.scrollWidth>n.clientWidth+2)) issues.push(n.tagName+'.'+n.className+': '+n.textContent.trim().slice(0,55));
      }
      for(const n of document.querySelectorAll('main img')) if(!n.complete||!n.naturalWidth) issues.push('broken image '+n.getAttribute('src'));
      return issues;
    });
    results.push({width,height,zoom,route,issues:[...issues,...errors]});
    if (['index.html','lifestyle-apps.html','sovinto.html'].includes(route)&&[390,768,1440].includes(width)) await page.screenshot({path:resolve(out,route.replace('.html','')+'-'+width+'.png'),fullPage:true});
    page.off('pageerror',onError);
  }
  // Open app navigation and exercise its real link at every breakpoint.
  await page.goto(base+'/');
  const privacy=page.locator('[data-continue-without-saving]'); if(await privacy.isVisible())await privacy.click();
  const toggle=page.locator('.menu-toggle'); if(await toggle.isVisible())await toggle.click();
  await page.locator('.nav-lifestyle summary').click();
  const link=page.locator('header a[href*="'+(baseline?'whomly':'sovinto')+'.html"]');
  try {await link.click({timeout:3000});await page.waitForURL(new RegExp('/'+(baseline?'whomly':'sovinto')+'\\.html'));}
  catch(e){results.push({width,route:'app navigation',issues:[e.message.slice(0,220)]});}
  await page.close();
}
writeFileSync(resolve(out,'results.json'),JSON.stringify(results,null,2));
await browser.close(); if(server.listening) await new Promise(ok=>server.close(ok));
const failed=results.filter(x=>x.issues.length); console.log(JSON.stringify(failed,null,2));
console.log(`${results.length} page/viewport checks; ${failed.length} failures`); if(failed.length)process.exitCode=1;
