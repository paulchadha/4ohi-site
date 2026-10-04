import {
  PALACE_JUMP_IN_POLICY,
  describeCard,
  getJumpInMoveAt,
  getPalacePlacementOrder,
  getPalaceWinnerIndex,
  getPlayableCards,
  isMagicCard,
  isOptionalMultiPlayRank,
} from "./palace-web/shared/palaceEngine.js";
import { palaceBotActionDelay } from "./palace-web/shared/palaceTiming.js";

const ROOT = document.querySelector("#palace-web-game");
const LEGACY_STORAGE_KEY = "4oh_palace_web_v1";
const PREFERENCES_KEY = "4oh_palace_web_preferences_v1";


const params = new URLSearchParams(location.search);
const canadian = params.get("lang") === "en-CA";
const qaAllowed = ["127.0.0.1", "localhost"].includes(location.hostname) && params.get("palaceQa") === "1";
const fastMode = qaAllowed && params.get("fast") === "1";
import { STORAGE_KEY, FIXTURE_ID, RULES, freshSession, applyDemoAction, restoreSession } from "./palace-web/demo-session.js";
let session = null;
let generation = 0;
let notice = "";
let storageAvailable = true;
const pending = new Set();
const oscillators = new Set();
const restart = document.querySelector('[data-restart-demo]');
restart?.addEventListener('click', resetDemo);
const recoveryBar = document.querySelector('.palace-demo-recovery');
if(recoveryBar && typeof ResizeObserver !== 'undefined') new ResizeObserver(()=>{
  recoveryBar.parentElement.style.setProperty('--palace-recovery-height', `${recoveryBar.getBoundingClientRect().height}px`);
}).observe(recoveryBar);
let game = null;
let record = null;
let selection = [];
let setupPick = null;
let busy = false;
let botTimer = null;
let audioContext = null;
let preferences = loadPreferences();

const copy = canadian ? {
  eyebrow: "PLAY PALACE, BUD",
  heading: "One table. One full game.",
  body: "The real 4OH rules, the real table, and no need to bring chips. Different kind of card game, eh.",
  privacy: "One fixed deal, unlimited attempts. No account needed, bud.",
  deal: "Deal ’em out",
  how: "How this thing works ↗",
  completeEyebrow: "GAME COMPLETE",
  completeHeading: "Good game, bud.",
  completeBody: "You finished the complete 4OH Palace web edition. The cards have spoken, and they were surprisingly polite about it.",
  explore: "See more Palace ↗",
  games: "Back to the games"
} : {
  eyebrow: "PLAY PALACE",
  heading: "Play one complete game of Palace.",
  body: "The real 4OH rules and one complete, replayable challenge—right in your browser.",
  privacy: "One fixed deal, unlimited attempts. No account required.",
  deal: "Deal the cards",
  how: "How Palace works ↗",
  completeEyebrow: "GAME COMPLETE",
  completeHeading: "That was your Palace table.",
  completeBody: "You have finished the complete 4OH Palace web edition. Thanks for playing the whole game—not a five-turn imitation of one.",
  explore: "Explore Palace ↗",
  games: "Back to Games"
};

function loadPreferences() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}");
    return {
      sound: parsed.sound === true,
      reducedMotion: parsed.reducedMotion === true || matchMedia("(prefers-reduced-motion: reduce)").matches
    };
  } catch {
    return { sound: false, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches };
  }
}

