// Synthetic contract evidence for tests only. Never imported by a website page.
export const CONTRACT='four-of-hearts.verified-results.v1';
export function capability(gameId='hearts',{enabled=true,metric={key:'rating',label:'Rating',direction:'desc',tieBreak:'wins'},rulesVersion='hearts-canonical-v1',board='default'}={}){
 return{schemaVersion:1,contract:CONTRACT,gameId,displayName:gameId,rulesVersion,verifiedResults:{enabled,source:'authoritative-engine',reason:enabled?null:'service_unavailable'},leaderboard:{enabled,public:true,policyVersion:metric?'four-of-hearts-server-elo-v1':null,defaultBoard:board,metric,reason:enabled?null:'ranking_policy_unavailable'},capabilitiesPath:`/games/${gameId}/v1/capabilities`,publicLeaderboardPath:`/games/${gameId}/v1/public-leaderboard`};
}
export const catalog=(games=[capability()])=>({schemaVersion:1,contract:CONTRACT,games});
export const row=(index=1,overrides={})=>({playerId:`00000000-0000-4000-8000-${String(index).padStart(12,'0')}`,name:index===2?'A deliberately long synthetic player name for the narrow mobile layout':`Synthetic player ${index}`,rank:index<3?1:index,value:index<3?1610:1612-index,wins:1,matches:2,...overrides});
export function board(cap=capability(),{rows=Array.from({length:25},(_,index)=>row(index+1)),eligibleCount=rows.length===25?32:rows.length,version='1'}={}){
 return{schemaVersion:1,gameId:cap.gameId,mode:'ranked',boardKey:cap.leaderboard.defaultBoard,rulesVersion:cap.rulesVersion,policyVersion:cap.leaderboard.policyVersion,metric:{...cap.leaderboard.metric},version,snapshotAt:'2026-11-09T14:00:00.000Z',eligibleCount,rows};
}
