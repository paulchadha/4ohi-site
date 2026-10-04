import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";
import { productCatalog } from "./studio-product-manifest.mjs";
import { loadArticles, articleFile, productArchive, notesFor, resolveProductId, escapeHtml } from "./workbench-content.mjs";
import { previewPost } from "./preview-post.mjs";
const root = resolve(import.meta.dirname,"..");
const articles = loadArticles(root);
const original = JSON.parse(readFileSync(join(root,"content/publication-history.json"),"utf8"));
const feed = readFileSync(join(root,"feed.xml"),"utf8");
const sitemap = readFileSync(join(root,"sitemap.xml"),"utf8");
assert.equal(productCatalog.length,20);
for (const old of original) {
  const a = articles.find(a => a.id === old.id);
  assert.ok(a, `Historical article missing: ${old.id}`);
  assert.equal(a.date,old.date); assert.equal(a.slug,old.slug);
  assert.ok(existsSync(join(root,articleFile(a.slug))));
  assert.ok(feed.includes(`<guid>${old.guid}</guid>`));
  assert.ok(feed.includes(`<pubDate>${new Date(`${old.date}T12:00:00Z`).toUTCString()}</pubDate>`));
}
for (const product of productCatalog) {
  const route = product.infoUrl.endsWith("/") ? product.infoUrl+"index.html" : product.infoUrl;
  const html = readFileSync(join(root,route),"utf8");
  assert.ok(html.includes(`data-product-journal="${product.id}"`),`${product.title}: journal missing`);
  assert.ok(html.includes("On the workbench"));
  const latest = notesFor(articles,product)[0];
  if (latest) { assert.ok(html.includes(articleFile(latest.slug))); assert.ok(html.includes(`datetime="${latest.date}"`)); assert.ok(html.includes(productArchive(product))); }
  assert.ok(sitemap.includes(`https://4ohi.com/${productArchive(product)}`));
}
assert.equal(resolveProductId("HeartStack Unicorn Blast"),"heartstack");
assert.equal(resolveProductId("Unicorn Blast"),"heartstack");
assert.equal(resolveProductId("Unicorn Land Adventures"),"unicorn-land");
assert.equal(resolveProductId("People Lens"),"whomly");
assert.equal(resolveProductId("Evil Doom Girl Adventures"),"evil-doom-boy");
assert.equal(resolveProductId("Commander Thumb"),"thumb-command");
const sling = productCatalog.find(p => p.id === "sling-nouveau");
assert.equal(sling.playable,false); assert.equal(sling.playUrl,null); assert.equal(sling.artwork,null);
for (const file of ["index.html","games.html","news.html","sling-nouveau.html"]) assert.ok(readFileSync(join(root,file),"utf8").includes("Sling Nouveau"));
assert.ok(!readFileSync(join(root,"sling-nouveau.html"),"utf8").includes("Play Sling"));
assert.ok(readFileSync(join(root,"_config.yml"),"utf8").includes("  - content"));

// Isolated full-build checks exercise privacy, cross-product propagation and idempotence.
const scratch = mkdtempSync(join(tmpdir(),"4ohi-workbench-"));
try {
  for (const entry of readdirSync(root,{withFileTypes:true})) {
    if ([".git","account-app","node_modules","docs"].includes(entry.name)) continue;
    cpSync(join(root,entry.name),join(scratch,entry.name),{recursive:entry.isDirectory()});
  }
  const build = () => execFileSync(process.execPath,["scripts/build-site.mjs"],{cwd:scratch,stdio:"pipe"});
  const publicFiles = directory => readdirSync(directory,{withFileTypes:true}).flatMap(e => {
    if (["content","scripts","docs",".git","node_modules","account-app"].includes(e.name)) return [];
    const file = join(directory,e.name); return e.isDirectory() ? publicFiles(file) : /\.(html|xml|js|css)$/.test(e.name) ? [file] : [];
  });
  const baseline = new Map(publicFiles(scratch).map(f => [f,readFileSync(f,"utf8")]));
  build();
  for (const [f,bytes] of baseline) assert.equal(readFileSync(f,"utf8"),bytes,`Non-idempotent build: ${f}`);
  const canary = {...articles[0],id:"private-workbench-canary",slug:"private-workbench-canary",title:"PRIVATE_WORKBENCH_CANARY",description:"PRIVATE_WORKBENCH_CANARY excerpt",body:[{heading:"PRIVATE_WORKBENCH_CANARY",paragraphs:["PRIVATE_WORKBENCH_CANARY body"]}],status:"draft",featured:false,productIds:["sling-nouveau","gin-rummy"],date:null};
  const records = [canary,...articles];
  const save = () => writeFileSync(join(scratch,"content/news.json"),JSON.stringify(records));
  save(); build();
  assert.ok(!existsSync(join(scratch,articleFile(canary.slug))));
  for (const file of publicFiles(scratch)) assert.ok(!readFileSync(file,"utf8").includes("PRIVATE_WORKBENCH_CANARY"),`Draft leak: ${file}`);
  const preview = await previewPost(canary.slug,scratch);
  try {
    const response=await fetch(preview.url), html=await response.text();
    assert.ok(html.includes("PRIVATE_WORKBENCH_CANARY body"));
    assert.ok(html.includes('content="noindex,nofollow"'));
    assert.equal(response.headers.get("x-robots-tag"),"noindex,nofollow");
    assert.equal((await fetch(preview.url.replace(/news-private-workbench-canary.html/,"content/news.json"))).status,404);
    assert.equal(JSON.parse(readFileSync(join(scratch,"content/news.json"),"utf8"))[0].status,"draft");
  } finally {await preview.close();}
  canary.status="published"; canary.date="2026-10-04"; save(); build();
  for (const file of [articleFile(canary.slug),"news.html","index.html","sling-nouveau.html","gin-rummy.html","feed.xml",productArchive(sling)]) assert.ok(readFileSync(join(scratch,file),"utf8").includes("PRIVATE_WORKBENCH_CANARY"),`Shared article missing from ${file}`);
  canary.title='A title with "quotes" & <angle brackets>';
  canary.body=[{heading:"Literal text",paragraphs:['<img src="x" onerror="alert(1)">']}];
  save();build();
  const escaped = readFileSync(join(scratch,articleFile(canary.slug)),"utf8");
  assert.ok(escaped.includes(escapeHtml(canary.title)));
  assert.ok(escaped.includes('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;'));
  assert.ok(!escaped.includes('<img src="x"'));
  canary.status="draft"; save();build();
  assert.ok(!existsSync(join(scratch,articleFile(canary.slug))),"Withdrawn article left a public route");
  for (const file of publicFiles(scratch)) assert.ok(!readFileSync(file,"utf8").includes(escapeHtml(canary.title)),`Withdrawn draft leak: ${file}`);
  canary.productIds=["invented-product"]; save();assert.throws(build,/./,"Unknown product ID accepted");
  console.log(`PASS ${original.length} preserved articles/GUIDs/dates; ${productCatalog.length} product journals; alias identities; Sling honesty; deterministic rebuild; draft and withdrawn-route isolation; shared multi-product publication; literal text escaping; invalid-ID rejection.`);
} finally {
  if (resolve(scratch).startsWith(resolve(tmpdir())+sep) && scratch.includes("4ohi-workbench-")) rmSync(scratch,{recursive:true,force:true});
}