function savePreferences() {
  try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ schemaVersion: 1, ...preferences })); }
  catch { storageAvailable = false; }
}
function loadRecord() {
  try {
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw) { session=restoreSession(JSON.parse(raw));game=session.game;return session; }
    if(localStorage.getItem(LEGACY_STORAGE_KEY)) {
      notice="That older table uses a different deal. The fixed demo is ready to try again.";
      session=freshSession();game=session.game;saveGame();
      try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch {}
    }
  } catch(error) {
    if(error.name==='SecurityError' || error.name==='QuotaExceededError') storageAvailable=false;
    else {notice="That saved table could not be restored. The original fixed deal is ready again.";session=freshSession();game=session.game;saveGame();}
  }
  return session;
}
function saveGame() {
  if(!session) return;
  game=session.game;
  record={...session,status:game.status==='finished'?'completed':'inProgress',result:game.status==='finished'?{
    winnerIndex:getPalaceWinnerIndex(game),winnerName:game.players[getPalaceWinnerIndex(game)]?.name,
    loserIndex:game.loserIndex,placementOrder:getPalacePlacementOrder(game),finalMessage:game.message
  }:null};
  try {localStorage.setItem(STORAGE_KEY,JSON.stringify(record));storageAvailable=true;}
  catch {storageAvailable=false;}
}
function cancelSession() {
  generation++;
  pending.forEach(timer=>clearTimeout(timer));pending.clear();clearTimeout(botTimer);botTimer=null;
  oscillators.forEach(o=>{try{o.stop();o.disconnect();}catch{}});oscillators.clear();
  ROOT.getAnimations?.({subtree:true}).forEach(a=>a.cancel());
  selection=[];setupPick=null;busy=false;
}
function resetDemo() {
  cancelSession();notice="";session=freshSession();game=session.game;record=null;
  saveGame();render({announce:true});
  ROOT.querySelector('[data-start-hand]')?.focus({preventScroll:true});
}
function later(callback,delay) {
  const token=generation, revision=game?.revision;
  const timer=setTimeout(()=>{pending.delete(timer);if(token!==generation || revision!==game?.revision)return;try{callback();}catch{showError();}},delay);
  pending.add(timer);return timer;
}
function showError() {
  cancelSession();notice="The table stopped unexpectedly. Restart this demo to return to the original deal.";
  ROOT.innerHTML='<div class="palace-session-error" role="alert">'+escapeHtml(notice)+'</div>';
  ROOT.removeAttribute('aria-busy');updateNotice();
}
function updateNotice() {
  const message=document.querySelector('[data-palace-notice]');
  if(message)message.textContent=notice || (storageAvailable ? "Progress saves on this device when browser storage is available." : "Storage is unavailable. You can play and restart here; progress will not survive a reload.");
}
function commit(action) {
  try {session=applyDemoAction(session,action);game=session.game;saveGame();}
  catch {showError();return false;}
  finally {busy=false;}
  return true;
}
const jumpNow=()=>Number(game?.jumpInWindow?.openedAt || 0)+1000;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

const suitSymbol = (suit) => ({ clubs: "♣", diamonds: "♦", hearts: "♥", spades: "♠", red: "★", black: "★" })[suit] || "";
const isRed = (card) => ["hearts", "diamonds", "red"].includes(card?.suit);
const cardRank = (card) => card?.rank === "Joker" ? "★" : card?.rank;

function cardMarkup(card, options = {}) {
  const blind = options.blind || card?.blind;
  const selected = selection.includes(card?.id) || setupPick?.cardId === card?.id;
  const legal = options.legal !== false;
  const disabled = options.disabled === true;
  const label = blind ? "Face-down card. Activate to reveal and play it blind." : `${describeCard(card)}${legal ? ". Legal play." : ". Not currently playable."}${selected ? " Selected." : ""}`;
  return `<button class="palace-card${blind ? " is-back" : ""}${isRed(card) ? " is-red" : ""}${selected ? " is-selected" : ""}${legal ? " is-legal" : " is-unavailable"}" type="button" data-card-id="${escapeHtml(card?.id)}" ${options.zone ? `data-zone="${options.zone}"` : ""} aria-label="${escapeHtml(label)}" aria-pressed="${selected}" ${disabled ? "disabled" : ""}>
    ${blind ? '<span class="card-back-mark" aria-hidden="true"><b>4<span>♥</span>H</b><small>PALACE</small></span>' : `<span class="card-corner top" aria-hidden="true"><b>${escapeHtml(cardRank(card))}</b><small>${suitSymbol(card?.suit)}</small></span><span class="card-pip" aria-hidden="true">${suitSymbol(card?.suit)}</span><span class="card-corner bottom" aria-hidden="true"><b>${escapeHtml(cardRank(card))}</b><small>${suitSymbol(card?.suit)}</small></span>`}
  </button>`;
}

