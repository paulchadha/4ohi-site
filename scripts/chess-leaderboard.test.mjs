import test from 'node:test';
import assert from 'node:assert/strict';
import {parseChessBoard,createChessReader,feedUrl,ELIGIBILITY} from '../assets/chess-leaderboard/client.mjs';
const now=1795494000000;
const player=(i,options={})=>({publicId:'fixture-public-'+i,handle:'FixtureChess'+i,rank:i,rating:1800-i,games:1,provisional:true,category:'live',pool:'rapid',...options});
const board=(options={})=>({players:[player(1),player(2)],total:2,me:null,rankingEligibilityVersion:ELIGIBILITY,lastUpdated:now,...options});
const response=b=>new Response(JSON.stringify(b),{headers:{'content-type':'application/json'}});
test('public human results preserve authoritative competition ranks and service tie order, stripping IDs',()=>{
 const b=board({players:[player(1,{rating:1700}),player(2,{rating:1700,rank:1}),player(3,{rating:1600,rank:3,games:20,provisional:false})],total:3});
 const parsed=parseChessBoard(b,'rapid',now);assert.deepEqual(parsed.rows.map(r=>r.rank),[1,1,3]);assert.deepEqual(parsed.rows.map(r=>r.handle),['FixtureChess1','FixtureChess2','FixtureChess3']);assert.equal(parsed.rows[2].provisional,false);assert.equal('publicId' in parsed.rows[0],false);
});
test('at most 25 players appear, even if the supported feed returns a larger page',()=>{const b=board({players:Array.from({length:40},(_,i)=>player(i+1)),total:80});assert.equal(parseChessBoard(b,'rapid',now).rows.length,25);});
test('confirmed empty feed is distinct from missing, incomplete or invalid data',()=>{assert.equal(parseChessBoard(board({players:[],total:0}),'rapid',now).rows.length,0);for(const b of [null,{},board({players:[]}),board({players:[player(1)],total:3}),board({lastUpdated:now+61000}),board({rankingEligibilityVersion:'unknown'})])assert.throws(()=>parseChessBoard(b,'rapid',now));});
test('bot, test/development, wrong pool, unrated starting values and private fields never reach display',()=>{
 for(const changes of [{category:'computer'},{category:'development'},{pool:'blitz'},{games:0,rating:1500},{provisional:false},{email:'fixture@example.invalid'},{accountId:'PRIVATE_FIXTURE'},{handle:'fixture@example.invalid'},{handle:'<img onerror=fixture>'},{rank:2}])assert.throws(()=>parseChessBoard(board({players:[player(1,changes)],total:1}),'rapid',now));
 assert.throws(()=>parseChessBoard(board({me:{handle:'PRIVATE_FIXTURE'}}),'rapid',now));assert.throws(()=>parseChessBoard(board({account:'PRIVATE_FIXTURE'}),'rapid',now));
});
test('incorrect order, ties, duplicate identities and incomplete Top 25 are rejected',()=>{
 for(const players of [[player(1),player(2,{rating:1900})],[player(1),player(2,{rating:1799})],[player(1),player(2,{publicId:'fixture-public-1'})]])assert.throws(()=>parseChessBoard(board({players}),'rapid',now));
 assert.throws(()=>parseChessBoard(board({players:Array.from({length:24},(_,i)=>player(i+1)),total:26}),'rapid',now));
});
test('pool URLs are fixed, public, credential-free GETs with the real 25 limit',async()=>{
 const calls=[],r=createChessReader({now:()=>now,fetcher:async(url,options)=>{calls.push(url);assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.redirect,'error');assert.equal(options.cache,'no-store');assert.equal(Object.hasOwn(options.headers,'Authorization'),false);return response(board());}});await r.load('rapid');assert.equal(r.snapshot().status,'ready');assert.deepEqual(calls,[feedUrl('rapid')]);assert.throws(()=>feedUrl('computer'));r.dispose();
});
test('empty response and unavailable service produce different user states',async()=>{
 const empty=createChessReader({now:()=>now,fetcher:async()=>response(board({players:[],total:0}))});await empty.load();assert.equal(empty.snapshot().status,'empty');empty.dispose();
 const failed=createChessReader({now:()=>now,fetcher:async()=>new Response('Unavailable',{status:503})});await failed.load();assert.equal(failed.snapshot().status,'error');assert.equal(failed.snapshot().data,null);failed.dispose();
});
test('background refresh retains data and failure is stale; retry returns current data',async()=>{
 let fail=false,resolve;const states=[],r=createChessReader({now:()=>now,onChange:s=>states.push(s),fetcher:async()=>fail?new Response('Unavailable',{status:503}):response(board())});await r.load();const data=r.snapshot().data;fail=true;await r.load();assert.equal(states.at(-2).status,'refreshing');assert.equal(states.at(-2).data,data);assert.equal(r.snapshot().status,'stale');assert.equal(r.snapshot().data,data);fail=false;await r.load();assert.equal(r.snapshot().status,'ready');r.dispose();
});
test('late Rapid response cannot replace a newly selected Blitz pool',async()=>{
 let finishRapid;const r=createChessReader({now:()=>now,fetcher:url=>url.includes('pool=rapid')?new Promise(resolve=>finishRapid=()=>resolve(response(board()))):Promise.resolve(response(board({players:[],total:0})))});const old=r.load('rapid');await Promise.resolve();await r.load('blitz');assert.equal(r.snapshot().pool,'blitz');assert.equal(r.snapshot().status,'empty');finishRapid();await old;assert.equal(r.snapshot().pool,'blitz');assert.equal(r.snapshot().data.rows.length,0);r.dispose();
});
test('a failed pool switch clears previous pool rows and does not mislabel them',async()=>{
 const r=createChessReader({now:()=>now,fetcher:async url=>url.includes('rapid')?response(board()):new Response('Unavailable',{status:503})});await r.load('rapid');await r.load('blitz');assert.equal(r.snapshot().pool,'blitz');assert.equal(r.snapshot().data,null);assert.equal(r.snapshot().status,'error');r.dispose();
});
test('network timeout and synchronous failure recover without a stuck pending request',async()=>{
 let fail=true;const r=createChessReader({now:()=>now,timeoutMs:5,fetcher:(url,{signal})=>fail?new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true})):Promise.resolve(response(board()))});await r.load();assert.equal(r.snapshot().status,'error');fail=false;await r.load();assert.equal(r.snapshot().status,'ready');r.dispose();
 let sync=true;const s=createChessReader({now:()=>now,fetcher:()=>{if(sync)throw Error('offline');return response(board());}});await s.load();sync=false;await s.load();assert.equal(s.snapshot().status,'ready');s.dispose();
});
