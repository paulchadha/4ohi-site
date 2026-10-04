import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadArticles, articleFile } from './workbench-content.mjs';
const root=resolve(import.meta.dirname,'..'),articles=loadArticles(root),original=JSON.parse(readFileSync(resolve(root,'content/publication-history.json')));
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const base=process.env.SITE_URL || 'http://127.0.0.1:4173';
const out=resolve(process.env.EDITORIAL_OUT || 'docs/visual-evidence/final-2026-10-04/editorial');mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const inspected=[];
async function dismiss(){const b=page.locator('[data-continue-without-saving]');if(await b.isVisible())await b.click();}
try {
 for(const a of articles) {
  const response=await page.goto(`${base}/${articleFile(a.slug)}`,{waitUntil:'networkidle'});assert.ok(response.ok(),a.slug);await dismiss();
  assert.equal(await page.locator('h1').innerText(),a.title);
  const text=await page.locator('.workbench-article').innerText();for(const section of a.body)for(const p of section.paragraphs)assert.ok(text.includes(p),`${a.slug}: missing full paragraph`);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),`https://4ohi.com/${articleFile(a.slug)}`);
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'),`${a.title} | Four of Hearts News`);
  assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
  const ld=await page.locator('script[type="application/ld+json"]').allTextContents(),blog=ld.map(t=>JSON.parse(t)).find(x=>x['@type']==='BlogPosting');assert.equal(blog.datePublished,a.date);assert.equal(blog.headline,a.title);
  if(!original.some(o=>o.id===a.id))assert.equal(a.date,'2026-10-04');
  if(a.historicalPeriod)assert.ok(text.includes(a.historicalPeriod));
  inspected.push({slug:a.slug,date:a.date,paragraphs:a.body.reduce((n,s)=>n+s.paragraphs.length,0)});
 }
 const rss=await (await page.request.get(base+'/feed.xml')).text(),site=await(await page.request.get(base+'/sitemap.xml')).text();
 const parsed=await page.evaluate(({rss,site})=>{const parse=t=>new DOMParser().parseFromString(t,'application/xml');const r=parse(rss),s=parse(site);return {error:r.querySelector('parsererror')?.textContent||s.querySelector('parsererror')?.textContent,items:[...r.querySelectorAll('item')].map(n=>({guid:n.querySelector('guid')?.textContent,link:n.querySelector('link')?.textContent,date:n.querySelector('pubDate')?.textContent})),locs:[...s.querySelectorAll('loc')].map(n=>n.textContent)};},{rss,site});
 assert.ok(!parsed.error,parsed.error);assert.equal(parsed.items.length,45);assert.equal(new Set(parsed.items.map(a=>a.guid)).size,45);
 for(const old of original){const item=parsed.items.find(a=>a.guid===old.guid);assert.ok(item,old.id);assert.equal(item.date,new Date(`${old.date}T12:00:00Z`).toUTCString());}
 for(const a of articles)assert.ok(parsed.locs.includes('https://4ohi.com/'+articleFile(a.slug)),a.slug);
 await page.goto(base+'/news.html?lang=en-CA',{waitUntil:'networkidle'});await dismiss();
 await page.locator('[data-workbench-product]').selectOption('sling-nouveau');await page.locator('[data-workbench-product]').selectOption('heartstack');
 await page.goBack();assert.equal(await page.locator('[data-workbench-product]').inputValue(),'sling-nouveau');await page.goForward();assert.equal(await page.locator('[data-workbench-product]').inputValue(),'heartstack');
 const link=page.locator('[data-workbench-story]:visible h3 a').first();await link.click();await page.goBack();assert.equal(await page.locator('[data-workbench-product]').inputValue(),'heartstack');
 await page.goto(base+'/news-origins.html',{waitUntil:'networkidle'});await dismiss();assert.ok((await page.locator('[data-workbench-story]').first().innerText()).includes('Before the dragons'));assert.ok((await page.locator('[data-workbench-story]').nth(2).innerText()).includes('Editorial interlude'));
 for(const [route,width] of [['news.html',1440],['news.html',390],['sling-nouveau.html',390],['news-before-the-dragons-there-were-cards.html',1440],['news-origins.html',768]]) {
  await page.setViewportSize({width,height:width===390?844:1000});await page.goto(base+'/'+route,{waitUntil:'networkidle'});await dismiss();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:resolve(out,route.replace('.html','')+'-'+width+'.png'),fullPage:true});
 }
 for(const path of ['content/news.json','content/article-template.json','content/drafts/private-workbench-canary.json','news-private-workbench-canary.html'])assert.equal((await page.request.get(base+'/'+path)).status(),404,`Private output leaked: ${path}`);
 assert.deepEqual(errors,[]);
 writeFileSync(resolve(out,'results.json'),JSON.stringify({target:base,engine:process.env.BROWSER_PATH||'Google Chrome',articles:45,preservedIdentifiers:21,parsedRss:true,parsedSitemap:true,history:true,privateOutputsExcluded:true,errors,inspected},null,2));
 console.log('PASS all 45 full articles, dates, canonical/metadata, XML RSS/sitemap, 21 preserved GUIDs, origin sequence, browser back/forward, and private-output exclusion.');
} finally {await browser.close();}
