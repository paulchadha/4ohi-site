import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { publishDue, utcToday } from './publish-due-news.mjs';
import { productCatalog } from './studio-product-manifest.mjs';
import { loadArticles } from './workbench-content.mjs';
const root=resolve(import.meta.dirname,'..'), records=JSON.parse(readFileSync(join(root,'content/news.json'),'utf8'));
const campaign=records.filter(a=>a.scheduledFor).sort((a,b)=>a.scheduledFor.localeCompare(b.scheduledFor)), today=utcToday(), publicArticles=loadArticles(root);
// Press Ahead takes the October 23 studio-note slot; GildenSpire is retained as unscheduled backlog.
assert.equal(campaign.length,20);assert.equal(new Set(campaign.flatMap(a=>a.productIds)).size,20);
assert.equal(records.find(a=>a.id==="press-ahead-a-little-head-start").scheduledFor,"2026-10-23");
assert.equal(records.find(a=>a.id==="gildenspire-scenic-route").scheduledFor,null);
// Reel Fun and Gloze introductions do not expand the original daily campaign.
assert.deepEqual(new Set(campaign.flatMap(a=>a.productIds)),new Set(productCatalog.filter(p=>!["gildenspire","reel-fun","gloze"].includes(p.id)).map(p=>p.id)));
assert.equal(campaign[0].scheduledFor,'2026-10-20');assert.equal(campaign.at(-1).scheduledFor,'2026-11-08');
const fixture=structuredClone(campaign);fixture.forEach(a=>{a.status='draft';a.date=null;a.featured=false;});
assert.deepEqual(publishDue(fixture,'2026-10-19'),[]);
assert.equal(publishDue(fixture,'2026-10-20').length,1);
assert.equal(fixture.filter(a=>a.status==='published').length,1);
assert.equal(publishDue(fixture,'2026-10-20').length,0);
assert.equal(publishDue(fixture,'2026-10-21').length,1);
assert.equal(fixture.filter(a=>a.featured).length,1);
assert.equal(fixture.find(a=>a.featured).productIds[0],'gin-rummy');
assert.equal(publishDue(fixture,'2026-10-24').length,3);
assert.equal(fixture.find(a=>a.productIds[0]==='sleep-amigo').date,'2026-10-24','Late runs must use the actual publication day');
assert.ok(fixture.filter(a=>a.status==='published').every(a=>a.date<='2026-10-24'));
assert.ok(publicArticles.every(a=>a.date<=today));
const files=[];
function scan(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(['.git','docs','content','scripts','node_modules','account-app'].includes(e.name))continue;const p=join(dir,e.name);if(e.isDirectory())scan(p);else if(/\.(html|xml)$/.test(e.name))files.push(p);}}
scan(root);
for(const a of campaign.filter(a=>a.status==='draft')){
  assert.ok(a.scheduledFor>today,'Due draft still awaits publication: '+a.slug);
  assert.ok(!existsSync(join(root,`news-${a.slug}.html`)),a.slug+' exposed as HTML');
  for(const file of files)assert.ok(!readFileSync(file,'utf8').includes(a.slug),'Future post leaked into '+file);
}
assert.ok(readFileSync(join(root,'_config.yml'),'utf8').includes('  - content'));
console.log(`PASS ${campaign.length} catalog posts; truthful dates; daily transitions; overdue/idempotent publishing; ${campaign.filter(a=>a.status==='draft').length} future drafts excluded from ${files.length} public HTML/XML files.`);