function introMarkup() {
  return `<section class="palace-entry" aria-labelledby="palace-entry-title">
    <div class="palace-entry-art"><img src="assets/palace-web/palace-app-icon.png" alt="Palace castle under the Four of Hearts mark" width="1024" height="1024"></div>
    <div class="palace-entry-copy"><p class="palace-kicker">${copy.eyebrow}</p><h2 id="palace-entry-title">${copy.heading}</h2><p>${copy.body}</p><p class="palace-privacy-line">${copy.privacy}</p>
      <p class="palace-fixed-opponent">You and Oner. The same two-seat table on every attempt.</p>
      <div class="palace-entry-actions"><button class="palace-primary" type="button" data-deal>${copy.deal}</button><a href="palace-faq.html">${copy.how}</a></div>
    </div>
  </section>`;
}

function completionMarkup() {
  const result = record?.result || {};
  const won = result.winnerIndex === 0;
  return `<section class="palace-complete" aria-labelledby="palace-complete-title">
    <div class="palace-complete-art"><img src="assets/palace-web/palace-app-icon.png" alt="Palace castle and Four of Hearts game mark" width="1024" height="1024"></div>
    <div class="palace-complete-copy"><p class="palace-kicker">${copy.completeEyebrow}</p><h2 id="palace-complete-title">${copy.completeHeading}</h2><p>${copy.completeBody}</p><p class="palace-result-line"><strong>${won ? "You were first out." : `${escapeHtml(result.winnerName || "A rival")} was first out.`}</strong> ${escapeHtml(result.finalMessage || "The game reached its legal result.")}</p><div class="palace-entry-actions"><button class="palace-primary" type="button" data-replay>Play this same deal again</button><a href="palace.html">${copy.explore}</a><a href="games.html">${copy.games}</a></div></div>
  </section>`;
}

function phaseFor(player) {
  if (player.hand.length) return "Hand";
  if (player.faceUp.length) return "Face-up cards";
  if (player.faceDown.length) return "Face-down cards";
  return "Out";
}

function opponentMarkup(player, index) {
  const total = player.hand.length + player.faceUp.length + player.faceDown.length;
  const active = game.currentPlayer === index;
  const backs = Array.from({ length: Math.min(5, Math.max(0, player.hand.length)) }, (_, cardIndex) => `<span class="opponent-back" style="--card:${cardIndex}" aria-hidden="true"></span>`).join("");
  return `<section class="palace-seat opponent-seat seat-${index}${active ? " is-active" : ""}" aria-label="${escapeHtml(player.name)}, ${total} cards, ${phaseFor(player)}${active ? ", current turn" : ""}">
    <div class="seat-avatar" aria-hidden="true">${escapeHtml(player.avatar || "🙂")}</div><div class="seat-label"><strong>${escapeHtml(player.name)}</strong><span>${total} cards · ${phaseFor(player)}</span></div><div class="opponent-hand">${backs}</div>
  </section>`;
}

function tableCardsMarkup(player, interactive) {
  const slots = [0, 1, 2].map((slot) => {
    const down = player.faceDown[slot];
    const up = player.faceUp[slot];
    const downMarkup = down ? cardMarkup(down, { blind: true, zone: "faceDown", disabled: !interactive || player.faceUp.length > 0 }) : "";
    const playableIds = interactive ? new Set(getPlayableCards(game, RULES, 0).map((card) => card.id)) : new Set();
    const upMarkup = up ? cardMarkup(up, { zone: "faceUp", legal: playableIds.has(up.id), disabled: game.status !== "setup" && (!interactive || (playableIds.size > 0 && !playableIds.has(up.id))) }) : "";
    return `<div class="palace-table-card-slot">${downMarkup}${upMarkup}</div>`;
  }).join("");
  return `<div class="palace-table-cards" aria-label="Your Palace cards">${slots}</div>`;
}

function handMarkup() {
  const human = game.players[0];
  const playableIds = new Set(getPlayableCards(game, RULES, 0).map((card) => card.id));
  const jumpIds = new Set(getJumpInMoveAt(game, RULES, 0, jumpNow())?.cards.map(c => c.id) || []);
  return human.hand.map((card, index) => cardMarkup(card, {
    zone: "hand",
    legal: game.status === "setup" || playableIds.has(card.id) || jumpIds.has(card.id),
    disabled: game.status !== "setup" && !jumpIds.has(card.id) && (game.currentPlayer !== 0 || !playableIds.has(card.id))
  })).join("");
}

function pileMarkup() {
  const top = game.pile.at(-1);
  return `<div class="palace-center-pile"><p>Pick-up <b>${game.pile.length}</b></p>${top ? cardMarkup(top, { disabled: true }) : '<div class="empty-pile" aria-label="Empty pile"><span>LEAD</span></div>'}</div>`;
}

