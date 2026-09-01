import {
  CLASSIC_RULES,
  PALACE_JUMP_IN_POLICY,
  botTakeTurn,
  createInitialGame,
  describeCard,
  finishSetup,
  getJumpInMoveAt,
  getPalacePlacementOrder,
  getPalaceWinnerIndex,
  getPlayableCards,
  isMagicCard,
  isOptionalMultiPlayRank,
  maybeBotJumpIn,
  playCard,
  playJumpIn,
  swapSetupCards
} from "./palace-web/shared/palaceEngine.js";
import { palaceBotActionDelay } from "./palace-web/shared/palaceTiming.js";

const ROOT = document.querySelector("#palace-web-game");
const STORAGE_KEY = "4oh_palace_web_v1";
const PREFERENCES_KEY = "4oh_palace_web_preferences_v1";
const SCHEMA_VERSION = 1;
const SOURCE_COMMIT = "31c7578a3a15db6d3ac78a3c5d332d73a9353afd";
const RULES = CLASSIC_RULES;
const params = new URLSearchParams(location.search);
const canadian = params.get("lang") === "en-CA";
const qaAllowed = ["127.0.0.1", "localhost"].includes(location.hostname) && params.get("palaceQa") === "1";
const fastMode = qaAllowed && params.get("fast") === "1";
const qaSeed = qaAllowed ? Number(params.get("seed") || 5) : null;
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
  privacy: "No account. Your game stays on this device, where it belongs.",
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
  body: "The real 4OH rules, the real table, and the real Palace presentation—right in your browser.",
  privacy: "One complete web game. No account. Progress stays on this device.",
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
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ schemaVersion: 1, ...preferences }));
}

function validRecord(value) {
  if (!value || value.schemaVersion !== SCHEMA_VERSION || !["inProgress", "completed"].includes(value.status)) return false;
  if (value.status === "completed") return Boolean(value.result && Number.isInteger(value.result.winnerIndex));
  return Boolean(value.game && ["setup", "playing"].includes(value.game.status) && Array.isArray(value.game.players));
}

function loadRecord() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!validRecord(parsed)) throw new Error("obsolete-or-invalid");
    return parsed;
  } catch {
    return { status: "recovery", corrupt: true };
  }
}

