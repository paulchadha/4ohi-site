import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import cp from 'node:child_process';
import {WEB_GAMES,GAME_ORIGIN,CATALOG_URL,parseCatalog,parsePublicBoard,createGameBoardReader} from '../assets/game-leaderboards/client.mjs';
import {catalog,capability,row,board} from './game-leaderboards-fixtures.mjs';
const clone=structuredClone,reply=value=>Response.json(value);
test('decoder binds actual isolated PostgreSQL public output and actual service OFF catalog',()=>{
 const realCatalog=JSON.parse(fs.readFileSync(new URL('./fixtures/seven-game-catalog-isolated.json',import.meta.url))),result=JSON.parse(fs.readFileSync(new URL('./fixtures/seven-game-public-postgres-isolated.json',import.meta.url)));
 const parsed=parseCatalog(realCatalog);assert.equal(parsed.games.length,7);assert.ok(parsed.games.every(game=>!game.leaderboard.enabled));
 // The database proof's ready Hearts read is decoded against the same policy;
 // this does not assert the OFF service fixture is actually activated.
 const cap=clone(parsed.games.find(game=>game.gameId==='hearts'));cap.verifiedResults.enabled=true;cap.leaderboard.enabled=true;
 const board=parsePublicBoard(result,cap);assert.equal(board.eligibleCount,32);assert.equal(board.rows.length,25);assert.equal(board.version,'32');assert.equal(own(board,'own'),false);
});
const own=(value,key)=>Object.hasOwn(value,key);
test('catalog binds only the seven active game IDs and exact public paths; canceled and excluded games cannot enter',()=>{
 assert.deepEqual(WEB_GAMES.map(game=>game.gameId),['bobby','evil-doom-boy','gin-rummy','hearts','sling','spades','thumb-command']);
 assert.equal(parseCatalog(catalog()).games[0].gameId,'hearts');
 const disabled=capability('bobby',{enabled:false,metric:null,rulesVersion:null});assert.equal(parseCatalog(catalog([disabled])).games[0].leaderboard.enabled,false);
 for(const mutate of [c=>c.games.push(clone(c.games[0])),c=>c.games[0].gameId='shadowrun',c=>c.games[0].gameId='solitaire',c=>c.games[0].publicLeaderboardPath='/games/hearts/v1/leaderboard',c=>c.games[0].publicLeaderboardPath='https://other.invalid/board',c=>c.games[0].own={rank:1},c=>c.games[0].leaderboard.metric.direction='best',c=>c.games[0].leaderboard.metric.tieBreak='invention',c=>c.games[0].rulesVersion=null]){const value=catalog();mutate(value);assert.throws(()=>parseCatalog(value));}
});
test('public board enforces exact game, board, rules, metric, count, shared ranks and decimal-string version',()=>{
 const cap=capability(),value=board(cap,{version:'9223372036854775807'});assert.equal(parsePublicBoard(value,cap).version,value.version);
 const reordered={...value,metric:{tieBreak:'wins',direction:'desc',label:'Rating',key:'rating'}};assert.equal(parsePublicBoard(reordered,cap).rows.length,25);
 for(const mutate of [b=>b.gameId='spades',b=>b.boardKey='another-mode',b=>b.rulesVersion='different',b=>b.policyVersion='different',b=>b.metric.key='points',b=>b.eligibleCount=33,b=>b.rows=[],b=>b.rows[1].rank=2,b=>b.rows[1].playerId=b.rows[0].playerId,b=>b.rows[0].matches=0,b=>b.rows[0].value=Infinity,b=>b.rows[0].wins=3,b=>b.version=1,b=>b.snapshotAt='invalid']){const broken=clone(value);mutate(broken);if(broken.eligibleCount===33)broken.rows.pop();assert.throws(()=>parsePublicBoard(broken,cap));}
 assert.equal(parsePublicBoard(board(cap,{rows:[],eligibleCount:0}),cap).rows.length,0);
});
test('metric direction and source-defined earliest-best tie policy are honored without inventing shared ranks',()=>{
 const cap=capability('thumb-command',{metric:{key:'points',label:'Points',direction:'desc',tieBreak:'earliest'},rulesVersion:'tc-replay-v1',board:'tc-mission-v1-l1-medium-blueguard-m1-a0'}),value=board(cap,{rows:[row(1,{value:500,rank:1}),row(2,{value:500,rank:2})]});
 assert.equal(parsePublicBoard(value,cap).rows[1].rank,2);assert.throws(()=>parsePublicBoard({...value,rows:[value.rows[0],{...value.rows[1],rank:1}]},cap));
 const lower=capability('hearts',{metric:{key:'penalty',label:'Penalty total',direction:'asc',tieBreak:'wins'}});assert.equal(parsePublicBoard(board(lower,{rows:[row(1,{value:10}),row(2,{value:10}),row(3,{value:20})]}),lower).rows[2].value,20);
});
test('private account context and fields are rejected at every public level, including email-like names',()=>{
 const cap=capability();for(const mutate of [b=>b.own={email:'PRIVATE_MUST_NOT_RENDER'},b=>b.subject='PRIVATE_MUST_NOT_RENDER',b=>b.rows[0].email='PRIVATE_MUST_NOT_RENDER',b=>b.rows[0].isYou=true,b=>b.rows[0].accountId='PRIVATE_MUST_NOT_RENDER',b=>b.rows[0].name='private@example.invalid']){const value=board(cap);mutate(value);assert.throws(()=>parsePublicBoard(value,cap));}
});
test('reader retrieves only approved catalog/public GETs without credentials, cache, referrer or redirects',async()=>{
 const cap=capability(),calls=[],reader=createGameBoardReader({gameId:'hearts',fetcher:async(url,options)=>{calls.push(url);assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.headers,undefined);return reply(url===CATALOG_URL?catalog([cap]):board(cap));}});
 await reader.load();assert.deepEqual(calls,[CATALOG_URL,GAME_ORIGIN+'/games/hearts/v1/public-leaderboard?mode=ranked&limit=25']);assert.equal(reader.snapshot().status,'ready');reader.dispose();
});

