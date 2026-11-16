export const LEADERBOARD_URL='https://plankton-app-qgwhz.ondigitalocean.app/games/palace/v1/public-leaderboard?mode=ranked&limit=25';
export const REFRESH_MS=5000;
const rowKeys=new Set(['playerId','name','avatar','rank','rating','wins','matches']);
const boardKeys=new Set(['apiVersion','game','mode','metric','metricLabel','ordering','tiePolicy','eligibleCount','snapshotAt','activatedAt','version','rulesVersion','policyVersion','rows','topPlayer']);
const integer=(value,min=0)=>Number.isSafeInteger(value)&&value>=min;
const version=value=>integer(value)||typeof value==='string'&&/^(?:0|[1-9][0-9]{0,18})$/.test(value);
const timestamp=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
function invalid(){throw Error('Invalid public standings response');}
function player(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!rowKeys.has(key))||
    typeof value.playerId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value.playerId)||
    typeof value.name!=='string'||!value.name.trim()||value.name.length>160||typeof value.avatar!=='string'||value.avatar.length>80||
    !integer(value.rank,1)||!Number.isSafeInteger(value.rating)||!integer(value.wins)||!integer(value.matches,1)||value.matches<value.wins)invalid();
  return Object.fromEntries([...rowKeys].map(key=>[key,value[key]]));
}
export function parsePublicStandings(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!boardKeys.has(key))||
    value.apiVersion!==1||value.game!=='palace'||value.mode!=='ranked'||value.metric!=='rating'||value.metricLabel!=='Ranked rating'||
    value.ordering!=='rating-desc,wins-desc,account-id-asc'||value.tiePolicy!=='shared-rank-rating-wins'||
    !integer(value.eligibleCount)||!version(value.version)||!timestamp(value.snapshotAt)||!timestamp(value.activatedAt)||
    typeof value.rulesVersion!=='string'||typeof value.policyVersion!=='string'||!Array.isArray(value.rows)||value.rows.length!==Math.min(25,value.eligibleCount))invalid();
  const rows=value.rows.map(player),topPlayer=value.topPlayer===null?null:player(value.topPlayer);
  for(let index=0;index<rows.length;index++){
    const current=rows[index],previous=rows[index-1];
    if(!previous){if(current.rank!==1)invalid();}
    else if(current.rating>previous.rating||current.rating===previous.rating&&current.wins>previous.wins||
      current.rank!==(current.rating===previous.rating&&current.wins===previous.wins?previous.rank:index+1))invalid();
  }
  if(new Set(rows.map(row=>row.playerId)).size!==rows.length||
    (rows.length===0)!==(topPlayer===null)||rows.length&&JSON.stringify(rows[0])!==JSON.stringify(topPlayer))invalid();
  return {...value,rows,topPlayer};
}

export function createPublicLeaderboardReader({fetcher=fetch,onChange=()=>{},initialState}={}){
  const initialData=initialState?.data?parsePublicStandings(initialState.data):null;
  const initialStale=initialData&&initialState.status==='stale';
  let state={status:initialData?(initialStale?'stale':initialData.rows.length?'ready':'empty'):'loading',data:initialData,message:initialStale?'Refresh failed. Showing the last received standings.':'',refreshing:false},disposed=false,pending=null,controller=null;
  const publish=next=>{if(!disposed){state=next;onChange(state);}};
  async function load(){
    if(disposed)return;
    if(pending)return pending;
    controller=new AbortController();
    const signal=controller.signal;
    publish({...state,status:state.data?state.status:'loading',message:state.data?state.message:'',refreshing:true});
    pending=Promise.resolve().then(async()=>{
      const timeout=setTimeout(()=>controller?.abort(),4500);
      try{
        const response=await fetcher(LEADERBOARD_URL,{method:'GET',credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal});
        if(!response.ok)throw Error('Standings request failed');
        const data=parsePublicStandings(await response.json());
        publish({status:data.rows.length?'ready':'empty',data,message:'',refreshing:false});
      }catch{
        publish({...state,status:state.data?'stale':'error',message:state.data?'Refresh failed. Showing the last received standings.':'Official standings are temporarily unavailable. Please retry.',refreshing:false});
      }finally{clearTimeout(timeout);pending=null;controller=null;}
    });
    return pending;
  }
  return {load,snapshot:()=>state,dispose(){disposed=true;controller?.abort();}};
}

const displayedBoards=new WeakMap();
const setText=(node,value)=>{if(node.textContent!==value)node.textContent=value;};

export function renderPublicStandings(root,state){
  const find=selector=>root.querySelector(selector);
  const initialLoading=!state.data&&state.status==='loading';
  const panel=find('[data-board-panel]');
  if(panel.getAttribute('aria-busy')!==String(initialLoading))panel.setAttribute('aria-busy',String(initialLoading));
  const status=find('[data-board-status]');
  setText(status,state.message||(initialLoading?'Loading official standings…':state.status==='empty'?'No ranked players yet. Completed eligible matches will appear here.':''));
  if(status.dataset.state!==state.status)status.dataset.state=state.status;
  const rows=state.data?.rows||[],rowsKey=JSON.stringify(rows);
  if(displayedBoards.get(root)?.rowsKey!==rowsKey){
    find('[data-board-rows]').replaceChildren(...rows.map(row=>{
      const tr=root.ownerDocument.createElement('tr');
      for(const [index,value]of [row.rank,row.name,row.rating.toLocaleString('en-US')].entries()){
        const td=root.ownerDocument.createElement('td');td.textContent=String(value);
        if(index===1)td.title=row.name;
        tr.append(td);
      }
      return tr;
    }));
  }
  const data=state.data,top=data?.topPlayer;
  setText(find('[data-board-champion-name]'),top?.name||(data?'Awaiting a champion':'—'));
  setText(find('[data-board-champion-rating]'),top?top.rating.toLocaleString('en-US'):'—');
  displayedBoards.set(root,{rowsKey,state});
}

export function mountPublicLeaderboard(root,{document:doc=root.ownerDocument,window:win=doc.defaultView,fetcher=fetch}={}){
  const reader=createPublicLeaderboardReader({fetcher,initialState:displayedBoards.get(root)?.state,onChange:state=>renderPublicStandings(root,state)});
  const refresh=()=>{if(doc.visibilityState!=='hidden')void reader.load();};
  doc.addEventListener('visibilitychange',refresh);win.addEventListener('online',refresh);
  const interval=win.setInterval(refresh,REFRESH_MS);
  refresh();
  return ()=>{reader.dispose();win.clearInterval(interval);doc.removeEventListener('visibilitychange',refresh);win.removeEventListener('online',refresh);};
}
if(typeof document!=='undefined'){
  const root=document.querySelector('[data-palace-leaderboard]');
  if(root){
    let dispose=mountPublicLeaderboard(root);
    window.addEventListener('pagehide',()=>{dispose?.();dispose=null;});
    window.addEventListener('pageshow',event=>{if(event.persisted&&!dispose)dispose=mountPublicLeaderboard(root);});
  }
}
