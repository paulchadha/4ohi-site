import assert from 'node:assert/strict';
import { freshSession, applyDemoAction, restoreSession, meaningfulGame, assertConservation, validateFixture } from '../assets/palace-web/demo-session.js';
import { getPlayableCards, CLASSIC_RULES } from '../assets/palace-web/shared/palaceEngine.js';
assert.ok(validateFixture());
assert.deepEqual(freshSession(),freshSession());
const pristine=JSON.stringify(freshSession());
function complete(reverse=false) {
 let s=applyDemoAction(freshSession(),{type:'start'}),steps=0;
 const events=new Set();
 while(s.game.status!=='finished' && steps++<2000) {
  const g=s.game;let action;
  if(g.currentPlayer>0)action={type:'bot'};
  else {const cards=getPlayableCards(g,CLASSIC_RULES,0);const c=reverse?(cards[1]||cards[0]):cards[0];action={type:'play',cardId:c?.id || null,selectedIds:c?[c.id]:null};}
  s=applyDemoAction(s,action);assertConservation(s);events.add(s.game.lastEvent?.type);
 }
 assert.equal(s.game.status,'finished');assert.ok(Number.isInteger(s.game.winnerIndex));
 assert.deepEqual(meaningfulGame(restoreSession(s).game),meaningfulGame(s.game));
 return {s,steps,events:[...events]};
}
const first=complete(), repeated=complete(),other=complete(true);
assert.deepEqual(first.s,repeated.s,'same decisions must produce the same trace');
assert.notDeepEqual(first.s.actions,other.s.actions,'alternative legal strategy must be accepted');
assert.equal(JSON.stringify(freshSession()),pristine,'fixture mutated');
for(const bad of [{...first.s,fixtureId:'random'}, {...first.s,schemaVersion:1}, {...first.s,game:{...first.s.game,currentPlayer:99}}, {...first.s,actions:[{type:'unknown'}]}])assert.throws(()=>restoreSession(bad));
// Opponent concealed ranks cannot influence a normal bot decision.
let s=applyDemoAction(freshSession(),{type:'start'});while(s.game.currentPlayer===0){const c=getPlayableCards(s.game,CLASSIC_RULES,0)[0];s=applyDemoAction(s,{type:'play',cardId:c?.id||null,selectedIds:c?[c.id]:null});}
const hidden=structuredClone(s);hidden.game.players[0].hand.reverse();hidden.game.players[0].faceDown.reverse();
const a=applyDemoAction(s,{type:'bot'}),b=applyDemoAction(hidden,{type:'bot'});assert.deepEqual(a.game.lastEvent.cardIds,b.game.lastEvent.cardIds);
console.log(`PASS fixed fixture, exact replay, alternative strategy, save validation, concealed-card policy, and 52-card conservation. Complete games: ${first.steps}/${other.steps} actions; events: ${first.events.join(', ')}.`);
