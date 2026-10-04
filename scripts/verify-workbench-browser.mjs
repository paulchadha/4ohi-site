import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { productCatalog } from "./studio-product-manifest.mjs";
import { loadArticles, articleTypes, articleFile, notesFor, productArchive } from "./workbench-content.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = resolve(import.meta.dirname,"..");
const out = join(root,"docs/visual-evidence/workbench-2026-10-04");
mkdirSync(out,{recursive:true});
const types = {".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".svg":"image/svg+xml",".xml":"application/xml"};
const server = createServer((req,res) => {
  try { const path = new URL(req.url,"http://local").pathname; const file = resolve(root,"."+(path.endsWith("/") ? path+"index.html" : path)); if (!file.startsWith(root+sep)) throw Error("outside root"); res.setHeader("Content-Type",types[extname(file)] || "application/octet-stream"); res.end(readFileSync(file)); }
  catch {res.writeHead(404);res.end("Not found");}
});
await new Promise(done => server.listen(0,"127.0.0.1",done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"});
const results = [], errors = [];
const articles = loadArticles(root);
const test = async(name,fn) => {try {await fn();results.push({name,status:"pass"});console.log("PASS "+name);} catch (error) {results.push({name,status:"fail",error:error.message});console.error("FAIL "+name+": "+error.message);}};
const open = async(route,options={}) => { const p = await browser.newPage(options); p.on("pageerror",e => errors.push(route+": "+e.message)); const response = await p.goto(base+"/"+route,{waitUntil:"networkidle"});assert.ok(response.ok(),route);const dismiss=p.locator("[data-continue-without-saving]");if(await dismiss.isVisible()) await dismiss.click();return p; };
const visible = p => p.locator("[data-workbench-story]:visible");
try {
  await test("All products show the latest shared note and static archive",async() => {
    for (const product of productCatalog) {
      const p=await open(product.infoUrl);
      const journal=p.locator(`[data-product-journal="${product.id}"]`);
      assert.equal(await journal.count(),1,product.title);
      assert.ok((await journal.innerText()).includes("On the workbench"));
      const latest=notesFor(articles,product)[0];
      if(latest) {assert.equal(await journal.locator("time").getAttribute("datetime"),latest.date);assert.ok((await journal.innerText()).includes(latest.title));assert.ok((await p.request.get(base+"/"+productArchive(product))).ok());}
      if(["palace","sovinto","heartstack"].includes(product.id)) await journal.screenshot({path:join(out,product.id+"-journal.png")});
      await p.close();
    }
  });
  await test("Every product filter returns exactly its associated articles",async() => {
    const p=await open("news.html");
    for(const product of productCatalog){await p.locator("[data-workbench-product]").selectOption(product.id);assert.equal(await visible(p).count(),Math.min(8,notesFor(articles,product).length),product.title);assert.ok(await visible(p).evaluateAll((nodes,id)=>nodes.every(n=>n.dataset.productIds.split(" ").includes(id)),product.id));}
    await p.close();
  });
  await test("Article types, collection filters and combined filters",async() => {
    const p=await open("news.html");
    for(const type of Object.keys(articleTypes)){await p.locator("[data-workbench-type]").selectOption(type);assert.equal(await visible(p).count(),Math.min(8,articles.filter(a=>a.articleType===type).length));}
    await p.locator("[data-workbench-type]").selectOption("developer-diary");await p.locator("[data-workbench-product]").selectOption("gildenspire");assert.equal(await visible(p).count(),notesFor(articles,{id:"gildenspire"}).filter(a=>a.articleType==="developer-diary").length);
    await p.locator("[data-workbench-type]").selectOption("all");await p.locator("[data-workbench-product]").selectOption("all");await p.locator("[data-workbench-tag]").selectOption("lifestyle-apps");assert.ok(await visible(p).evaluateAll(nodes=>nodes.every(n=>n.dataset.tags.split(" ").includes("lifestyle-apps"))));
    await p.close();
  });
  await test("Reading order, load more, keyboard focus and reload state",async() => {
    const p=await open("news.html?lang=en-CA");
    assert.equal(await visible(p).count(),8);assert.equal(await p.locator("[data-workbench-featured]:visible").count(),1);
    await p.locator("[data-workbench-order]").selectOption("oldest");
    assert.equal(await visible(p).first().getAttribute("data-date"),articles.at(-1).date);
    assert.equal(await p.locator("[data-workbench-featured]:visible").count(),0);
    const more=p.locator("[data-workbench-more]");await more.focus();await p.keyboard.press("Enter");assert.equal(await visible(p).count(),16);
    assert.ok(await p.evaluate(()=>document.activeElement.matches("[data-workbench-story] h3 a")));
    assert.equal(new URL(p.url()).searchParams.get("lang"),"en-CA");assert.equal(new URL(p.url()).searchParams.get("page"),"2");
    await p.reload({waitUntil:"networkidle"});assert.equal(await visible(p).count(),16);assert.equal(await p.locator("[data-workbench-order]").inputValue(),"oldest");
    while(await more.isVisible()) await more.click();assert.equal(await visible(p).count(),articles.length);assert.ok(await more.isHidden());await p.close();
  });
  await test("Historical name aliases preserve one product feed",async() => {
    for(const [alias,id] of [["palace","palace"],["evil-doom","evil-doom-boy"],["people-lens","whomly"],["HeartStack Unicorn Blast","heartstack"],["unicorn-blast","heartstack"],["Commander Thumb","thumb-command"]]){const p=await open("news.html?tag="+encodeURIComponent(alias));assert.equal(await p.locator("[data-workbench-product]").inputValue(),id);assert.equal(await visible(p).count(),Math.min(8,notesFor(articles,{id}).length));await p.close();}
  });
  await test("English articles remain honest under French, Canadian and Arabic controls",async() => {
    for(const language of ["fr","en-CA","ar"]){const a=articles[0],p=await open(articleFile(a.slug)+"?lang="+language);assert.equal(await p.locator("select[data-locale]").first().inputValue(),language);assert.equal(await p.locator(".workbench-article").getAttribute("lang"),"en");assert.equal(await p.locator("h1").innerText(),a.title);assert.equal(await p.locator("[data-workbench-language]").isVisible(),language!=="en-CA");assert.equal(await p.locator('link[hreflang="fr"]').count(),0);assert.equal(await p.locator(".workbench-article").evaluate(n=>getComputedStyle(n).direction),"ltr");await p.close();}
  });
  await test("Static reading and mobile native navigation work with JavaScript disabled",async() => {
    const p=await open("news.html",{javaScriptEnabled:false,viewport:{width:390,height:844}});
    assert.equal(await visible(p).count(),articles.length);assert.ok(await p.locator("[data-workbench-controls]").isHidden());
    assert.ok(await p.locator('.site-nav>a[href="news.html"]').isVisible());
    await p.getByRole("link",{name:"Start at the beginning →",exact:true}).click();
    assert.ok((await p.locator("h1").innerText()).includes("Start at the beginning"));
    const originCount=articles.filter(a=>a.seriesId==="product-origins").length;assert.equal(await visible(p).count(),originCount);
    await p.locator("[data-workbench-story] h3 a").first().click();assert.ok(await p.locator(".workbench-article .prose").isVisible());
    await p.goto(base+"/news-archive.html");assert.equal(await p.locator("[data-workbench-story]").first().getAttribute("data-date"),articles.at(-1).date);
    await p.goto(base+"/news-product-heartstack.html");assert.equal(await p.locator("[data-workbench-story]").count(),notesFor(articles,{id:"heartstack"}).length);
    await p.close();
  });
  await test("Sling is in desktop and mobile navigation with no playable CTA",async() => {
    for(const width of [390,1440]){const p=await open("index.html",{viewport:{width,height:900}});const toggle=p.locator(".menu-toggle");if(await toggle.isVisible())await toggle.click();const summary=p.locator(".games-menu>summary");await summary.focus();await p.keyboard.press("Enter");const link=p.locator('.site-nav a[href*="sling-nouveau.html"]');await link.waitFor({state:"visible"});await link.click();assert.equal(await p.locator("h1").innerText(),"Sling Nouveau");assert.equal(await p.locator('main a').filter({hasText:/Play now|Play Sling/i}).count(),0);assert.equal(await p.locator('main img').count(),0);await p.close();}
  });
  await test("Responsive text and keyboard focus at 320 through 1920 pixels",async() => {
    for(const width of [320,390,768,1024,1440,1920])for(const route of ["news.html","sling-nouveau.html",articleFile(articles[0].slug)]){const p=await open(route,{viewport:{width,height:900},reducedMotion:"reduce"});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} ${width}: horizontal overflow`);const clipped=await p.locator("main h1,main h2,main h3").evaluateAll(ns=>ns.filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>n.textContent));assert.deepEqual(clipped,[],`${route} ${width}: clipped headings`);const link=p.locator("main a").first();await p.keyboard.press("Tab");await link.focus();assert.notEqual(await link.evaluate(n=>getComputedStyle(n).outlineStyle),"none",`${route} ${width}: keyboard focus`);if(width===390||width===1440){await p.locator("main img").evaluateAll(async nodes => {nodes.forEach(n=>{n.loading="eager";});await Promise.all(nodes.map(n=>n.complete ? Promise.resolve() : new Promise(done=>{n.onload=done;n.onerror=done;})));});await p.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});await p.screenshot({path:join(out,route.replace(".html","")+"-"+width+".png"),fullPage:true});}await p.close();}
  });
  await test("All new reading routes and published article references return successfully",async() => {
    const p=await open("news.html");
    for(const route of ["news.html","news-archive.html","news-origins.html","sling-nouveau.html",...productCatalog.map(productArchive),...articles.map(a=>articleFile(a.slug))]){const response=await p.request.get(base+"/"+route);assert.ok(response.ok(),route);}
    assert.deepEqual(errors,[]);await p.close();
  });
} finally {
  writeFileSync(join(out,"results.json"),JSON.stringify({target:base,products:productCatalog.length,articles:articles.length,results,errors},null,2)+"\n");
  await browser.close();await new Promise(done=>server.close(done));
}
if(results.some(r=>r.status==="fail"))process.exitCode=1;
else console.log(`Workbench browser QA passed: ${results.length} gates, ${productCatalog.length} product journals and filters, ${articles.length} articles.`);
