import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createPublicLeaderboardReader,parsePublicStandings,LEADERBOARD_URL,REFRESH_MS} from '../assets/palace-leaderboard/client.mjs';
const player=(i=1)=>({playerId:`00000000-0000-4000-8000-${String(i).padStart(12,'0')}`,name:`Player ${i}`,avatar:'♠',rank:i,rating:1600-i,wins:1,matches:2});
const board=(rows=[player()])=>({apiVersion:1,game:'palace',mode:'ranked',metric:'rating',metricLabel:'Ranked rating',ordering:'rating-desc,wins-desc,account-id-asc',tiePolicy:'shared-rank-rating-wins',eligibleCount:rows.length,snapshotAt:'2026-11-08T18:00:00Z',activatedAt:'2026-11-01T18:00:00Z',version:'4',rulesVersion:'palace-v2',policyVersion:'palace-pairwise-12-v1',rows,topPlayer:rows[0]||null});
test('public reader binds the canonical production endpoint without cookies, tokens, redirects or cache',async()=>{
  const states=[],reader=createPublicLeaderboardReader({fetcher:async(url,options)=>{
    assert.equal(url,LEADERBOARD_URL);assert.equal(new URL(url).origin,'https://plankton-app-qgwhz.ondigitalocean.app');
    assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');assert.equal(options.headers,undefined);assert.equal(options.referrerPolicy,'no-referrer');return Response.json(board());
  },onChange:s=>states.push(s)});
  await reader.load();assert.deepEqual(states.map(s=>s.status),['loading','ready']);assert.equal(reader.snapshot().data.version,'4');reader.dispose();
});
test('empty successful results are distinct from service failure and malformed responses',async()=>{
  for(const [response,status]of [[()=>Response.json(board([])),'empty'],[()=>new Response('Unavailable',{status:503}),'error'],[()=>Response.json({rows:[]}),'error']]){
    const reader=createPublicLeaderboardReader({fetcher:async()=>response()});await reader.load();assert.equal(reader.snapshot().status,status);assert.equal(reader.snapshot().data===null,status==='error');reader.dispose();
  }
});
test('failed refresh preserves real prior rows and labels them stale; retry recovers the new version',async()=>{
  let calls=0;const reader=createPublicLeaderboardReader({fetcher:async()=>{calls++;if(calls===2)throw Error('Network error');return Response.json({...board(),version:calls});}});
  await reader.load();await reader.load();assert.equal(reader.snapshot().status,'stale');assert.equal(reader.snapshot().data.version,1);assert.match(reader.snapshot().message,/last received/);
  await reader.load();assert.equal(reader.snapshot().status,'ready');assert.equal(reader.snapshot().data.version,3);reader.dispose();
});
test('a synchronous network failure is retryable and overlapping loads issue one request',async()=>{
  let calls=0,release;const reader=createPublicLeaderboardReader({fetcher:()=>{if(++calls===1)throw Error('Offline');return new Promise(resolve=>release=()=>resolve(Response.json(board())));}});
  await reader.load();assert.equal(reader.snapshot().status,'error');const a=reader.load(),b=reader.load();await Promise.resolve();assert.equal(calls,2);release();await Promise.all([a,b]);assert.equal(reader.snapshot().status,'ready');reader.dispose();
});
test('disposed readers cannot publish a late response or fetch again',async()=>{
  let release,calls=0;const states=[],reader=createPublicLeaderboardReader({fetcher:()=>{calls++;return new Promise(resolve=>release=()=>resolve(Response.json(board())));},onChange:s=>states.push(s)});
  const request=reader.load();await Promise.resolve();reader.dispose();release();await request;await reader.load();assert.equal(calls,1);assert.deepEqual(states.map(s=>s.status),['loading']);
});
test('the public decoder rejects personal context, provider identities and private fields',()=>{
  for(const value of [{...board(),own:{rank:1}},{...board(),email:'private@example.invalid'},board([{...player(),user_id:'canonical-owner'}]),board([{...player(),isYou:true}]),board([{...player(),subject:'google-oauth2|private'}])])assert.throws(()=>parsePublicStandings(value));
  assert.equal(parsePublicStandings(board()).rows[0].playerId,player().playerId);
});
test('the decoder preserves shared ranks, rejects duplicate IDs and requires the champion to match',()=>{
  const tied=[player(1),{...player(2),rank:1,rating:1599}];assert.deepEqual(parsePublicStandings(board(tied)).rows.map(p=>p.rank),[1,1]);
  assert.throws(()=>parsePublicStandings(board([player(),player()])));assert.throws(()=>parsePublicStandings({...board(),topPlayer:player(2)}));
});
test('incomplete counts and invalid eligibility or ordering cannot look like successful empty standings',()=>{
  for(const value of [{...board([]),eligibleCount:32},{...board(),eligibleCount:32},board([{...player(),matches:0,wins:0}]),board([{...player(),rank:2}]),board([player(),{...player(2),rating:1700}]),board([player(),{...player(2),rating:1599,rank:2}])])assert.throws(()=>parsePublicStandings(value));
});
test('PostgreSQL bigint version strings are preserved without lossy numeric conversion',()=>{
  assert.equal(parsePublicStandings({...board(),version:'9223372036854775807'}).version,'9223372036854775807');
  assert.equal(parsePublicStandings({...board(),version:4}).version,4);
  for(const value of ['-1','1.5','unknown',Number.MAX_SAFE_INTEGER+1])assert.throws(()=>parsePublicStandings({...board(),version:value}));
});
test('generated route binds module, exact API CSP, public-only copy and usable Palace link',()=>{
  const page=readFileSync(new URL('../palace-leaderboard.html',import.meta.url),'utf8'),palace=readFileSync(new URL('../palace.html',import.meta.url),'utf8');
  assert.match(page,/connect-src 'self' https:\/\/plankton-app-qgwhz\.ondigitalocean\.app;/);assert.match(page,/<script type="module" src="assets\/palace-leaderboard\/client\.mjs\?v=[a-f0-9]+"/);assert.match(page,/personal standing stays private/);assert.match(palace,/href="palace-leaderboard.html">Ranked leaderboard/);assert.equal(REFRESH_MS,5000);
  assert.doesNotMatch(page,/Database Player|account:profile|access_token|own\.rank/);
});