function actionPrompt() {
  if (game.status === "setup") return setupPick ? `Now choose a ${setupPick.zone === "hand" ? "face-up" : "hand"} card to swap.` : "Swap any hand card with any face-up card, then start the hand.";
  if (game.currentPlayer !== 0) return `${game.players[game.currentPlayer]?.name || "A rival"} is playing.`;
  const human = game.players[0];
  const playable = getPlayableCards(game, RULES, 0);
  if (!playable.length && game.pile.length) return human.faceUp.length && !human.hand.length ? "Choose a face-up card to take with the pile." : "No legal card. Pick up the pile.";
  if (!game.pile.length) return "Your turn. Lead any card.";
  const top = game.pile.at(-1);
  if (top?.rank === "8") return "Transparent 8: follow the card beneath it.";
  return "Your turn. Match or beat the active rank—or use a power card.";
}

function commandMarkup() {
  if (game.status === "setup") return `<button class="palace-primary palace-command" type="button" data-start-hand>Start hand</button>`;
  const jump = getJumpInMoveAt(game, RULES, 0, jumpNow());
  if (jump) return `<button class="palace-primary palace-command" type="button" data-jump ${selection.length && selection.length < 2 ? "disabled" : ""}>Jump in${selection.length ? ` × ${selection.length}` : ""}</button>`;
  if (game.currentPlayer !== 0) return "";
  const human = game.players[0];
  const playable = getPlayableCards(game, RULES, 0);
  if (!playable.length && game.pile.length) {
    if (!human.hand.length && human.faceUp.length) return selection.length ? `<button class="palace-primary palace-command" type="button" data-play-selected>Pick up with this card</button>` : "";
    return `<button class="palace-primary palace-command" type="button" data-pickup>Pick up</button>`;
  }
  return selection.length ? `<button class="palace-primary palace-command" type="button" data-play-selected>Play selected × ${selection.length}</button>` : "";
}
function tableMarkup() {
  const human = game.players[0];
  const setup = game.status === "setup";
  const activeHuman = game.currentPlayer === 0;
  const deckCount = game.deck.length;
  return `<section class="palace-app-frame${setup ? " is-setup" : ""}" aria-labelledby="palace-table-title">
    <header class="palace-app-bar"><div class="palace-app-identity"><img src="assets/palace-web/palace-app-icon.png" alt="" width="48" height="48"><span><strong id="palace-table-title">Palace</strong><small>FOUR OF HEARTS</small></span></div><div class="palace-app-tools"><button type="button" data-sound aria-pressed="${preferences.sound}" aria-label="${preferences.sound ? "Mute" : "Turn on"} game sounds">${preferences.sound ? "Sound on" : "Sound off"}</button><button type="button" data-motion aria-pressed="${preferences.reducedMotion}" aria-label="${preferences.reducedMotion ? "Use standard motion" : "Reduce motion"}">${preferences.reducedMotion ? "Motion reduced" : "Motion on"}</button><button type="button" data-fullscreen aria-label="Enter full screen">Full screen</button></div></header>
    <div class="palace-turn-ribbon" role="status" aria-live="polite"><span aria-hidden="true"></span>${setup ? "Choose your top-row cards" : activeHuman ? "Your turn" : `${escapeHtml(game.players[game.currentPlayer]?.name || "Opponent")} is playing`}</div>
    <div class="palace-table" data-palace-table>
      <div class="palace-opponents">${game.players.map((player, index) => index ? opponentMarkup(player, index) : "").join("")}</div>
      <div class="palace-table-watermark" aria-hidden="true">4<span>♥</span>H</div>
      <div class="palace-deck-counter" aria-label="Deck ${deckCount}, pick-up pile ${game.pile.length}"><span>Deck <b>${deckCount}</b></span><span>Pick-up <b>${game.pile.length}</b></span></div>
      ${pileMarkup()}
      <section class="palace-human-zone${activeHuman ? " is-active" : ""}" aria-label="Your cards">
        <div class="human-seat-label"><strong>You</strong><span>${phaseFor(human)}</span></div>
        ${tableCardsMarkup(human, !setup && activeHuman && !human.hand.length)}
        ${human.hand.length ? `<div class="palace-hand" aria-label="Your hand">${handMarkup()}</div>` : ""}
      </section>
      <aside class="palace-action-dock"><p class="palace-latest" aria-live="polite">${escapeHtml(game.message)}</p><p class="palace-prompt">${escapeHtml(actionPrompt())}</p>${commandMarkup()}<button class="palace-log-button" type="button" data-log>View log</button></aside>
    </div>
  </section>
  <dialog class="palace-log-dialog" data-log-dialog aria-labelledby="palace-log-title"><div><button type="button" data-close-log aria-label="Close round history">×</button><h2 id="palace-log-title">Round history</h2><ol>${(game.log || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol></div></dialog>`;
}