function saveGame() {
  if (!game) return;
  if (game.status === "finished") {
    const winnerIndex = getPalaceWinnerIndex(game);
    record = {
      schemaVersion: SCHEMA_VERSION,
      sourceCommit: SOURCE_COMMIT,
      status: "completed",
      completedAt: new Date().toISOString(),
      result: {
        gameId: game.id,
        winnerIndex,
        winnerName: game.players[winnerIndex]?.name || "Player",
        loserIndex: game.loserIndex,
        placementOrder: getPalacePlacementOrder(game),
        playerCount: game.players.length,
        finalMessage: game.message
      }
    };
  } else {
    record = {
      schemaVersion: SCHEMA_VERSION,
      sourceCommit: SOURCE_COMMIT,
      status: "inProgress",
      updatedAt: new Date().toISOString(),
      playerCount: game.players.length,
      game
    };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withRandom(random, callback) {
  if (!random) return callback();
  const original = Math.random;
  Math.random = random;
  try { return callback(); } finally { Math.random = original; }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

const suitSymbol = (suit) => ({ clubs: "♣", diamonds: "♦", hearts: "♥", spades: "♠", red: "★", black: "★" })[suit] || "";
const isRed = (card) => ["hearts", "diamonds", "red"].includes(card?.suit);
const cardRank = (card) => card?.rank === "Joker" ? "★" : card?.rank;

function cardMarkup(card, options = {}) {
  const blind = options.blind || card?.blind;
  const selected = selection.includes(card?.id);
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
      <fieldset class="palace-player-count"><legend>Choose the table</legend><label><input type="radio" name="palace-players" value="2" checked><span>1 bot</span></label><label><input type="radio" name="palace-players" value="3"><span>2 bots</span></label><label><input type="radio" name="palace-players" value="4"><span>3 bots</span></label></fieldset>
      <div class="palace-entry-actions"><button class="palace-primary" type="button" data-deal>${copy.deal}</button><a href="palace-faq.html">${copy.how}</a></div>
    </div>
  </section>`;
}

function recoveryMarkup() {
  return `<section class="palace-entry palace-recovery" aria-labelledby="palace-recovery-title"><div class="palace-entry-copy"><p class="palace-kicker">TABLE RECOVERY</p><h2 id="palace-recovery-title">This saved table cannot be opened.</h2><p>The saved game is damaged or belongs to an older incompatible build. Clear only this Palace game and deal your one web game.</p><button class="palace-primary" type="button" data-recover>Clear invalid save</button></div></section>`;
}

function completionMarkup() {
  const result = record?.result || {};
  const won = result.winnerIndex === 0;
  return `<section class="palace-complete" aria-labelledby="palace-complete-title">
    <div class="palace-complete-art"><img src="assets/palace-web/palace-app-icon.png" alt="Palace castle and Four of Hearts game mark" width="1024" height="1024"></div>
    <div class="palace-complete-copy"><p class="palace-kicker">${copy.completeEyebrow}</p><h2 id="palace-complete-title">${copy.completeHeading}</h2><p>${copy.completeBody}</p><p class="palace-result-line"><strong>${won ? "You were first out." : `${escapeHtml(result.winnerName || "A rival")} was first out.`}</strong> ${escapeHtml(result.finalMessage || "The game reached its legal result.")}</p><div class="palace-entry-actions"><a class="palace-primary" href="palace.html">${copy.explore}</a><a href="games.html">${copy.games}</a></div></div>
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
  return human.hand.map((card, index) => cardMarkup(card, {
    zone: "hand",
    legal: game.status === "setup" || playableIds.has(card.id),
    disabled: game.status !== "setup" && (game.currentPlayer !== 0 || !playableIds.has(card.id))
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
  const jump = getJumpInMoveAt(game, RULES, 0, Date.now());
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

function render({ announce = false } = {}) {
  clearTimeout(botTimer);
  record = record || loadRecord();
  if (record?.status === "recovery") ROOT.innerHTML = recoveryMarkup();
  else if (record?.status === "completed") ROOT.innerHTML = completionMarkup();
  else if (!game && record?.status === "inProgress") {
    game = record.game;
    ROOT.innerHTML = tableMarkup();
  } else if (!game) ROOT.innerHTML = introMarkup();
  else if (game.status === "finished") {
    saveGame();
    ROOT.innerHTML = completionMarkup();
  } else ROOT.innerHTML = tableMarkup();
  ROOT.removeAttribute("aria-busy");
  document.body.classList.toggle("palace-game-active", Boolean(game && game.status !== "finished"));
  if (game && game.status !== "finished") window.scrollTo({ top: 0, behavior: "instant" });
  bindEvents();
  if (announce) ROOT.focus({ preventScroll: true });
  if (game?.status === "playing" && game.currentPlayer > 0) scheduleBot();
  else if (game?.status === "playing" && game.currentPlayer === 0 && game.jumpInWindow) {
    const expiresIn = Math.max(0, Number(game.jumpInWindow.deadlineAt || 0) - Date.now() + 20);
    botTimer = setTimeout(() => {
      if (!game?.jumpInWindow || game.currentPlayer !== 0 || getJumpInMoveAt(game, RULES, 0, Date.now())) return;
      game = { ...game, jumpInWindow: null };
      saveGame();
      render();
    }, expiresIn);
  }
}

function bindEvents() {
  ROOT.querySelector("[data-deal]")?.addEventListener("click", startGame);
  ROOT.querySelector("[data-recover]")?.addEventListener("click", () => { localStorage.removeItem(STORAGE_KEY); record = null; game = null; render({ announce: true }); });
  ROOT.querySelector("[data-start-hand]")?.addEventListener("click", startHand);
  ROOT.querySelector("[data-pickup]")?.addEventListener("click", () => humanPlay(null));
  ROOT.querySelector("[data-play-selected]")?.addEventListener("click", playSelected);
  ROOT.querySelector("[data-jump]")?.addEventListener("click", jumpIn);
  ROOT.querySelectorAll("[data-card-id]").forEach((button) => button.addEventListener("click", () => chooseCard(button.dataset.cardId, button.dataset.zone)));
  ROOT.querySelector("[data-sound]")?.addEventListener("click", () => { preferences.sound = !preferences.sound; savePreferences(); if (preferences.sound) tone(520, 0.06); render(); });
  ROOT.querySelector("[data-motion]")?.addEventListener("click", () => { preferences.reducedMotion = !preferences.reducedMotion; savePreferences(); render(); });
  ROOT.querySelector("[data-fullscreen]")?.addEventListener("click", () => ROOT.querySelector(".palace-app-frame")?.requestFullscreen?.());
  const dialog = ROOT.querySelector("[data-log-dialog]");
  ROOT.querySelector("[data-log]")?.addEventListener("click", () => dialog?.showModal());
  ROOT.querySelector("[data-close-log]")?.addEventListener("click", () => dialog?.close());
}

function startGame() {
  if (record?.status === "completed" || busy) return;
  busy = true;
  const playerCount = Number(ROOT.querySelector('input[name="palace-players"]:checked')?.value || 2);
  const random = qaSeed == null ? null : seededRandom(qaSeed);
  game = withRandom(random, () => createInitialGame(RULES, playerCount, { name: "You", avatar: "🙂" }));
  record = null;
  selection = [];
  setupPick = null;
  saveGame();
  tone(392, 0.08);
  busy = false;
  render({ announce: true });
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
    game = swapSetupCards(game, handId, faceUpId, RULES);
    setupPick = null;
    saveGame();
    tone(460, 0.04);
    render();
    return;
  }
  const jumpMove = getJumpInMoveAt(game, RULES, 0, Date.now());
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
  game = finishSetup(game, RULES);
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
  game = playCard(game, RULES, 0, cardId, selectedIds, { now: Date.now() });
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
  const move = getJumpInMoveAt(game, RULES, 0, Date.now());
  if (!move) return;
  const ids = selection.length ? selection : move.cards.map((card) => card.id);
  if (ids.length < PALACE_JUMP_IN_POLICY.minimumCards) return;
  game = playJumpIn(game, RULES, 0, ids, { now: Date.now() });
  selection = [];
  saveGame();
  tone(880, 0.09);
  render();
}

function scheduleBot() {
  if (!game || game.status !== "playing" || game.currentPlayer <= 0 || document.hidden) return;
  const waitForJump = game.jumpInWindow ? Math.max(0, Number(game.jumpInWindow.deadlineAt || 0) - Date.now()) : 0;
  const delay = fastMode ? 8 : Math.max(waitForJump, palaceBotActionDelay({ bot: game.players[game.currentPlayer], reducedMotion: preferences.reducedMotion, previousAction: game.lastEvent?.type || "play" }));
  botTimer = setTimeout(runBot, delay);
}

function runBot() {
  if (!game || busy || document.hidden || game.status !== "playing" || game.currentPlayer <= 0) return;
  busy = true;
  if (game.jumpInWindow) {
    const jumped = maybeBotJumpIn(game, RULES, game.jumpInWindow.playedBy, { now: Math.max(Date.now(), Number(game.jumpInWindow.openedAt || 0) + 1000), random: qaSeed == null ? Math.random : seededRandom(qaSeed + Number(game.revision || 0)) });
    if (jumped !== game) game = jumped;
    else game = { ...game, jumpInWindow: null };
  } else game = botTakeTurn(game, RULES);
  saveGame();
  tone(game.lastEvent?.type === "pickup" ? 180 : game.lastEvent?.type === "clear" ? 760 : 330, 0.04);
  busy = false;
  render();
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
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch { /* Sound remains optional. */ }
}

document.addEventListener("visibilitychange", () => {
  clearTimeout(botTimer);
  if (!document.hidden && game?.status === "playing" && game.currentPlayer > 0) scheduleBot();
});

window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  record = loadRecord();
  game = record?.status === "inProgress" ? record.game : null;
  selection = [];
  render();
});

if (qaAllowed) {
  window.__PALACE_WEB_QA__ = Object.freeze({
    storageKey: STORAGE_KEY,
    preferencesKey: PREFERENCES_KEY,
    reset() { localStorage.removeItem(STORAGE_KEY); record = null; game = null; selection = []; render(); },
    snapshot() { return JSON.parse(JSON.stringify({ record, game })); }
  });
}

record = loadRecord();
if (record?.status === "inProgress") game = record.game;
render();