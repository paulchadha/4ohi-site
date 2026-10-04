import { fixtureData } from './demo-fixture.js';
import { CLASSIC_RULES, finishSetup, swapSetupCards, playCard, playJumpIn, botTakeTurn, maybeBotJumpIn } from './shared/palaceEngine.js';

export const FIXTURE_ID = 'palace-web-demo-v1';
export const STORAGE_KEY = '4oh_palace_demo_v1';
export const SCHEMA_VERSION = 2;
function freeze(value) { Object.values(value).forEach(v => { if(v && typeof v === 'object') freeze(v); }); return Object.freeze(value); }
const fixture = freeze(fixtureData);
export const RULES = fixture.rules;
const clone = value => JSON.parse(JSON.stringify(value));
const cardsIn = game => game.deck.concat(game.pile, ...game.players.flatMap(p => p.hand.concat(p.faceUp,p.faceDown)));
const originalCards = cardsIn(fixture.initial);
const cardById = new Map(originalCards.map(c => [c.id,c]));
export function validateFixture() {
 const suits=['clubs','diamonds','hearts','spades'], ranks=['3','4','5','6','7','8','9','10','J','Q','K','A','2'];
 if(fixture.id!==FIXTURE_ID || JSON.stringify(RULES)!==JSON.stringify(CLASSIC_RULES)) throw Error('Unsupported demo fixture/rules');
 if(originalCards.length!==52 || cardById.size!==52 || originalCards.some(c=>!suits.includes(c.suit)||!ranks.includes(c.rank)||c.id!==`${c.rank}-${c.suit}`)) throw Error('Invalid fixture cards');
 const g=fixture.initial;
 if(g.players.length!==2 || g.deck.length!==34 || g.currentPlayer!==0 || g.status!=='setup' || g.players[0].bot || !g.players[1].bot || g.players[1].name!=='Oner' || g.players.some(p=>[p.hand,p.faceUp,p.faceDown].some(z=>z.length!==3))) throw Error('Invalid demo allocation');
 return true;
}
validateFixture();
export function freshSession() { return {fixtureId:FIXTURE_ID,schemaVersion:SCHEMA_VERSION,game:clone(fixture.initial),actions:[],burned:[]}; }
export function meaningfulGame(game) {
 const g=clone(game);delete g.updatedAt;delete g.setupStartedAt;delete g.id;
 if(g.lastEvent) delete g.lastEvent.at;
 return g;
}
export function assertConservation(session) {
 const cards=cardsIn(session.game), ids=cards.map(c=>c.id).concat(session.burned);
 if(ids.length!==52 || new Set(ids).size!==52 || ids.some(id=>!cardById.has(id)) || cards.some(c=>c.rank!==cardById.get(c.id)?.rank || c.suit!==cardById.get(c.id)?.suit)) throw Error('Invalid demo card state');
 return true;
}
// The web adapter gives the unchanged engine a logical clock. Display delays never
// select a deal or a bot move. Jump-in reaction uses a stable, eager bot policy.
function normalize(game, previous, tick) {
 game.updatedAt=tick;
 if(game.lastEvent)game.lastEvent.at=tick;
 if(game.jumpInWindow && game.jumpInWindow!==previous.jumpInWindow && game.jumpInWindow.expectedRevision!==previous.jumpInWindow?.expectedRevision) {
  const duration=game.jumpInWindow.deadlineAt-game.jumpInWindow.openedAt;
  game.jumpInWindow={...game.jumpInWindow,openedAt:tick,deadlineAt:tick+duration};
 }
 return game;
}
function botMove(game) {
 const bot=game.players[game.currentPlayer];
 if(!bot.hand.length && !bot.faceUp.length) {
  // Choose a position, never a concealed rank. Reveal through the real rules.
  const next=playCard(game,RULES,game.currentPlayer,bot.faceDown[0]?.id);
  next.botTurnCount=game.botTurnCount+1; return next;
 }
 // The native policy's loop signature must not depend on concealed opponent
 // ranks. Mask them for choosing a move, then restore real cards by identity.
 const visible=clone(game);
 visible.players.forEach(p=>{p.faceDown=p.faceDown.map(c=>({...c,rank:'3'}));if(!p.bot)p.hand=p.hand.map(c=>({...c,rank:'3'}));});
 const next=botTakeTurn(visible,RULES);
 next.players.forEach(p=>{for(const zone of ['hand','faceUp','faceDown'])p[zone]=p[zone].map(c=>({...cardById.get(c.id)}));});
 return next;
}
export function applyDemoAction(session, action) {
 const before=session.game, tick=(session.actions.length+1)*10000;
 let game;
 switch(action.type) {
  case 'swap': if(before.status!=='setup')throw Error('Setup is closed');game=swapSetupCards(before,action.handId,action.faceUpId,RULES);break;
  case 'start': if(before.status!=='setup')throw Error('Hand already started');game=finishSetup(before,RULES);break;
  case 'play': if(before.status!=='playing'||before.currentPlayer!==0)throw Error('Not your turn');game=playCard(before,RULES,0,action.cardId,action.selectedIds,{now:tick});break;
  case 'jump': game=playJumpIn(before,RULES,0,action.cardIds,{now:Number(before.jumpInWindow?.openedAt||0)+1000});break;
  case 'bot':
   if(before.status!=='playing'||before.currentPlayer<=0)throw Error('Not a bot turn');
   if(before.jumpInWindow){game=maybeBotJumpIn(before,RULES,before.jumpInWindow.playedBy,{now:before.jumpInWindow.openedAt+1000,random:()=>0});if(game===before)game={...before,jumpInWindow:null};}
   else game=botMove(before);
   break;
  case 'close-window': if(!before.jumpInWindow)throw Error('No reaction window');game={...before,jumpInWindow:null};break;
  default:throw Error('Unknown demo action');
 }
 game=normalize(game,before,tick);
 const oldIds=cardsIn(before).map(c=>c.id), remaining=new Set(cardsIn(game).map(c=>c.id));
 const removed=oldIds.filter(id=>!remaining.has(id));
 if(removed.length && !(game.lastEvent?.burned || game.lastEvent?.type==='clear'))throw Error('Cards removed outside a burn');
 if(action.type!=='close-window' && JSON.stringify(meaningfulGame(game))===JSON.stringify(meaningfulGame(before)))throw Error('Action did not advance the demo');
 const next={...session,game,actions:session.actions.concat(clone(action)),burned:session.burned.concat(removed)};
 assertConservation(next);return next;
}
export function restoreSession(value) {
 if(!value || value.fixtureId!==FIXTURE_ID || value.schemaVersion!==SCHEMA_VERSION || !Array.isArray(value.actions) || value.actions.length>5000)throw Error('Incompatible save');
 let session=freshSession();for(const action of value.actions)session=applyDemoAction(session,action);
 if(JSON.stringify(meaningfulGame(session.game))!==JSON.stringify(meaningfulGame(value.game)) || JSON.stringify(session.burned)!==JSON.stringify(value.burned))throw Error('Save does not match the fixed deal');
 return session;
}