function render({announce=false}={}) {
  clearTimeout(botTimer);pending.delete(botTimer);
  const focusedCard = ROOT.contains(document.activeElement) ? document.activeElement?.dataset.cardId : null;
  try {
    ROOT.getAnimations?.({subtree:true}).forEach(a=>a.cancel());
    ROOT.innerHTML=!game?introMarkup():game.status==='finished'?completionMarkup():tableMarkup();
    ROOT.removeAttribute('aria-busy');
    document.body.classList.toggle('palace-game-active',Boolean(game && game.status!=='finished'));
    updateNotice();bindEvents();if(announce)ROOT.focus({preventScroll:true});
    else if(focusedCard) ROOT.querySelector(`[data-card-id="${CSS.escape(focusedCard)}"]:not(:disabled)`)?.focus({preventScroll:true});
    if(game?.status==='playing' && game.currentPlayer>0)scheduleBot();
    else if(game?.status==='playing' && game.jumpInWindow)botTimer=later(()=>{if(commit({type:'close-window'}))render();},fastMode?8:Math.max(0,game.jumpInWindow.deadlineAt-game.jumpInWindow.openedAt));
  } catch {showError();}
}
function bindEvents() {
 const token=generation;
 const on=(selector,callback)=>ROOT.querySelectorAll(selector).forEach(node=>node.addEventListener('click',()=>{if(token!==generation)return;try{callback(node);}catch{showError();}}));
 on('[data-deal]',resetDemo);on('[data-replay]',resetDemo);on('[data-start-hand]',startHand);
 on('[data-pickup]',()=>humanPlay(null));on('[data-play-selected]',playSelected);on('[data-jump]',jumpIn);
 on('[data-card-id]',node=>chooseCard(node.dataset.cardId,node.dataset.zone));
 on('[data-sound]',()=>{preferences.sound=!preferences.sound;savePreferences();if(preferences.sound)tone(520,.06);render();});
 on('[data-motion]',()=>{preferences.reducedMotion=!preferences.reducedMotion;savePreferences();render();});
 on('[data-fullscreen]',()=>{const token=generation;ROOT.querySelector('.palace-app-frame')?.requestFullscreen?.()?.catch(()=>{if(token===generation){notice='Full screen is unavailable in this browser.';updateNotice();}});});
 const dialog=ROOT.querySelector('[data-log-dialog]');on('[data-log]',()=>dialog?.showModal());on('[data-close-log]',()=>dialog?.close());
}

function chooseCard(cardId, zone) {
  if (!game || busy) return;
  const human = game.players[0];
  if (game.status === "setup") {
    if (!setupPick) {
      setupPick = { cardId, zone };
      render();
      return;
    }
    if (setupPick.cardId === cardId) {
      setupPick = null;
      render();
      return;
    }
    if (setupPick.zone === zone) {
      setupPick = { cardId, zone };
      render();
      return;
    }
    const handId = zone === "hand" ? cardId : setupPick.cardId;
    const faceUpId = zone === "faceUp" ? cardId : setupPick.cardId;
    if(!commit({type:"swap",handId,faceUpId}))return;
    setupPick = null;
    saveGame();
    tone(460, 0.04);
    render();
    return;
  }
  const jumpMove = getJumpInMoveAt(game, RULES, 0, jumpNow());
  if (jumpMove && jumpMove.cards.some((item) => item.id === cardId)) {
    if (selection.includes(cardId)) selection = selection.filter((id) => id !== cardId);
    else selection = selection.filter((id) => jumpMove.cards.some((item) => item.id === id)).concat(cardId);
    render();
    return;
  }
  if (game.currentPlayer !== 0) return;
  if (zone === "faceDown") {
    humanPlay(cardId);
    return;
  }
  const playable = getPlayableCards(game, RULES, 0);
  const legal = playable.some((card) => card.id === cardId);
  if (!legal && !(zone === "faceUp" && !playable.length && game.pile.length)) return;
  const source = human.hand.length ? human.hand : human.faceUp;
  const card = source.find((item) => item.id === cardId);
  const matching = source.filter((item) => playable.some((playableCard) => playableCard.id === item.id) && item.rank === card?.rank);
  if (selection.includes(cardId)) selection = selection.filter((id) => id !== cardId);
  else if (matching.length > 1 && (isMagicCard(card, RULES) || isOptionalMultiPlayRank(game, card.rank, RULES))) selection = selection.filter((id) => matching.some((item) => item.id === id)).concat(cardId);
  else selection = [cardId];
  render();
}

