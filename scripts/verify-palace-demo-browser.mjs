import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { freshSession, meaningfulGame, assertConservation } from '../assets/palace-web/demo-session.js';
const require=createRequire(import.meta.url), {chromium}=require('playwright');
const base=process.env.SITE_URL || 'http://127.0.0.1:4173';
const out=resolve(process.env.PALACE_OUT || 'docs/visual-evidence/final-2026-10-04/palace');mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[], errors=[];
const qa=new URL(base).hostname==='127.0.0.1';
const key='4oh_palace_demo_v1';
const snapshot=p=>p.evaluate(key=>window.__PALACE_WEB_QA__?.snapshot().session || JSON.parse(localStorage.getItem(key)),key);
const same=(a,b)=>assert.deepEqual(meaningfulGame(a.game),meaningfulGame(b.game));
async function open(options={},query='') {
 const {init,...settings}=options;
 const context=await browser.newContext({viewport:{width:390,height:844},...settings});
 if(init)await context.addInitScript(init);
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(`${base}/palace-play.html?${qa?'palaceQa=1&fast=1&':''}${query}`,{waitUntil:'networkidle'});
 const privacy=p.locator('[data-continue-without-saving]');if(await privacy.isVisible().catch(()=>false))await privacy.click();
 await p.locator('#palace-web-game:not([aria-busy])').waitFor();return {context,p};
}
async function test(name,fn){try{await fn();results.push({name,status:'pass'});console.log('PASS '+name);}catch(e){results.push({name,status:'fail',error:e.message});console.error('FAIL '+name+': '+e.stack);}}
async function humanMove(p,last=false) {
 const pickup=p.locator('[data-pickup]');if(await pickup.count()){await pickup.click();return;}
 const cards=p.locator('.palace-human-zone .palace-card:not(:disabled)');assert.ok(await cards.count(),'No usable human card');
 await (last?cards.last():cards.first()).click();
 const selected=p.locator('[data-play-selected]');if(await selected.count())await selected.click();
}
async function waitHuman(p){await p.waitForFunction(key=>{const s=window.__PALACE_WEB_QA__?.snapshot().session || JSON.parse(localStorage.getItem(key));return s?.game.status==='finished'||s?.game.currentPlayer===0;},key);}
await test('Fixed initial allocation; URL seed, language and name cannot select another deal',async()=>{
 for(const query of ['', 'seed=900&players=4&deck=random','lang=en-CA&name=Another%20Player']) {
  const {context,p}=await open({},query);assert.equal(await p.locator('input[name="palace-players"]').count(),0);
  await p.locator('[data-deal]').click();same(await snapshot(p),freshSession());assert.ok(await p.getByText('One fixed deal. As many attempts as you like.',{exact:true}).isVisible());await context.close();
 }
});
await test('Legal moves, exact restart, preferences, and valid progress reload',async()=>{
 const {context,p}=await open();await p.locator('[data-deal]').click();
 await p.locator('[data-sound]').click();await p.locator('[data-motion]').click();
 await p.locator('[data-start-hand]').click();
 for(let moves=0;moves<5;moves++){await waitHuman(p);await humanMove(p);}
 await waitHuman(p);const progress=await snapshot(p);assertConservation(progress);assert.ok(progress.actions.length>5);
 await p.reload({waitUntil:'networkidle'});same(await snapshot(p),progress);const privacy=p.locator('[data-continue-without-saving]');if(await privacy.isVisible())await privacy.click();
 await p.getByRole('button',{name:'Restart this demo',exact:true}).click();same(await snapshot(p),freshSession());
 assert.equal(await p.locator('[data-sound]').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('[data-motion]').getAttribute('aria-pressed'),'true');assert.ok(await p.locator('[data-start-hand]').evaluate(n=>n===document.activeElement));
 await p.screenshot({path:resolve(out,'restart-exact-390.png'),fullPage:true});await context.close();
});
await test('Pending bot callbacks, detached actions, animation cancellation and twenty rapid resets',async()=>{
 const {context,p}=await open({init:()=>{const native=setTimeout;window.__callbacks=[];window.setTimeout=(fn,delay,...args)=>{if(typeof fn==='function')window.__callbacks.push(fn);return native(fn,delay,...args);};}});
 await p.locator('[data-deal]').click();await p.locator('[data-start-hand]').click();
 await waitHuman(p);await humanMove(p);
 await p.evaluate(()=>{window.__oldCallbacks=window.__callbacks.slice();window.__oldCard=document.querySelector('.palace-card:not(:disabled)');document.querySelector('.palace-card')?.animate([{opacity:0},{opacity:1}],{duration:3000});window.__oldAnimations=document.querySelector('#palace-web-game').getAnimations({subtree:true});});
 await p.evaluate(()=>{for(let i=0;i<20;i++)document.querySelector('[data-restart-demo]').click();window.__oldCallbacks.forEach(fn=>fn());window.__oldCard?.click();});
 await p.waitForTimeout(1300);same(await snapshot(p),freshSession());
 assert.ok(await p.evaluate(()=>window.__oldAnimations.every(a=>a.playState==='idle')));assert.equal(await p.locator('[data-start-hand]').count(),1);await context.close();
});
await test('Corrupt, incompatible, invalid and legacy saves recover automatically',async()=>{
 for(const bad of ['{bad',JSON.stringify({...freshSession(),fixtureId:'wrong'}),JSON.stringify({...freshSession(),game:{...freshSession().game,currentPlayer:99}})]) {
  const {context,p}=await open();await p.evaluate(({key,bad})=>localStorage.setItem(key,bad),{key,bad});await p.reload({waitUntil:'networkidle'});same(await snapshot(p),freshSession());assert.ok((await p.locator('[data-palace-notice]').innerText()).includes('saved table could not'));await context.close();
 }
 const {context,p}=await open();await p.evaluate(()=>{localStorage.setItem('4oh_palace_web_v1','{"schemaVersion":1}');localStorage.setItem('unrelated-product','keep');});await p.reload({waitUntil:'networkidle'});same(await snapshot(p),freshSession());assert.equal(await p.evaluate(()=>localStorage.getItem('unrelated-product')),'keep');await context.close();
});
await test('Storage blocked and quota exhausted: playable in memory with truthful notice',async()=>{
 for(const kind of ['get','set']) {
  const {context,p}=await open({init:kind==='get'?()=>{Storage.prototype.getItem=()=>{throw new DOMException('denied','SecurityError');};Storage.prototype.setItem=()=>{throw new DOMException('denied','SecurityError');};}:()=>{Storage.prototype.setItem=()=>{throw new DOMException('full','QuotaExceededError');};}});
  await p.locator('[data-deal]').click();await p.locator('[data-start-hand]').click();
  await p.waitForFunction(()=>document.querySelector('.palace-turn-ribbon')?.textContent.includes('Your turn'));await humanMove(p);await p.locator('[data-restart-demo]').click();
  if(qa)same(await snapshot(p),freshSession());
  assert.deepEqual(await p.locator('.palace-hand [data-card-id]').evaluateAll(ns=>ns.map(n=>n.dataset.cardId)),freshSession().game.players[0].hand.map(c=>c.id));
  assert.ok((await p.locator('[data-palace-notice]').innerText()).includes('will not survive'));await context.close();
 }
});
await test('Recovery control remains usable after a controller render error',async()=>{
 const {context,p}=await open();await p.locator('[data-deal]').click();
 await p.evaluate(()=>{const original=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');let once=true;Object.defineProperty(Element.prototype,'innerHTML',{...original,set(value){if(this.id==='palace-web-game'&&once){once=false;throw Error('Injected rendering failure');}return original.set.call(this,value);}});});
 await p.locator('[data-start-hand]').click();assert.ok(await p.locator('.palace-session-error').isVisible());await p.locator('[data-restart-demo]').click();same(await snapshot(p),freshSession());await context.close();
});
await test('Complete legal game, completion reload, same-deal replay and matching result',async()=>{
 const {context,p}=await open();const finished=[];
 for(let attempt=0;attempt<2;attempt++) {
  if(!attempt)await p.locator('[data-deal]').click();else await p.getByRole('button',{name:'Play this same deal again',exact:true}).click();
  same(await snapshot(p),freshSession());await p.locator('[data-start-hand]').click();let humanActions=0,loops=0;const events=new Set();
  while((await snapshot(p)).game.status!=='finished' && loops++<500) {
   await waitHuman(p);const s=await snapshot(p);assertConservation(s);events.add(s.game.lastEvent?.type);if(s.game.status==='finished')break;
   await humanMove(p);humanActions++;
  }
  const s=await snapshot(p);assert.equal(s.game.status,'finished');assertConservation(s);finished.push(s);assert.ok(await p.locator('[data-replay]').isVisible());
  if(!attempt){await p.screenshot({path:resolve(out,'complete-game-390.png'),fullPage:true});await p.reload({waitUntil:'networkidle'});same(await snapshot(p),s);const privacy=p.locator('[data-continue-without-saving]');if(await privacy.isVisible())await privacy.click();}
  console.log(`Rendered complete game ${attempt+1}: ${humanActions} human actions, ${s.actions.length} total transitions; ${[...events].join(', ')}.`);
 }
 same(finished[0],finished[1]);await context.close();
});
await test('Phone, tablet and desktop; keyboard, log dialog, focus and reduced motion',async()=>{
 for(const [width,height] of [[320,740],[390,844],[430,932],[768,1024],[1024,768],[1440,900]]) {
  const {context,p}=await open({viewport:{width,height},reducedMotion:'reduce'});await p.locator('[data-deal]').focus();await p.keyboard.press('Enter');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: horizontal overflow`);
  const start=p.locator('[data-start-hand]');await start.focus();assert.notEqual(await start.evaluate(n=>getComputedStyle(n).outlineStyle),'none');
  assert.equal(await p.locator('.palace-card').first().evaluate(n=>getComputedStyle(n).transitionDuration),'0s');
  await p.keyboard.press('Enter');await p.locator('[data-log]').click();assert.ok(await p.getByRole('dialog').isVisible());await p.keyboard.press('Escape');assert.ok(!(await p.getByRole('dialog').isVisible()));
  await p.screenshot({path:resolve(out,`table-${width}.png`),fullPage:true});await context.close();
 }
});
await test('No console errors and no QA control on public hostname',async()=>{assert.deepEqual(errors,[]);if(!qa){const {context,p}=await open();assert.equal(await p.evaluate(()=>Boolean(window.__PALACE_WEB_QA__)),false);await context.close();}});
await browser.close();const report={target:base,engine:process.env.BROWSER_PATH || 'Installed Google Chrome (Chromium)',passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length,results,errors};writeFileSync(resolve(out,'browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failed:report.failed}));if(report.failed)process.exitCode=1;