test('a shared mission link reads and validates that exact public board instead of the default',async()=>{
 const cap=capability('thumb-command',{metric:{key:'points',label:'Points',direction:'desc',tieBreak:'earliest'},rulesVersion:'tc-replay-v1',board:'tc-mission-v1-l1-medium-blueguard-m1-a0'}),selected='tc-mission-v1-l2-medium-blueguard-m1-a0',calls=[];
 const value=board(cap,{rows:[],eligibleCount:0});value.boardKey=selected;
 const reader=createGameBoardReader({gameId:'thumb-command',boardKey:selected,fetcher:async(url,options)=>{calls.push(url);assert.equal(options.credentials,'omit');assert.equal(options.headers,undefined);return reply(url===CATALOG_URL?catalog([cap]):value);}});
 await reader.load();assert.equal(reader.snapshot().status,'empty');assert.equal(reader.snapshot().data.boardKey,selected);assert.equal(calls[1],GAME_ORIGIN+cap.publicLeaderboardPath+'?mode=ranked&limit=25&board='+selected);reader.dispose();
 assert.throws(()=>parsePublicBoard({...value,boardKey:cap.leaderboard.defaultBoard},cap,selected));
});

test('invalid, injected and unrelated card board links fail before any network request',async()=>{
 for(const [gameId,boardKey] of [['thumb-command','https://other.invalid/board'],['thumb-command','default&token=private'],['thumb-command','x'.repeat(161)],['hearts','another-room'],['spades','../default']]){
  let requests=0;const reader=createGameBoardReader({gameId,boardKey,fetcher:async()=>{requests++;return reply(catalog());}});await reader.load();assert.equal(reader.snapshot().status,'error');assert.equal(reader.snapshot().data,null);assert.equal(requests,0);reader.dispose();
 }
});
test('disabled/private policies never fetch private or fabricated board rows and never become successful empty',async()=>{
 for(const cap of [capability('bobby',{enabled:false,metric:null,rulesVersion:null}),{...capability(),leaderboard:{...capability().leaderboard,public:false}}]){const calls=[],reader=createGameBoardReader({gameId:cap.gameId,fetcher:async url=>{calls.push(url);return reply(catalog([cap]));}});await reader.load();assert.equal(reader.snapshot().status,'unavailable');assert.equal(reader.snapshot().data,null);assert.deepEqual(calls,[CATALOG_URL]);reader.dispose();}
 const reader=createGameBoardReader({gameId:'hearts',fetcher:async url=>url===CATALOG_URL?reply(catalog()):Response.json({code:'ranking_policy_unavailable'},{status:503})});await reader.load();assert.equal(reader.snapshot().status,'unavailable');assert.equal(reader.snapshot().data,null);reader.dispose();
});
test('failed refresh is stale; retry recovers; disabling publication clears previously valid public data',async()=>{
 const cap=capability();let failure=false,disabled=false,version='1';const reader=createGameBoardReader({gameId:'hearts',fetcher:async url=>{if(failure)throw Error('PRIVATE_ERROR_MUST_NOT_RENDER');return reply(url===CATALOG_URL?catalog([{...cap,leaderboard:{...cap.leaderboard,public:!disabled}}]):board(cap,{version}));}});
 await reader.load();failure=true;await reader.load();assert.equal(reader.snapshot().status,'stale');assert.equal(reader.snapshot().data.version,'1');assert.equal(JSON.stringify(reader.snapshot()).includes('PRIVATE_ERROR'),false);failure=false;version='2';await reader.load();assert.equal(reader.snapshot().data.version,'2');disabled=true;await reader.load();assert.equal(reader.snapshot().status,'unavailable');assert.equal(reader.snapshot().data,null);reader.dispose();
});
test('a changed board or rules policy cannot retain old-scope standings when the new request fails',async()=>{
 for(const change of [cap=>cap.leaderboard.defaultBoard='other-board',cap=>cap.rulesVersion='other-rules',cap=>cap.leaderboard.policyVersion='other-policy',cap=>cap.leaderboard.metric={...cap.leaderboard.metric,direction:'asc'}]){
  const cap=capability();let failed=false;const reader=createGameBoardReader({gameId:'hearts',fetcher:async url=>url===CATALOG_URL?reply(catalog([cap])):failed?Response.json({code:'unavailable'},{status:503}):reply(board(cap))});await reader.load();assert.equal(reader.snapshot().data.rows.length,25);change(cap);failed=true;await reader.load();assert.equal(reader.snapshot().status,'error');assert.equal(reader.snapshot().data,null);reader.dispose();
 }
});
test('HTTP failures, missing games, malformed/oversized responses and late completion remain honest',async()=>{
 for(const fetcher of [async()=>Response.json({},{status:404}),async()=>reply({own:{}}),async()=>new Response(' '.repeat(100000)),async()=>{throw Error('down');}]){const reader=createGameBoardReader({gameId:'hearts',fetcher});await reader.load();assert.equal(reader.snapshot().status,'error');assert.equal(reader.snapshot().data,null);reader.dispose();}
 const missing=createGameBoardReader({gameId:'hearts',fetcher:async()=>reply(catalog([]))});await missing.load();assert.equal(missing.snapshot().status,'unavailable');missing.dispose();
 let finish,calls=0,changes=0;const held=createGameBoardReader({gameId:'hearts',fetcher:()=>{calls++;return new Promise(resolve=>{finish=()=>resolve(reply(catalog()));});},onChange:()=>changes++});const first=held.load(),second=held.load();await Promise.resolve();assert.equal(calls,1);held.dispose();const before=changes;finish();await Promise.all([first,second]);assert.equal(changes,before);await held.load();assert.equal(calls,1);
});
test('all seven generated pages expose real entry links, exact CSP and no embedded fixture scores',()=>{
 for(const game of WEB_GAMES){const html=fs.readFileSync(new URL('../'+game.route,import.meta.url),'utf8'),info=fs.readFileSync(new URL('../'+(game.infoUrl.endsWith('/')?game.infoUrl+'index.html':game.infoUrl),import.meta.url),'utf8');assert.ok(html.includes(`data-game-id="${game.gameId}"`));assert.ok(html.includes(GAME_ORIGIN));assert.ok(html.includes('assets/game-leaderboards/client.mjs?v='));assert.ok(info.includes(`href="${game.route}"`));assert.ok(!html.includes('Synthetic player'));assert.ok(!html.includes('game:palace:play'));}
 const original=cp.execFileSync('git',['show','HEAD:assets/palace-leaderboard/client.mjs'],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']});assert.equal(fs.readFileSync(new URL('../assets/palace-leaderboard/client.mjs',import.meta.url),'utf8'),original);
});
