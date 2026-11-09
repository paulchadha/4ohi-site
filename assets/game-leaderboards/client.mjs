// Public display only. No login, credential storage or private standings reads.
export const GAME_ORIGIN='https://plankton-app-qgwhz.ondigitalocean.app';
export const CATALOG_URL=GAME_ORIGIN+'/games/v1/catalog';
export const REFRESH_MS=5000;
export const WEB_GAMES=Object.freeze([
 {gameId:'bobby',name:'Bobby the Breadasaurus',shortName:'Bobby',route:'bobby-leaderboard.html',infoUrl:'bobby-the-breadasaurus.html',artwork:'assets/bobby/protector-builder/bobby-tile-480.webp',kind:'Tower defense adventure'},
 {gameId:'evil-doom-boy',name:'Evil Doom Boy',shortName:'Evil Doom Boy',route:'evil-doom-boy-leaderboard.html',infoUrl:'games/evil-doom-boy/',artwork:'assets/evil-doom/reference-20261027/boy-portrait-ac14a93083bf.webp',kind:'Tower defense'},
 {gameId:'gin-rummy',name:'Gin Rummy',shortName:'Gin Rummy',route:'gin-rummy-leaderboard.html',infoUrl:'gin-rummy.html',artwork:'assets/card-apps/gin-rummy.webp',kind:'Card game'},
 {gameId:'hearts',name:'Hearts',shortName:'Hearts',route:'hearts-leaderboard.html',infoUrl:'hearts-play.html',artwork:'assets/icon-hearts-4hearts.webp',kind:'Card game'},
 {gameId:'sling',name:'Sling Bling',shortName:'Sling Bling',route:'sling-bling-leaderboard.html',infoUrl:'sling-nouveau.html',artwork:'assets/sling-bling/money-monsters-512-b1b77b7ed32c.webp',kind:'Physics playground'},
 {gameId:'spades',name:'Spades',shortName:'Spades',route:'spades-leaderboard.html',infoUrl:'spades-play.html',artwork:'assets/icon-spades-4hearts.webp',kind:'Card game'},
 {gameId:'thumb-command',name:'Thumb Command',shortName:'Thumb Command',route:'thumb-command-leaderboard.html',infoUrl:'games/thumb-command/',artwork:'assets/thumb-command/thumb-command-app-icon-384.webp',kind:'Arcade defense'},
].map(Object.freeze));
const byId=new Map(WEB_GAMES.map(game=>[game.gameId,game]));
const own=(value,key)=>Object.hasOwn(value,key);
const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const keys=(value,allowed)=>object(value)&&Object.keys(value).every(key=>allowed.includes(key));
const integer=(value,min=0)=>Number.isSafeInteger(value)&&value>=min;
const text=(value,max=160)=>typeof value==='string'&&value.trim().length>0&&value.length<=max&&!/[\p{Cc}\p{Cf}]/u.test(value);
const identifier=value=>text(value,128)&&/^[a-zA-Z0-9._:-]+$/.test(value);
const reason=value=>value===null||text(value,240);
const metric=value=>keys(value,['key','label','direction','tieBreak'])&&identifier(value.key)&&text(value.label,80)&&['asc','desc'].includes(value.direction)&&['wins','earliest'].includes(value.tieBreak);
const timestamp=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(value)&&Number.isFinite(Date.parse(value));
const version=value=>typeof value==='string'&&/^(0|[1-9][0-9]{0,18})$/.test(value);
const contract='four-of-hearts.verified-results.v1';
function invalid(){throw Error('Invalid public game standings contract');}
export function parseCatalog(value){
 if(!keys(value,['schemaVersion','contract','games'])||value.schemaVersion!==1||value.contract!==contract||!Array.isArray(value.games)||value.games.length>WEB_GAMES.length)invalid();
 const games=value.games.map(game=>{
  if(!keys(game,['schemaVersion','contract','gameId','displayName','rulesVersion','verifiedResults','leaderboard','capabilitiesPath','publicLeaderboardPath'])||game.schemaVersion!==1||game.contract!==contract||!byId.has(game.gameId)||!text(game.displayName)||!(game.rulesVersion===null||identifier(game.rulesVersion))||
   game.capabilitiesPath!==`/games/${game.gameId}/v1/capabilities`||game.publicLeaderboardPath!==`/games/${game.gameId}/v1/public-leaderboard`||
   !keys(game.verifiedResults,['enabled','source','reason'])||typeof game.verifiedResults.enabled!=='boolean'||!text(game.verifiedResults.source,128)||!reason(game.verifiedResults.reason)||
   !keys(game.leaderboard,['enabled','public','policyVersion','metric','reason','defaultBoard'])||typeof game.leaderboard.enabled!=='boolean'||typeof game.leaderboard.public!=='boolean'||!reason(game.leaderboard.reason)||!(game.leaderboard.defaultBoard===null||identifier(game.leaderboard.defaultBoard))||
   !(game.leaderboard.policyVersion===null||identifier(game.leaderboard.policyVersion))||!(game.leaderboard.metric===null||metric(game.leaderboard.metric))||
   game.verifiedResults.enabled&&!identifier(game.rulesVersion)||game.leaderboard.enabled&&(!game.verifiedResults.enabled||!game.leaderboard.policyVersion||!game.leaderboard.metric||!game.leaderboard.defaultBoard))invalid();
  return structuredClone(game);
 });
 if(new Set(games.map(game=>game.gameId)).size!==games.length)invalid();
 return {schemaVersion:1,contract,games};
}
export function parsePublicBoard(value,capability,requestedBoard=null){
 if(!capability?.leaderboard.enabled||capability.leaderboard.public!==true||
  !keys(value,['schemaVersion','gameId','mode','boardKey','rulesVersion','policyVersion','metric','version','snapshotAt','eligibleCount','rows'])||value.schemaVersion!==1||value.gameId!==capability.gameId||value.mode!=='ranked'||value.boardKey!==(requestedBoard??capability.leaderboard.defaultBoard)||value.rulesVersion!==capability.rulesVersion||value.policyVersion!==capability.leaderboard.policyVersion||
  !metric(value.metric)||['key','label','direction','tieBreak'].some(key=>value.metric[key]!==capability.leaderboard.metric[key])||!version(value.version)||!timestamp(value.snapshotAt)||!integer(value.eligibleCount)||!Array.isArray(value.rows)||value.rows.length!==Math.min(25,value.eligibleCount))invalid();
 const rows=value.rows.map(row=>{
  if(!keys(row,['playerId','name','rank','value','wins','matches'])||!text(row.playerId,80)||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(row.playerId)||!text(row.name)||row.name.includes('@')||!integer(row.rank,1)||!Number.isFinite(row.value)||!integer(row.wins)||!integer(row.matches,1)||row.wins>row.matches)invalid();
  return {...row};
 });
 if(new Set(rows.map(row=>row.playerId)).size!==rows.length)invalid();
 for(let index=0;index<rows.length;index++){
  const row=rows[index],previous=rows[index-1];
  if(!previous){if(row.rank!==1)invalid();continue;}
  const tie=row.value===previous.value&&row.wins===previous.wins;
  if((value.metric.direction==='desc'?row.value>previous.value:row.value<previous.value)||value.metric.tieBreak==='wins'&&row.value===previous.value&&row.wins>previous.wins||row.rank!==(value.metric.tieBreak==='wins'&&tie?previous.rank:index+1))invalid();
 }
 return {...value,metric:{...value.metric},rows};
}
async function boundedJson(response){
 const reader=response.body?.getReader();if(!reader)invalid();let size=0;const chunks=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>98304){await reader.cancel();invalid();}chunks.push(value);}
 const bytes=new Uint8Array(size);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
