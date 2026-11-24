export const CHESS_ORIGIN = 'https://four-of-hearts-accounts-567g6.ondigitalocean.app';
export const ELIGIBILITY = 'rated-result-1-provisional-visible-2';
export const POOLS = Object.freeze({rapid:{label:'Rapid',time:'30 minutes'},blitz:{label:'Blitz',time:'3 or 5 minutes'},bullet:{label:'Bullet',time:'1 or 2 minutes'}});
export const REFRESH_MS=60_000, STALE_MS=120_000;
const validPool=p=>Object.hasOwn(POOLS,p);
export const feedUrl=pool=>{if(!validPool(pool))throw Error('Unknown rating pool');return `${CHESS_ORIGIN}/chess/api/leaderboard?pool=${pool}&filter=all&limit=25&offset=0`;};
export function parseChessBoard(payload,pool,now=Date.now()) {
 if(!validPool(pool)||!payload||Object.keys(payload).some(k=>!['players','total','me','rankingEligibilityVersion','lastUpdated'].includes(k))||payload.rankingEligibilityVersion!==ELIGIBILITY||payload.me!==null||!Number.isSafeInteger(payload.total)||payload.total<0||!Array.isArray(payload.players)||payload.players.length>100||payload.total<payload.players.length||payload.total>0&&payload.players.length===0||!Number.isSafeInteger(payload.lastUpdated)||payload.lastUpdated<=0||payload.lastUpdated>now+60_000)throw Error('Invalid public standings');
 let previous=null,rank=0;const seen=new Set();
 const rows=payload.players.map((p,index)=>{
  if(!p||Object.keys(p).some(k=>!['publicId','handle','rating','games','wins','losses','draws','rank','provisional','category','pool','version','lastDelta'].includes(k))||typeof p.publicId!=='string'||!p.publicId||seen.has(p.publicId)||typeof p.handle!=='string'||!p.handle.length||p.handle.length>64||!/^[-\p{L}\p{M}\p{N} ._]+$/u.test(p.handle)||p.pool!==pool||p.category!=='live'||!Number.isSafeInteger(p.rating)||!Number.isSafeInteger(p.games)||p.games<1||p.provisional!==(p.games<20)||!Number.isSafeInteger(p.rank)||previous!==null&&p.rating>previous)throw Error('Invalid public player');
  seen.add(p.publicId);if(p.rating!==previous)rank=index+1;if(p.rank!==rank)throw Error('Invalid competition rank');previous=p.rating;
  return {rank:p.rank,handle:p.handle,rating:p.rating,provisional:p.provisional};
 });
 if(rows.length<Math.min(25,payload.total))throw Error('Incomplete Top 25');
 return {pool,rows:rows.slice(0,25),total:payload.total,snapshotAt:payload.lastUpdated};
}
async function json(response){
 if(!response.ok||!response.headers.get('content-type')?.includes('application/json')||Number(response.headers.get('content-length')||0)>65536)throw Error('Feed unavailable');
 const text=await response.text();if(text.length>65536)throw Error('Feed too large');return JSON.parse(text);
}
export function createChessReader({fetcher=fetch,now=Date.now,onChange=()=>{},timeoutMs=12_000}={}){
 let state={pool:'rapid',status:'loading',data:null,receivedAt:null},sequence=0,controller=null,pending=null,disposed=false;
 const publish=value=>{if(!disposed){state=value;onChange(value);}};
 function load(pool=state.pool){
  if(!validPool(pool))throw Error('Unknown rating pool');
  if(pending&&pool===state.pool)return pending;
  const changed=pool!==state.pool;controller?.abort();const own=++sequence,requestController=new AbortController();controller=requestController;
  publish({pool,status:!changed&&state.data?'refreshing':'loading',data:changed?null:state.data,receivedAt:changed?null:state.receivedAt});
  const timeout=setTimeout(()=>requestController.abort(),timeoutMs);
  pending=(async()=>{try{
   await Promise.resolve();const response=await fetcher(feedUrl(pool),{method:'GET',credentials:'omit',mode:'cors',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',headers:{Accept:'application/json'},signal:requestController.signal});
   const data=parseChessBoard(await json(response),pool,now());if(own!==sequence||disposed)return;
   publish({pool,status:data.rows.length?'ready':'empty',data,receivedAt:now()});
  }catch{
   if(own===sequence&&!disposed)publish({...state,status:state.data?'stale':'error'});
  }finally{clearTimeout(timeout);if(own===sequence){pending=null;controller=null;}}})();return pending;
 }
 return {load,snapshot:()=>state,dispose(){disposed=true;sequence++;controller?.abort();}};
}
export function renderChessBoard(root,state,now=Date.now()){
 const q=s=>root.querySelector(s),data=state.data,initial=state.status==='loading'&&!data;
 const age=data?Math.max(0,now-Math.min(data.snapshotAt,state.receivedAt)):null,stale=state.status==='stale'||age!==null&&age>STALE_MS;
 root.dataset.state=stale?'stale':state.status;
 q('[data-chess-pool]').value=state.pool;q('[data-chess-pool-title]').textContent=POOLS[state.pool].label+' Top 25';
 q('[data-chess-panel]').setAttribute('aria-busy',String(initial));
 q('[data-chess-refresh]').disabled=['loading','refreshing'].includes(state.status);
 const status=initial?'Loading public '+POOLS[state.pool].label+' standings.':state.status==='error'?'Standings are unavailable. No scores have been received. Please retry.':stale?'Standings may be out of date. Showing the last received '+POOLS[state.pool].label+' feed. Retry to check for updates.':data?.total===0?'The '+POOLS[state.pool].label+' feed is available. No eligible ranked players yet.':data?'Current public '+POOLS[state.pool].label+' standings.':'';
 q('[data-chess-status]').textContent=status;
 const table=q('[data-chess-table]');table.hidden=!data?.rows.length;
 const rows=q('[data-chess-rows]'),signature=JSON.stringify(data?.rows||[]);
 if(rows.dataset.signature!==signature){rows.dataset.signature=signature;rows.replaceChildren(...(data?.rows||[]).map(row=>{
  const tr=root.ownerDocument.createElement('tr');for(const value of [row.rank,row.handle,row.rating]){const td=root.ownerDocument.createElement('td');td.textContent=String(value);tr.append(td);}
  if(row.provisional){const badge=root.ownerDocument.createElement('small');badge.textContent='Provisional';tr.children[1].append(badge);}return tr;
 }));}
 q('[data-chess-count]').textContent=data?`${data.rows.length} of ${data.total.toLocaleString('en-US')} eligible players`:'No standings received';
 const stamp=q('[data-chess-time]');stamp.textContent=data?'Feed timestamp: '+new Date(data.snapshotAt).toLocaleString():'Waiting for the Chess service';if(data)stamp.dateTime=new Date(data.snapshotAt).toISOString();else stamp.removeAttribute('datetime');
 q('[data-chess-age]').textContent=data?`Received ${Math.max(0,Math.floor((now-state.receivedAt)/1000))} seconds ago${stale?' · stale':''}.`:'Updates every minute while this page is visible.';
 q('[data-chess-source]').href=feedUrl(state.pool);
}
export function mountChessBoard(root,{fetcher=fetch,document:doc=root.ownerDocument,window:win=doc.defaultView,now=Date.now}={}){
 const fromUrl=()=>{const values=new URL(win.location.href).searchParams.getAll('pool');return values.length===1&&validPool(values[0])?values[0]:'rapid';};
 const reader=createChessReader({fetcher,now,onChange:state=>renderChessBoard(root,state,now())}),select=root.querySelector('[data-chess-pool]');
 const refresh=()=>{if(doc.visibilityState!=='hidden')void reader.load(select.value);},manual=()=>void reader.load(select.value),change=()=>{const url=new URL(win.location.href);url.searchParams.set('pool',select.value);win.history.pushState(null,'',url);void reader.load(select.value);},pop=()=>void reader.load(fromUrl());
 select.addEventListener('change',change);root.querySelector('[data-chess-refresh]').addEventListener('click',manual);doc.addEventListener('visibilitychange',refresh);win.addEventListener('online',refresh);win.addEventListener('popstate',pop);
 const interval=win.setInterval(refresh,REFRESH_MS),age=win.setInterval(()=>renderChessBoard(root,reader.snapshot(),now()),15_000);void reader.load(fromUrl());
 return()=>{reader.dispose();win.clearInterval(interval);win.clearInterval(age);select.removeEventListener('change',change);root.querySelector('[data-chess-refresh]').removeEventListener('click',manual);doc.removeEventListener('visibilitychange',refresh);win.removeEventListener('online',refresh);win.removeEventListener('popstate',pop);};
}
if(typeof document!=='undefined'){
 const root=document.querySelector('[data-chess-leaderboard]');if(root){let dispose=mountChessBoard(root);window.addEventListener('pagehide',()=>{dispose?.();dispose=null;});window.addEventListener('pageshow',e=>{if(e.persisted&&!dispose)dispose=mountChessBoard(root);});}
}