function startHand() {
  if (!game || game.status !== "setup" || busy) return;
  busy = true;
  if(!commit({type:"start"}))return;
  selection = [];
  setupPick = null;
  saveGame();
  tone(523, 0.08);
  busy = false;
  render();
}

function playSelected() {
  if (!selection.length) return;
  const human = game.players[0];
  const playable = getPlayableCards(game, RULES, 0);
  if (!playable.length && !human.hand.length && human.faceUp.length) {
    humanPlay(selection[0]);
    return;
  }
  humanPlay(selection[0], selection);
}

function humanPlay(cardId, selectedIds = null) {
  if (!game || game.status !== "playing" || game.currentPlayer !== 0 || busy) return;
  busy = true;
  const before = game;
  if(!commit({type:"play",cardId,selectedIds}))return;
  selection = [];
  if (game.revision === before.revision && game.message === before.message) {
    busy = false;
    render();
    return;
  }
  saveGame();
  tone(game.lastEvent?.type === "pickup" ? 196 : game.lastEvent?.type === "clear" ? 784 : 440, game.lastEvent?.type === "pickup" ? 0.13 : 0.06);
  busy = false;
  render();
}

function jumpIn() {
  if (!game || busy) return;
  const move = getJumpInMoveAt(game, RULES, 0, jumpNow());
  if (!move) return;
  const ids = selection.length ? selection : move.cards.map((card) => card.id);
  if (ids.length < PALACE_JUMP_IN_POLICY.minimumCards) return;
  if(!commit({type:"jump",cardIds:ids}))return;
  selection = [];
  saveGame();
  tone(880, 0.09);
  render();
}

function scheduleBot() {
 if(!game || game.status!=='playing' || game.currentPlayer<=0 || document.hidden)return;
 const waitForJump=game.jumpInWindow?game.jumpInWindow.deadlineAt-game.jumpInWindow.openedAt:0;
 const delay=fastMode?8:Math.max(waitForJump,palaceBotActionDelay({bot:game.players[game.currentPlayer],reducedMotion:preferences.reducedMotion,previousAction:game.lastEvent?.type || 'play'}));
 botTimer=later(runBot,delay);
}
function runBot() {
 if(!game || busy || document.hidden || game.status!=='playing' || game.currentPlayer<=0)return;
 busy=true;if(!commit({type:'bot'}))return;
 tone(game.lastEvent?.type==='pickup'?180:game.lastEvent?.type==='clear'?760:330,.04);render();
}

function tone(frequency, duration) {
  if (!preferences.sound) return;
  try {
    audioContext ||= new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillators.add(oscillator);oscillator.onended=()=>oscillators.delete(oscillator);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch { /* Sound remains optional. */ }
}

document.addEventListener('visibilitychange',()=>{clearTimeout(botTimer);pending.delete(botTimer);if(!document.hidden)render();});
window.addEventListener('storage',event=>{
 if(event.key!==STORAGE_KEY)return;
 cancelSession();session=null;record=null;game=null;record=loadRecord();if(session)saveGame();render();
});
if(qaAllowed)window.__PALACE_WEB_QA__=Object.freeze({storageKey:STORAGE_KEY,preferencesKey:PREFERENCES_KEY,fixtureId:FIXTURE_ID,snapshot(){return JSON.parse(JSON.stringify({record,game,session,generation,pending:pending.size}));}});
record=loadRecord();if(session)saveGame();render();