const options=signal=>({method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal});
export function createGameBoardReader({gameId,boardKey=null,fetcher=fetch,onChange=()=>{}}={}){
 if(gameId!==null&&!byId.has(gameId))invalid();
 let state={status:'loading',gameId,data:null,catalog:null,message:''},pending=null,controller=null,disposed=false;
 const publish=next=>{if(!disposed){state=next;onChange(next);}};
 async function load(){
  if(disposed)return;if(pending)return pending;
  if(boardKey!==null&&(gameId===null||typeof boardKey!=='string'||!/^[a-z0-9-]{1,160}$/.test(boardKey)||['hearts','spades','gin-rummy'].includes(gameId)&&boardKey!=='default')){publish({status:'error',gameId,data:null,catalog:null,message:'This board link is invalid. Open the game’s default leaderboard.'});return;}
  controller=new AbortController();const signal=controller.signal;
  publish({...state,status:state.data?'refreshing':'loading',message:''});
  pending=Promise.resolve().then(async()=>{
   const timeout=setTimeout(()=>controller?.abort(),4500);
   try{
    const response=await fetcher(CATALOG_URL,options(signal));if(!response.ok)throw Error('Catalog unavailable');
    const catalog=parseCatalog(await boundedJson(response));
    if(disposed||signal.aborted)return;
    if(gameId===null){publish({status:'ready',gameId,data:null,catalog,message:''});return;}
    const capability=catalog.games.find(game=>game.gameId===gameId);
    if(!capability?.leaderboard.enabled||capability.leaderboard.public!==true){publish({status:'unavailable',gameId,data:null,catalog,message:'Ranked standings are not available for this game yet.'});return;}
    const selectedBoard=boardKey??capability.leaderboard.defaultBoard;
    if(state.data&&(state.data.boardKey!==selectedBoard||state.data.rulesVersion!==capability.rulesVersion||state.data.policyVersion!==capability.leaderboard.policyVersion||['key','label','direction','tieBreak'].some(key=>state.data.metric[key]!==capability.leaderboard.metric[key])))publish({status:'loading',gameId,data:null,catalog,message:''});
    const boardResponse=await fetcher(GAME_ORIGIN+capability.publicLeaderboardPath+'?mode=ranked&limit=25'+(boardKey===null?'':'&board='+encodeURIComponent(boardKey)),options(signal));
    if(!boardResponse.ok){
     if(boardResponse.status===503){const failure=await boundedJson(boardResponse);if(failure?.code==='ranking_policy_unavailable'){publish({status:'unavailable',gameId,data:null,catalog,message:'Ranked standings are not available for this game yet.'});return;}}
     throw Error('Standings unavailable');
    }
    const data=parsePublicBoard(await boundedJson(boardResponse),capability,selectedBoard);
    publish({status:data.rows.length?'ready':'empty',gameId,data,catalog,message:''});
   }catch{
    const retained=!!state.data||gameId===null&&!!state.catalog;
    publish({...state,status:retained?'stale':'error',message:state.data?'Refresh failed. Showing the last received standings.':retained?'Availability refresh failed. Showing the last received availability.':'Standings availability could not be checked. Please retry.'});
   }finally{clearTimeout(timeout);pending=null;controller=null;}
  });return pending;
 }
 return{load,snapshot:()=>state,dispose(){disposed=true;controller?.abort();}};
}
export const formatValue=value=>Number.isSafeInteger(value)?value.toLocaleString('en-US'):String(value);
export function renderGameBoard(root,state){
 const find=selector=>root.querySelector(selector),data=state.data,busy=['loading','refreshing'].includes(state.status);
 root.dataset.state=state.status;find('[data-suite-panel]')?.setAttribute('aria-busy',String(busy));
 const button=find('[data-suite-refresh]');button.disabled=busy;button.textContent=busy?'Refreshing…':['error','stale','unavailable'].includes(state.status)?'Retry':'Refresh';
 find('[data-suite-status]').textContent=state.message||(state.status==='loading'?'Checking standings availability…':state.status==='refreshing'?'Updating public standings…':state.status==='empty'?'No eligible ranked players yet. Accepted results will appear here.':'');
 for(const card of root.querySelectorAll('[data-suite-card]')){
  const capability=state.catalog?.games.find(game=>game.gameId===card.dataset.suiteCard),label=card.querySelector('[data-suite-availability]');
  label.textContent=capability?`${state.status==='stale'?'Last check: ':''}${capability.leaderboard.enabled&&capability.leaderboard.public?'Ranked standings available':'Ranked standings not available yet'}`:['error','ready','stale'].includes(state.status)?'Availability unavailable':'Checking availability…';
 }
 if(!own(root.dataset,'gameId'))return;
 find('[data-suite-metric]').textContent=data?.metric.label||'Metric unavailable';
 find('[data-suite-value-heading]').textContent=data?.metric.label||'Value';
 find('[data-suite-table]').hidden=!data||data.rows.length===0;
 find('[data-suite-rows]').replaceChildren(...(data?.rows||[]).map(row=>{
  const tr=root.ownerDocument.createElement('tr');
  for(const [index,value]of [row.rank,row.name,formatValue(row.value)].entries()){const td=root.ownerDocument.createElement('td');td.textContent=String(value);if(index===1)td.title=row.name;tr.append(td);}return tr;
 }));
 find('[data-suite-count]').textContent=data?`${data.rows.length} of ${data.eligibleCount.toLocaleString('en-US')} eligible players`:'No standings received';
 find('[data-suite-time]').textContent=data?`${state.status==='stale'?'STALE · ':''}As of ${new Date(data.snapshotAt).toLocaleString()} · Version ${data.version}`:state.status==='unavailable'?'No ranking metric or scores are being shown':'Waiting for the game service';
 find('[data-suite-policy]').textContent=data?`${data.metric.label} · ${data.metric.direction==='desc'?'Higher':'Lower'} values rank first. ${data.metric.tieBreak==='wins'?'Equal values and wins share a rank.':'Equal values rank by the earliest recorded best result.'} Board: ${data.boardKey}.`:'Each game uses its own ranking rules. A board appears only when its service and ranking policy are available.';
 const top=data?.rows[0];find('[data-suite-champion]').hidden=!top;
 find('[data-suite-champion-name]').textContent=top?.name||'';find('[data-suite-champion-value]').textContent=top?formatValue(top.value):'';find('[data-suite-champion-metric]').textContent=data?.metric.label||'';
}
export function mountGameBoard(root,{document:doc=root.ownerDocument,window:win=doc.defaultView,fetcher=fetch}={}){
 const linkedBoards=new URL(win.location.href).searchParams.getAll('board');
 const boardKey=root.dataset.gameId?(linkedBoards.length>1?'!':linkedBoards[0]??null):null;
 const reader=createGameBoardReader({gameId:root.dataset.gameId??null,boardKey,fetcher,onChange:state=>renderGameBoard(root,state)}),button=root.querySelector('[data-suite-refresh]');
 const refresh=()=>{if(doc.visibilityState!=='hidden')void reader.load();},manual=()=>void reader.load();
 button.addEventListener('click',manual);doc.addEventListener('visibilitychange',refresh);win.addEventListener('online',refresh);
 const interval=win.setInterval(refresh,REFRESH_MS);refresh();
 return()=>{reader.dispose();win.clearInterval(interval);button.removeEventListener('click',manual);doc.removeEventListener('visibilitychange',refresh);win.removeEventListener('online',refresh);};
}
if(typeof document!=='undefined'){
 const root=document.querySelector('[data-game-leaderboards]');if(root){let dispose=mountGameBoard(root);window.addEventListener('pagehide',()=>{dispose?.();dispose=null;});window.addEventListener('pageshow',event=>{if(event.persisted&&!dispose)dispose=mountGameBoard(root);});}
}
