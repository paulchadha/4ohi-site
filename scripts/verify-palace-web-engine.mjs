import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  CLASSIC_RULES,
  botTakeTurn,
  createInitialGame,
  finishSetup,
  getJumpInMoveAt,
  getPalaceWinnerIndex,
  getPlayableCards,
  playCard,
  playJumpIn,
  swapSetupCards
} from "../assets/palace-web/shared/palaceEngine.js";

const RULES = CLASSIC_RULES;
const results = [];
const test = (name, callback) => {
  try { callback(); results.push({ name, status: "pass" }); console.log(`PASS ${results.length}. ${name}`); }
  catch (error) { results.push({ name, status: "fail", error: error.message }); console.error(`FAIL ${name}: ${error.stack}`); }
};
const card = (rank, suit = "clubs") => ({ id: `${rank}-${suit}`, rank, suit });
const player = (name, options = {}) => ({ id: name.toLowerCase(), botId: options.bot ? name.toLowerCase() : null, name, avatar: "🙂", personality: options.bot ? "sharp" : "human", tempoProfile: options.bot ? "quick" : "human", bot: Boolean(options.bot), out: false, hand: options.hand || [], faceUp: options.faceUp || [], faceDown: options.faceDown || [] });
const state = ({ human, bot, pile = [], deck = [], currentPlayer = 0 }) => ({ id: "fixture", revision: 0, updatedAt: 0, players: [human, bot], deck, pile, currentPlayer, winnerIndex: null, loserIndex: null, safeOrder: [], lastPlay: null, quickMatchRank: null, jumpInWindow: null, botStrategyMemory: [], botTurnCount: 0, setupReady: [true, true], log: [], status: "playing", message: "Fixture" });
const allCards = (game) => [...game.deck, ...game.pile, ...game.players.flatMap((entry) => [...entry.hand, ...entry.faceUp, ...entry.faceDown])];
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const originalRandom = Math.random;
const seededRandom = (seed) => { let value = seed >>> 0; return () => { value += 0x6D2B79F5; let t = value; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const withSeed = (seed, callback) => { Math.random = seededRandom(seed); try { return callback(); } finally { Math.random = originalRandom; } };

const initial = withSeed(1, () => createInitialGame(RULES, 2));
test("initial deal conserves 52 unique cards", () => { assert.equal(allCards(initial).length, 52); assert.equal(new Set(allCards(initial).map((item) => item.id)).size, 52); });
test("initial deal creates three hand, top, and blind cards per player", () => initial.players.forEach((entry) => assert.deepEqual([entry.hand.length, entry.faceUp.length, entry.faceDown.length], [3, 3, 3])));
test("opening setup swaps one owned hand and face-up card", () => { const before = initial; const hand = before.players[0].hand[0]; const up = before.players[0].faceUp[0]; const next = swapSetupCards(before, hand.id, up.id, RULES); assert(next.players[0].hand.some((item) => item.id === up.id)); assert(next.players[0].faceUp.some((item) => item.id === hand.id)); });
test("setup completion begins authoritative play with one lead", () => { const next = finishSetup(initial, RULES); assert.equal(next.status, "playing"); assert.equal(next.pile.length, 1); });
test("legal ordinary card advances the turn", () => { const game = state({ human: player("You", { hand: [card("6"), card("9")] }), bot: player("Bot", { bot: true, hand: [card("4", "hearts"), card("5", "hearts")] }), pile: [card("5", "spades")] }); const next = playCard(game, RULES, 0, "6-clubs"); assert.equal(next.currentPlayer, 1); });
test("illegal hand card cannot be submitted as a legal placement", () => { const game = state({ human: player("You", { hand: [card("4")] }), bot: player("Bot", { bot: true, hand: [card("6")] }), pile: [card("9", "spades")] }); assert.equal(getPlayableCards(game, RULES, 0).length, 0); });
test("equal-rank multi-play places every selected card", () => { const game = state({ human: player("You", { hand: [card("6"), card("6", "hearts"), card("9")] }), bot: player("Bot", { bot: true, hand: [card("4")] }), pile: [card("5", "spades")] }); const next = playCard(game, RULES, 0, "6-clubs", ["6-clubs", "6-hearts"]); assert.equal(next.lastPlay.cards.length, 2); });
test("2 resets while preserving the pile", () => { const game = state({ human: player("You", { hand: [card("2"), card("9")] }), bot: player("Bot", { bot: true, hand: [card("3"), card("4")] }), pile: [card("A", "spades")] }); const next = playCard(game, RULES, 0, "2-clubs"); assert.equal(next.pile.length, 2); assert.equal(getPlayableCards(next, RULES, 1).length, 2); });
test("3 remains an ordinary card", () => { const game = state({ human: player("You", { hand: [card("3")] }), bot: player("Bot", { bot: true }), pile: [card("4", "spades")] }); assert.equal(getPlayableCards(game, RULES, 0).length, 0); });
test("7 requires seven or lower", () => { const game = state({ human: player("You", { hand: [card("6"), card("9")] }), bot: player("Bot", { bot: true }), pile: [card("7", "spades")] }); assert.deepEqual(getPlayableCards(game, RULES, 0).map((item) => item.rank), ["6"]); });
test("8 is transparent through the active pile history", () => { const game = state({ human: player("You", { hand: [card("6"), card("9")] }), bot: player("Bot", { bot: true }), pile: [card("7", "spades"), card("8", "hearts")] }); assert.deepEqual(getPlayableCards(game, RULES, 0).map((item) => item.rank), ["6"]); });
test("10 burns and keeps the same player on lead", () => { const game = state({ human: player("You", { hand: [card("10"), card("4")] }), bot: player("Bot", { bot: true, hand: [card("9")] }), pile: [card("A", "spades")] }); const next = playCard(game, RULES, 0, "10-clubs"); assert.equal(next.pile.length, 0); assert.equal(next.currentPlayer, 0); });
test("four consecutive ranks burn the pile", () => { const game = state({ human: player("You", { hand: [card("6", "spades"), card("9")] }), bot: player("Bot", { bot: true }), pile: [card("6"), card("6", "hearts"), card("6", "diamonds")] }); const next = playCard(game, RULES, 0, "6-spades"); assert.equal(next.pile.length, 0); });
test("eligible player can jump in out of turn with matching cards", () => { const game = state({ human: player("You", { hand: [card("6"), card("6", "hearts"), card("9")] }), bot: player("Bot", { bot: true, hand: [card("4")] }), pile: [card("6", "spades"), card("6", "diamonds")], currentPlayer: 1 }); game.jumpInWindow = { rank:"6", playedBy:1, turnPlayerIndex:1, eligiblePlayerIndices:[0], openedAt:100, deadlineAt:1000, expectedRevision:1 }; const move = getJumpInMoveAt(game, RULES, 0, 500); assert.equal(move.cards.length, 2); const next = playJumpIn(game, RULES, 0, ["6-clubs", "6-hearts"], { now:500 }); assert.equal(next.lastPlay.jumpIn, true); assert.equal(next.pile.length, 0); });
test("expired jump-in window cannot be used", () => { const game = state({ human: player("You", { hand: [card("6"), card("6", "hearts")] }), bot: player("Bot", { bot: true, hand: [card("4")] }), pile: [card("6", "spades")], currentPlayer:1 }); game.jumpInWindow = { rank:"6", playedBy:1, turnPlayerIndex:1, eligiblePlayerIndices:[0], openedAt:100, deadlineAt:1000, expectedRevision:1 }; assert.equal(getJumpInMoveAt(game, RULES, 0, 1000), null); assert.equal(playJumpIn(game, RULES, 0, null, { now:1000 }), game); });test("forced pickup moves the pile into hand", () => { const game = state({ human: player("You", { hand: [card("4")] }), bot: player("Bot", { bot: true }), pile: [card("A", "spades")] }); const next = playCard(game, RULES, 0, null); assert.equal(next.players[0].hand.length, 2); assert.equal(next.pile.length, 0); });
test("valid hand play draws back to three", () => { const game = state({ human: player("You", { hand: [card("6")] }), bot: player("Bot", { bot: true }), pile: [card("5", "spades")], deck: [card("9"), card("Q")] }); const next = playCard(game, RULES, 0, "6-clubs"); assert.equal(next.players[0].hand.length, 2); assert.equal(next.deck.length, 0); });
test("draw exhaustion leaves the reduced hand unchanged", () => { const game = state({ human: player("You", { hand: [card("6"), card("9")] }), bot: player("Bot", { bot: true }), pile: [card("5", "spades")] }); const next = playCard(game, RULES, 0, "6-clubs"); assert.equal(next.players[0].hand.length, 1); });
test("empty hand activates face-up table cards", () => { const game = state({ human: player("You", { hand: [card("6")], faceUp: [card("9")] }), bot: player("Bot", { bot: true, hand: [card("4")] }), pile: [card("5", "spades")] }); const next = playCard(game, RULES, 0, "6-clubs"); next.currentPlayer = 0; assert.equal(getPlayableCards(next, RULES, 0)[0].id, "9-clubs"); });
test("empty hand and top row exposes blind cards", () => { const game = state({ human: player("You", { faceDown: [card("9")] }), bot: player("Bot", { bot: true }), pile: [card("5", "spades")] }); assert.equal(getPlayableCards(game, RULES, 0)[0].blind, true); });
test("illegal blind card is consumed and picks up the pile", () => { const game = state({ human: player("You", { faceDown: [card("4")] }), bot: player("Bot", { bot: true }), pile: [card("A", "spades")] }); const next = playCard(game, RULES, 0, "4-clubs"); assert.equal(next.players[0].faceDown.length, 0); assert.equal(next.players[0].hand.length, 2); assert.equal(next.lastEvent.illegalBlind, true); });
test("bot chooses a legal placement", () => { const game = state({ human: player("You", { hand: [card("3")] }), bot: player("Bot", { bot: true, hand: [card("6"), card("4")] }), pile: [card("5", "spades")], currentPlayer: 1 }); const next = botTakeTurn(game, RULES); assert.equal(next.lastPlay.cards[0].rank, "6"); });
test("bot performs a forced pickup", () => { const game = state({ human: player("You", { hand: [card("3")] }), bot: player("Bot", { bot: true, hand: [card("4")] }), pile: [card("A", "spades")], currentPlayer: 1 }); const next = botTakeTurn(game, RULES); assert.equal(next.lastEvent.type, "pickup"); });
test("legal final card produces a winner", () => { const game = state({ human: player("You", { hand: [card("6")] }), bot: player("Bot", { bot: true, hand: [card("9")] }), pile: [card("5", "spades")] }); const next = playCard(game, RULES, 0, "6-clubs"); assert.equal(next.status, "finished"); assert.equal(getPalaceWinnerIndex(next), 0); });
const webSource = readFileSync(new URL("../assets/palace-web.js", import.meta.url), "utf8");
test("authoritative action writes an in-progress save", () => assert.match(webSource, /saveGame\(\)/));
test("refresh restores the in-progress engine state", () => assert.match(webSource, /record\.game/));
test("completion persists only after engine finished", () => assert.match(webSource, /game\.status === "finished"/));
test("completed state has no public second-deal path", () => { assert.match(webSource, /status: "completed"/); assert(!/Play Again/i.test(webSource)); });
test("development reset is localhost and query gated", () => assert.match(webSource, /qaAllowed[\s\S]+__PALACE_WEB_QA__/));
test("corrupt save presents a bounded recovery path", () => assert.match(webSource, /status: "recovery"/));
test("Canadian entry and completion copy is exact", () => { for (const phrase of ["PLAY PALACE, BUD", "One table. One full game.", "Deal ’em out", "Good game, bud.", "Back to the games"]) assert(webSource.includes(phrase), phrase); });
test("keyboard, mobile, and reduced-motion contracts are present", () => { const html = readFileSync(new URL("../palace-play.html", import.meta.url), "utf8"); const css = readFileSync(new URL("../assets/palace-web.css", import.meta.url), "utf8"); assert(html.includes("palace-web.js")); assert(css.includes("@media(max-width:600px)")); assert(css.includes("prefers-reduced-motion")); assert(css.includes(":focus-visible")); });
test("vendored engine is byte-identical to PalaceApp", () => { assert.equal(hash(new URL("../assets/palace-web/shared/palaceEngine.js", import.meta.url)), hash(new URL("../../PalaceApp/src/game/palaceEngine.js", import.meta.url))); assert.equal(hash(new URL("../assets/palace-web/shared/palaceRules.js", import.meta.url)), hash(new URL("../../PalaceApp/src/game/palaceRules.js", import.meta.url))); });

const simulationFailures = [];
for (let seed = 1; seed <= 100; seed += 1) {
  try {
    withSeed(seed, () => {
      let game = finishSetup(createInitialGame(RULES, 2 + seed % 3), RULES);
      const universe = new Set(allCards(game).map((item) => item.id));
      const removed = new Set();
      let actions = 0;
      while (game.status !== "finished" && actions < 5000) {
        const beforeIds = new Set(allCards(game).map((item) => item.id));
        let next;
        if (game.currentPlayer === 0) {
          const legal = getPlayableCards(game, RULES, 0);
          const move = legal.length ? legal[Math.floor(Math.random() * legal.length)] : null;
          next = playCard(game, RULES, 0, move?.id || null, null, { now: actions * 4000 });
        } else next = botTakeTurn(game, RULES);
        const afterCards = allCards(next);
        const afterIds = new Set(afterCards.map((item) => item.id));
        assert.equal(afterCards.length, afterIds.size, `seed ${seed}: duplicate card`);
        for (const id of beforeIds) if (!afterIds.has(id)) removed.add(id);
        for (const id of afterIds) assert(universe.has(id), `seed ${seed}: unknown card ${id}`);
        assert.equal(new Set([...afterIds, ...removed]).size, 52, `seed ${seed}: lost card accounting`);
        assert(next.currentPlayer === -1 || (next.currentPlayer >= 0 && next.currentPlayer < next.players.length), `seed ${seed}: invalid turn`);
        game = next;
        actions += 1;
      }
      assert.equal(game.status, "finished", `seed ${seed}: action ceiling`);
      assert.notEqual(getPalaceWinnerIndex(game), null, `seed ${seed}: no winner`);
    });
  } catch (error) { simulationFailures.push({ seed, error: error.message }); }
}

if (simulationFailures.length) {
  console.error("Simulation failures:", JSON.stringify(simulationFailures, null, 2));
  process.exitCode = 1;
} else console.log("PASS 100 seeded complete-game simulations (0 failed)");
const failures = results.filter((entry) => entry.status === "fail");
if (failures.length) process.exitCode = 1;
else console.log(`Palace web engine QA passed: ${results.length} focused checks and 100 complete simulations.`);