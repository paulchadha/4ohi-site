import { FOUR_OF_HEARTS_PALACE_RULES } from "./palaceRules.js";

export { FOUR_OF_HEARTS_PALACE_RULES } from "./palaceRules.js";

function migrateLegacyBotIdentity(player) {
  if (!player) return player;
  if (player.id === "omar" || player.botId === "omar" || player.name === "Omar") {
    return { ...player, id: "omar", botId: "omar", name: "Oner" };
  }
  return player;
}

const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const RANKS = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];
const BOT_PROFILES = [
  { name: "Austin", gender: "man", avatar: "👨🏻‍🦱", personality: "sharp" },
  { name: "Kyle", gender: "man", avatar: "👨🏼‍🎤", personality: "chaos" },
  { name: "Carp", gender: "man", avatar: "🧢", personality: "lucky" },
  { name: "Ben", gender: "man", avatar: "👨🏻‍💻", personality: "sharp" },
  { name: "Pablito", gender: "man", avatar: "👨🏽‍🎤", personality: "lucky" },
  { name: "Emme", gender: "woman", avatar: "👩🏻‍🎤", personality: "sharp" },
  { name: "Dylan", gender: "man", avatar: "🧑🏼‍🚀", personality: "sharp" },
  { name: "Tenny", gender: "man", avatar: "🧑🏽‍🎨", personality: "chaos" },
  { name: "Vaughn", gender: "man", avatar: "👨🏾‍🎓", personality: "sharp" },
  { name: "Keely", gender: "woman", avatar: "👩🏼‍🚀", personality: "lucky" },
  { name: "Josh", gender: "man", avatar: "👨🏻‍🍳", personality: "sharp" },
  { name: "John", gender: "man", avatar: "👨🏼‍💼", personality: "lucky" },
  { name: "Jen", gender: "woman", avatar: "👩🏻‍💻", personality: "sharp" },
  { name: "Robb", gender: "man", avatar: "🧔🏻‍♂️", personality: "chaos" },
  { name: "Molly", gender: "woman", avatar: "👩🏽‍🎨", personality: "lucky" },
  { name: "Lily", gender: "woman", avatar: "👩🏽‍🎤", personality: "sharp" },
  { name: "Maya", gender: "woman", avatar: "👩🏻‍🎨", personality: "chaos" },
  { name: "Sofi", gender: "woman", avatar: "👩🏼‍🚀", personality: "lucky" },
  { name: "Nora", gender: "woman", avatar: "👩🏾‍💻", personality: "sharp" },
  { name: "Ivy", gender: "woman", avatar: "👱🏻‍♀️", personality: "chaos" },
  { name: "Zara", gender: "woman", avatar: "👩🏽‍🦱", personality: "sharp" },
  { name: "Tess", gender: "woman", avatar: "👩🏼‍🍳", personality: "lucky" },
  { name: "Juno", gender: "woman", avatar: "👩🏻‍🌾", personality: "chaos" },
  { name: "Asha", gender: "woman", avatar: "👩🏾‍🔬", personality: "sharp" },
  { name: "Bea", gender: "woman", avatar: "👩🏼‍✈️", personality: "lucky" },
  { name: "Kira", gender: "woman", avatar: "👩🏽‍🚒", personality: "chaos" },
  { name: "Uma", gender: "woman", avatar: "👩🏻‍🎓", personality: "sharp" },
  { name: "Max", gender: "man", avatar: "👨🏻‍🚀", personality: "sharp" },
  { name: "Leo", gender: "man", avatar: "👱🏼‍♂️", personality: "lucky" },
  { name: "Nico", gender: "man", avatar: "👨🏽‍🎨", personality: "chaos" },
  { id: "omar", name: "Oner", gender: "man", avatar: "👨🏾‍💻", personality: "sharp" },
  { name: "Kai", gender: "man", avatar: "🧑🏻‍🍳", personality: "lucky" },
  { name: "Rafi", gender: "man", avatar: "👨🏽‍🚒", personality: "chaos" },
  { name: "Eli", gender: "man", avatar: "👨🏻‍🎓", personality: "sharp" }
];

export const CLASSIC_RULES = FOUR_OF_HEARTS_PALACE_RULES;

export const PALACE_JUMP_IN_POLICY = Object.freeze({
  windowMs: 3000,
  botReactionDelayMs: 190,
  minimumCards: 2,
  maximumCards: 4
});

export const PALACE_BOT_SAFETY_TURN_LIMIT = 600;

function makeGameId() {
  return "game-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function appendGameLog(game, message) {
  const current = Array.isArray(game.log) ? game.log : [];
  return message ? current.concat(message).slice(-240) : current.slice(-240);
}

function bumpGame(game, message = game.message) {
  game.revision = Number(game.revision || 0) + 1;
  game.updatedAt = Date.now();
  game.log = appendGameLog(game, message);
  return game;
}

function palaceAction(game, type, actorIndex, details = {}) {
  const actor = game.players?.[actorIndex];
  game.lastEvent = {
    type,
    actorIndex,
    actorName: actor?.name || "Player",
    at: Date.now(),
    ...details
  };
  return game;
}

function gameProgressKey(game) {
  const playerKey = (game.players || []).map((player) => [
    (player.hand || []).length,
    (player.faceUp || []).length,
    (player.faceDown || []).length,
    player.out ? 1 : 0
  ].join(",")).join("|");
  return [
    game.status,
    game.currentPlayer,
    (game.pile || []).length,
    (game.deck || []).length,
    playerKey
  ].join(":");
}

function botTempoProfileForName(name = "") {
  const profiles = ["quick", "average", "deliberate", "variable"];
  const hash = String(name).split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return profiles[hash % profiles.length];
}

export function createInitialGame(rules = CLASSIC_RULES, playerCount = 2, humanProfile = { name: "You", avatar: "🙂" }) {
  const seats = clampPlayerCount(playerCount);
  const deck = shuffle(createDeck(rules));
  const profiles = [{ name: humanProfile.name || "You", personality: "human", avatar: humanProfile.avatar || "🙂" }].concat(selectBotProfiles(seats - 1)).slice(0, seats);
  const players = dealPlayers(profiles, deck, rules);
  const createdAt = Date.now();
  const setupMessage = "Swap your hand cards with your top row, then start the hand.";

  return {
    id: makeGameId(),
    revision: 0,
    updatedAt: createdAt,
    players,
    deck,
    pile: [],
    currentPlayer: 0,
    winnerIndex: null,
    loserIndex: null,
    safeOrder: [],
    lastPlay: null,
    quickMatchRank: null,
    jumpInWindow: null,
    botStrategyMemory: [],
    botTurnCount: 0,
    setupReady: players.map((player) => Boolean(player.bot)),
    setupStartedAt: createdAt,
    setupDeadlineAt: null,
    log: [setupMessage],
    status: "setup",
    message: setupMessage
  };
}

export function getPalaceBotProfiles() {
  return BOT_PROFILES.map((profile) => ({ ...profile }));
}

function selectBotProfiles(count) {
  const oner = BOT_PROFILES.find((profile) => profile.id === "omar");
  const others = shuffle(BOT_PROFILES.filter((profile) => profile !== oner));
  return [oner].concat(others).slice(0, count);
}

export function swapSetupCards(game, handCardId, faceUpCardId, rules = CLASSIC_RULES) {
  const next = cloneGame(game);
  const player = next.players[0];
  if (next.status !== "setup") return next;

  const handIndex = player.hand.findIndex((card) => card.id === handCardId);
  const faceUpIndex = player.faceUp.findIndex((card) => card.id === faceUpCardId);
  if (handIndex === -1 || faceUpIndex === -1) return next;

  [player.hand[handIndex], player.faceUp[faceUpIndex]] = [player.faceUp[faceUpIndex], player.hand[handIndex]];
  player.hand = sortHand(player.hand, rules);
  player.faceUp = sortHand(player.faceUp, rules);
  next.message = "Swap made. Set your row, then start the hand.";
  return bumpGame(next, next.message);
}

export function markSetupReady(game, rules = CLASSIC_RULES, playerIndex = 0) {
  const next = cloneGame(game);
  if (next.status !== "setup") return next;
  const ready = Array.from({ length: next.players.length }, (_, index) => Boolean(next.setupReady?.[index] || next.players[index]?.bot));
  if (next.players[playerIndex]) ready[playerIndex] = true;
  next.setupReady = ready;
  if (ready.every(Boolean)) return finishSetup(next, rules);
  next.message = (next.players[playerIndex]?.name || "Player") + " is ready. Waiting for the table.";
  return bumpGame(next, next.message);
}

export function forceSetupReady(game, rules = CLASSIC_RULES) {
  const next = cloneGame(game);
  if (next.status !== "setup") return next;
  next.setupReady = next.players.map(() => true);
  next.message = "Setup time expired. Starting the hand.";
  return finishSetup(next, rules);
}

export function finishSetup(game, rules = CLASSIC_RULES) {
  const next = cloneGame(game);
  if (next.status !== "setup") return next;
  next.players.forEach((player) => {
    player.hand = sortHand(player.hand, rules);
    player.faceUp = sortHand(player.faceUp, rules);
  });
  const starter = findStartingPlayer(next, rules);
  next.status = "playing";
  next.currentPlayer = starter.index;
  const started = playCard(next, rules, starter.index, starter.card.id);
  started.message = starter.player.name + " led " + describeCard(starter.card) + ". Beat this card.";
  return bumpGame(started, started.message);
}

export function getPlayableCards(game, rules, playerIndex) {
  const player = game.players[playerIndex];
  if (game.status === "setup") return [];
  if (!player || player.out || game.currentPlayer !== playerIndex) return [];
  const source = currentSource(player);
  if (source === "faceDown") return player.faceDown.map((card) => ({ ...card, blind: true }));
  return player[source].filter((card) => isLegalCard(card, game.pile, rules));
}

export function getJumpInMove(game, rules, playerIndex) {
  return getJumpInMoveAt(game, rules, playerIndex, Date.now());
}

export function getJumpInMoveAt(game, rules, playerIndex, now = Date.now()) {
  if (!rules.jumpInFourOfKind || game.status !== "playing") return null;
  const player = game.players[playerIndex];
  const window = game.jumpInWindow;
  if (!player || player.out || !window || !game.pile.length) return null;
  if (Number(window.deadlineAt || 0) <= Number(now)) return null;
  if (!Array.isArray(window.eligiblePlayerIndices) || !window.eligiblePlayerIndices.includes(playerIndex)) return null;
  const source = currentSource(player);
  if (source === "faceDown") return null;
  const cards = player[source].filter((card) => effectiveRank(card, rules) === window.rank);
  return cards.length >= PALACE_JUMP_IN_POLICY.minimumCards ? {
    source,
    cards,
    rank: window.rank,
    openedAt: window.openedAt,
    deadlineAt: window.deadlineAt,
    expectedRevision: window.expectedRevision
  } : null;
}

export function playJumpIn(game, rules, playerIndex, selectedCardIds = null, timing = {}) {
  const now = Number(timing.now ?? Date.now());
  const move = getJumpInMoveAt(game, rules, playerIndex, now);
  if (!move) return game;
  const requested = selectedCardIds == null ? move.cards.map((card) => card.id) : selectedCardIds;
  if (!Array.isArray(requested) || requested.length < PALACE_JUMP_IN_POLICY.minimumCards || requested.length > PALACE_JUMP_IN_POLICY.maximumCards) return game;
  if (new Set(requested).size !== requested.length) return game;
  if (!requested.every((cardId) => move.cards.some((card) => card.id === cardId))) return game;

  const next = cloneGame(game);
  const player = next.players[playerIndex];
  const played = requested.map((cardId) => {
    const index = player[move.source].findIndex((item) => item.id === cardId);
    return index === -1 ? null : player[move.source].splice(index, 1)[0];
  }).filter(Boolean);
  if (played.length !== requested.length || played.some((card) => effectiveRank(card, rules) !== move.rank)) return game;

  next.pile.push(...played);
  next.lastPlay = { playerIndex, cards: played, jumpIn: true };
  next.jumpInWindow = null;
  if (move.source === "hand") drawBackUp(player, next.deck, rules.handSize, rules);
  const clearReason = pileClearReason(next.pile, rules, played[played.length - 1]);
  const burned = Boolean(clearReason);
  if (burned) next.pile = [];

  if (hasPlayerGoneOut(player)) {
    const resolved = resolvePlayerOut(next, playerIndex, player.name + " jumped in and is safe and out.", rules);
    resolved.message = player.name + " jumped in with " + formatPlayedLabel(played) + (burned ? ", burned the pile, and is safe and out." : " and is safe and out.");
    palaceAction(resolved, "placement", playerIndex, { source: move.source, cardIds: played.map((item) => item.id), groupedCount: played.length, jumpIn: true, burned, clearReason, placement: resolved.safeOrder.indexOf(playerIndex) + 1 });
    return resolved;
  }
  next.currentPlayer = burned ? playerIndex : nextActivePlayer(next, playerIndex);
  next.message = player.name + " jumped in with " + formatPlayedLabel(played) + (burned ? " and burned the pile." : ".");
  palaceAction(next, "jumpIn", playerIndex, { source: move.source, cardIds: played.map((item) => item.id), groupedCount: played.length, burned, clearReason });
  return next;
}

export function maybeBotJumpIn(game, rules, previousPlayerIndex, timing = {}) {
  if (!rules.jumpInFourOfKind || game.status !== "playing") return game;
  const now = Number(timing.now ?? Date.now());
  const random = timing.random || Math.random;
  if (!game.jumpInWindow) return game;
  const candidates = game.players
    .map((player, index) => ({ player, index, move: getJumpInMoveAt(game, rules, index, now) }))
    .filter((entry) =>
      entry.index !== previousPlayerIndex
      && entry.player.bot
      && entry.move
      && now >= Number(game.jumpInWindow.openedAt || 0) + botReactionDelayForPlayer(entry.player)
    );
  candidates.sort((left, right) => botReactionChance(right.player) - botReactionChance(left.player) || left.index - right.index);
  for (const candidate of candidates) {
    if (random() < botReactionChance(candidate.player)) return playJumpIn(game, rules, candidate.index, null, { now });
  }
  return game;
}

export function playCard(game, rules, playerIndex, cardId, selectedCardIds = null, timing = {}) {
  const next = cloneGame(game);
  const player = next.players[playerIndex];
  if (!player || player.out || next.status !== "playing" || next.currentPlayer !== playerIndex) return next;
  const now = Number(timing.now ?? Date.now());
  next.jumpInWindow = null;
  next.quickMatchRank = null;
  const source = currentSource(player);

  if (!cardId) {
    if (getPlayableCards(next, rules, playerIndex).length > 0) {
      next.message = player.name + " can play and cannot pick up yet.";
      return next;
    }
    if (source === "faceUp" && player.faceUp.length && next.pile.length) {
      const palaceCard = choosePickupPalaceCard(player.faceUp);
      const pickupCount = next.pile.length + 1;
      player.faceUp = player.faceUp.filter((card) => card.id !== palaceCard.id);
      player.hand = sortHand(player.hand.concat([palaceCard], next.pile), rules);
      next.pile = [];
      next.lastPlay = null;
      next.quickMatchRank = null;
      next.currentPlayer = nextActivePlayer(next, playerIndex);
      next.message = "PICKUP: " + player.name + " picked up " + pickupCount + " cards: " + describeCard(palaceCard) + " from the palace plus the pile.";
      palaceAction(next, "pickup", playerIndex, { source: "faceUp", pickupCount, cardIds: [palaceCard.id] });
      return next;
    }
    const pickupCount = next.pile.length;
    player.hand = sortHand(player.hand.concat(next.pile), rules);
    next.pile = [];
    next.lastPlay = null;
    next.quickMatchRank = null;
    next.currentPlayer = nextActivePlayer(next, playerIndex);
    next.message = "PICKUP: " + player.name + " picked up " + pickupCount + " cards from the pile.";
    palaceAction(next, "pickup", playerIndex, { source: "hand", pickupCount, cardIds: [] });
    return next;
  }

  const cardIndex = player[source].findIndex((card) => card.id === cardId);
  if (cardIndex === -1) return next;

  const card = player[source][cardIndex];
  if (!isLegalCard(card, next.pile, rules)) {
    const pickupCount = next.pile.length + 1;
    player[source].splice(cardIndex, 1);
    player.hand = sortHand(player.hand.concat([card], next.pile), rules);
    next.pile = [];
    next.lastPlay = null;
    next.quickMatchRank = null;
    next.currentPlayer = nextActivePlayer(next, playerIndex);
    next.message = source === "faceDown"
      ? "PICKUP: " + player.name + " flipped " + describeCard(card) + " blind and picked up " + pickupCount + " cards."
      : "PICKUP: " + player.name + " picked up " + pickupCount + " cards: " + describeCard(card) + " from the palace plus the pile.";
    palaceAction(next, "pickup", playerIndex, { source, pickupCount, cardIds: [card.id], illegalBlind: source === "faceDown" });
    return next;
  }

  const playedCards = removePlayableSet(player, source, cardIndex, rules, selectedCardIds);
  next.pile.push(...playedCards);
  next.lastPlay = { playerIndex, cards: playedCards };
  next.quickMatchRank = null;
  const playedRank = effectiveRank(card, rules);
  const drawnCards = drawBackUp(player, next.deck, rules.handSize, rules);
  const clearReason = pileClearReason(next.pile, rules, playedCards[playedCards.length - 1]);
  const burned = Boolean(clearReason);
  if (burned) next.pile = [];
  const drawnMatchingCards = player.hand.filter((drawn) => effectiveRank(drawn, rules) === playedRank);
  const drawMatchEligible = rules.quickDrawMatch
    && source === "hand"
    && !burned
    && drawnCards.some((drawn) => effectiveRank(drawn, rules) === playedRank)
    && drawnMatchingCards.length >= PALACE_JUMP_IN_POLICY.minimumCards;
  if (hasPlayerGoneOut(player)) {
    const resolved = resolvePlayerOut(next, playerIndex, player.name + " is safe and out.", rules);
    palaceAction(resolved, "placement", playerIndex, {
      source,
      cardIds: playedCards.map((item) => item.id),
      groupedCount: playedCards.length,
      burned,
      clearReason,
      placement: resolved.safeOrder.indexOf(playerIndex) + 1
    });
    if (resolved.status === "playing" && !burned) {
      resolved.jumpInWindow = createJumpInWindow(resolved, rules, playedRank, playerIndex, resolved.currentPlayer, now);
    }
    return resolved;
  }

  next.currentPlayer = burned ? playerIndex : nextActivePlayer(next, playerIndex);
  next.jumpInWindow = !burned
    ? createJumpInWindow(next, rules, playedRank, playerIndex, next.currentPlayer, now, { includePlayedBy: drawMatchEligible })
    : null;
  const playedLabel = formatPlayedLabel(playedCards);
  next.message = burned
    ? "PILE CLEARED: " + player.name + " played " + playedLabel + " and burned the pile."
    : drawMatchEligible
      ? player.name + " played " + playedLabel + ", drew matching " + playedRank + "s, and may jump in with the pair."
    : rules.twosReset && playedRank === "2"
      ? player.name + " reset with " + playedLabel + ". Next player can play anything."
    : player.name + " played " + playedLabel + ".";
  palaceAction(next, burned ? "clear" : rules.twosReset && playedRank === "2" ? "reset" : "play", playerIndex, {
    source,
    cardIds: playedCards.map((item) => item.id),
    groupedCount: playedCards.length,
    burned,
    clearReason,
    rank: playedRank
  });
  return next;
}

export function botTakeTurns(game, rules) {
  let next = game;
  let safety = 0;
  while (next.status === "playing" && next.currentPlayer > 0 && safety < PALACE_BOT_SAFETY_TURN_LIMIT) {
    const before = gameProgressKey(next);
    const moved = botTakeTurn(next, rules);
    if (gameProgressKey(moved) === before) break;
    next = moved;
    safety += 1;
  }
  return next;
}

export function botTakeTurn(game, rules) {
  if (game.status !== "playing" || game.currentPlayer <= 0) return game;
  const botIndex = game.currentPlayer;
  const legal = getPlayableCards(game, rules, botIndex).sort((left, right) => compareCards(left, right, rules));
  const signature = botStrategicStateSignature(game, rules, botIndex);
  if (!legal.length) {
    let pickup = playCard(game, rules, botIndex, null);
    pickup.botTurnCount = Number(game.botTurnCount || 0) + 1;
    pickup.botStrategyMemory = (game.botStrategyMemory || []).concat({
      signature,
      actionKey: "pickup",
      strategyAdjusted: false
    }).slice(-48);
    if (rules.botLoopProtection && pickup.status === "playing" && pickup.botTurnCount >= PALACE_BOT_SAFETY_TURN_LIMIT) {
      pickup = finishAtBotSafetyCeiling(pickup);
    }
    return pickup;
  }
  const recentMemory = (game.botStrategyMemory || []).filter((entry) => entry.signature === signature);
  let move = chooseBotMove(legal, game.pile, rules, game);
  let strategyAdjusted = recentMemory.some((entry) => entry.actionKey === botMoveKey(move));
  if (strategyAdjusted) {
    move = alternateBotMove(move, legal, game, rules, botIndex);
    strategyAdjusted = botMoveKey(move) !== recentMemory.at(-1)?.actionKey;
  }
  let next = playCard(game, rules, botIndex, move.card.id, move.selectedCardIds);
  next.botTurnCount = Number(game.botTurnCount || 0) + 1;
  next.botStrategyMemory = (game.botStrategyMemory || []).concat({
    signature,
    actionKey: botMoveKey(move),
    strategyAdjusted
  }).slice(-48);
  if (strategyAdjusted && next.lastEvent) {
    next.lastEvent = { ...next.lastEvent, strategyAdjusted: true };
  }
  if (rules.botLoopProtection && next.status === "playing" && next.botTurnCount >= PALACE_BOT_SAFETY_TURN_LIMIT) {
    next = finishAtBotSafetyCeiling(next);
  }
  return next;
}

function botMoveKey(move) {
  return [move?.card?.id || "pickup", ...(move?.selectedCardIds || [])].join("|");
}

function botStrategicStateSignature(game, rules, botIndex) {
  const playerKey = (game.players || []).map((player) =>
    ["hand", "faceUp", "faceDown"].map((zone) =>
      (player[zone] || []).map((card) => effectiveRank(card, rules)).sort().join(".")
    ).join("/")
  ).join("|");
  return [
    botIndex,
    activePileCard(game.pile || [], rules)?.rank || "open",
    (game.pile || []).length,
    (game.deck || []).length,
    game.lastEvent?.type || "none",
    playerKey
  ].join(":");
}

function alternateBotMove(preferred, legal, game, rules, botIndex) {
  const bot = game.players[botIndex];
  const source = currentSource(bot);
  const differentCard = legal.find((card) => card.id !== preferred.card.id && effectiveRank(card, rules) !== effectiveRank(preferred.card, rules))
    || legal.find((card) => card.id !== preferred.card.id);
  if (differentCard) {
    return {
      card: differentCard,
      selectedCardIds: botSelectedIds(bot, source, differentCard, rules, game, false)
    };
  }
  const sameRank = bot[source].filter((card) => effectiveRank(card, rules) === effectiveRank(preferred.card, rules));
  if (sameRank.length > 1) {
    const preferredCount = preferred.selectedCardIds?.length || sameRank.length;
    return {
      card: preferred.card,
      selectedCardIds: preferredCount > 1 ? [preferred.card.id] : sameRank.map((card) => card.id)
    };
  }
  return preferred;
}

export function describeCard(card) {
  if (!card) return "";
  if (card.rank === "Joker") return "Joker";
  const ranks = { A: "Ace", K: "King", Q: "Queen", J: "Jack" };
  const suits = { clubs: "Clubs", diamonds: "Diamonds", hearts: "Hearts", spades: "Spades" };
  return (ranks[card.rank] || card.rank) + " of " + suits[card.suit];
}

function chooseBotMove(cards, pile, rules, game) {
  const sorted = [...cards].sort((left, right) => compareCards(left, right, rules));
  const burnCard = sorted.find((card) => rules.tensBurn && effectiveRank(card, rules) === "10" && pile.length >= 4);
  if (burnCard) return { card: burnCard };

  const botIndex = game ? game.currentPlayer : -1;
  const bot = botIndex >= 0 && game.players[botIndex] ? game.players[botIndex] : null;
  const nextIndex = game ? nextActivePlayer(game, botIndex) : 0;
  const nextPlayer = game && nextIndex >= 0 ? game.players[nextIndex] : null;
  const humanIsClose = game && game.players[0] && totalCardCount(game.players[0]) <= 3;
  const nextPlayerIsClose = nextPlayer && totalCardCount(nextPlayer) <= 3;
  const botIsClose = bot && totalCardCount(bot) <= 3;
  const source = bot ? currentSource(bot) : "hand";

  if (rules.sevensLow && pile.length && (humanIsClose || nextPlayerIsClose)) {
    const pressureSeven = sorted.find((card) => effectiveRank(card, rules) === "7");
    if (pressureSeven) return { card: pressureSeven };
  }

  if (humanIsClose || nextPlayerIsClose) {
    const highNonMagic = [...sorted].reverse().find((card) => !isMagicCard(card, rules));
    const pressureCard = highNonMagic || sorted[sorted.length - 1];
    return { card: pressureCard, selectedCardIds: botSelectedIds(bot, source, pressureCard, rules, game, true) };
  }

  if (botIsClose) {
    const safestOutCard = sorted.find((card) => !isMagicCard(card, rules)) || sorted[0];
    return { card: safestOutCard, selectedCardIds: botSelectedIds(bot, source, safestOutCard, rules, game, false) };
  }

  const lowNonMagic = sorted.find((card) => !isMagicCard(card, rules));
  const card = lowNonMagic || sorted[0];
  return { card, selectedCardIds: botSelectedIds(bot, source, card, rules, game, false) };
}

function botSelectedIds(bot, source, card, rules, game, pressurePlay) {
  if (!bot || !rules.multiPlaySameRank || source === "faceDown" || isMagicCard(card, rules)) return null;
  const rank = effectiveRank(card, rules);
  const sameRank = bot[source].filter((item) => effectiveRank(item, rules) === rank);
  if (sameRank.length <= 1) return null;

  if (isOptionalMultiPlayRank(game, rank, rules) && !pressurePlay) return [card.id];

  return sameRank.map((item) => item.id);
}

export function isOptionalMultiPlayRank(game, rank, rules = CLASSIC_RULES) {
  if (!rank || isMagicRank(rank, rules)) return false;
  const highCardLadder = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3"];
  const rankIndex = highCardLadder.indexOf(rank);
  if (rankIndex === -1) return false;
  if (rankIndex === 0) return true;
  return highCardLadder.slice(0, rankIndex).every((higherRank) => rankIsFullySpent(game, higherRank, rules));
}

function rankIsFullySpent(game, rank, rules) {
  if (!game || game.deck.length) return false;
  if (game.pile.some((card) => effectiveRank(card, rules) === rank)) return false;
  return !game.players.some((player) =>
    ["hand", "faceUp", "faceDown"].some((zone) =>
      player[zone].some((card) => effectiveRank(card, rules) === rank)
    )
  );
}

function totalCardCount(player) {
  return player.hand.length + player.faceUp.length + player.faceDown.length;
}

function resolvePlayerOut(game, playerIndex, continuingMessage, rules = CLASSIC_RULES) {
  const next = game;
  const player = next.players[playerIndex];
  if (!player) return next;
  player.out = true;
  next.safeOrder = next.safeOrder || [];
  if (!next.safeOrder.includes(playerIndex)) next.safeOrder.push(playerIndex);

  const remainingBots = next.players
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => !entry.out);
  if (playerIndex === 0 && rules.humanFirstOutEndsBots && remainingBots.every(({ entry }) => entry.bot)) {
    const botOrder = remainingBots.sort((left, right) =>
      totalCardCount(left.entry) - totalCardCount(right.entry)
      || botCardBurden(left.entry, rules) - botCardBurden(right.entry, rules)
      || left.index - right.index
    );
    botOrder.forEach(({ entry, index }) => {
      entry.out = true;
      if (!next.safeOrder.includes(index)) next.safeOrder.push(index);
    });
    next.status = "finished";
    next.currentPlayer = -1;
    next.winnerIndex = 0;
    next.loserIndex = next.safeOrder[next.safeOrder.length - 1] ?? 0;
    next.message = player.name + " wins the match. Remaining bot places were resolved instantly.";
    return next;
  }

  const remaining = remainingPlayers(next);
  if (remaining.length <= 1) {
    const winnerIndex = next.safeOrder.length ? next.safeOrder[0] : playerIndex;
    const loserIndex = remaining[0] ? remaining[0].index : playerIndex;
    const winner = next.players[winnerIndex] || player;
    const loser = next.players[loserIndex] || player;
    next.status = "finished";
    next.currentPlayer = -1;
    next.winnerIndex = winnerIndex;
    next.loserIndex = loserIndex;
    next.message = winner.name + " wins the match. " + loser.name + " is left holding cards.";
    return next;
  }

  next.currentPlayer = nextActivePlayer(next, playerIndex);
  next.message = continuingMessage || player.name + " is safe and out.";
  return next;
}

function botCardBurden(player, rules) {
  return ["hand", "faceUp", "faceDown"].reduce((sum, zone) =>
    sum + (player[zone] || []).reduce((zoneSum, card) => zoneSum + Math.max(0, cardPower(card, rules)), 0)
  , 0);
}

function finishAtBotSafetyCeiling(game) {
  const next = cloneGame(game);
  const existing = new Set(next.safeOrder || []);
  const unresolved = next.players
    .map((player, index) => ({ player, index }))
    .filter(({ index }) => !existing.has(index))
    .sort((left, right) => totalCardCount(left.player) - totalCardCount(right.player) || left.index - right.index);
  unresolved.forEach(({ player, index }) => {
    player.out = true;
    next.safeOrder.push(index);
  });
  next.status = "finished";
  next.currentPlayer = -1;
  next.winnerIndex = next.safeOrder[0] ?? 0;
  next.loserIndex = next.safeOrder[next.safeOrder.length - 1] ?? next.winnerIndex;
  next.jumpInWindow = null;
  next.message = "The table reached its no-progress safety limit. Placements were resolved by remaining card count.";
  palaceAction(next, "botRecovery", next.winnerIndex, { safetyCeiling: true });
  return next;
}

function choosePickupPalaceCard(cards) {
  return [...cards].sort(compareCards)[0];
}

export function getPalacePlacementOrder(game) {
  const seats = new Set();
  const order = [];
  const add = (seat) => {
    if (Number.isInteger(seat) && seat >= 0 && seat < (game.players || []).length && !seats.has(seat)) {
      seats.add(seat);
      order.push(seat);
    }
  };
  (game.safeOrder || []).forEach(add);
  add(game.winnerIndex);
  (game.players || []).forEach((player, index) => {
    if (player.out) add(index);
  });
  add(game.loserIndex);
  (game.players || []).forEach((_, index) => add(index));
  return order;
}

export function getPalaceWinnerIndex(game) {
  return getPalacePlacementOrder(game)[0] ?? null;
}

function createJumpInWindow(game, rules, rank, playedBy, turnPlayerIndex, now = Date.now(), options = {}) {
  if (!rules.jumpInFourOfKind || !rank || game.status !== "playing") return null;
  const eligiblePlayerIndices = game.players.flatMap((player, index) => {
    if (index === turnPlayerIndex || player.out || (index === playedBy && !options.includePlayedBy)) return [];
    const source = currentSource(player);
    const matchingCount = source === "faceDown"
      ? 0
      : player[source].filter((card) => effectiveRank(card, rules) === rank).length;
    return matchingCount >= PALACE_JUMP_IN_POLICY.minimumCards ? [index] : [];
  });
  if (!eligiblePlayerIndices.length) return null;
  return {
    rank,
    playedBy,
    turnPlayerIndex,
    eligiblePlayerIndices,
    openedAt: now,
    deadlineAt: now + PALACE_JUMP_IN_POLICY.windowMs,
    expectedRevision: Number(game.revision || 0) + 1
  };
}

function botReactionChance(player) {
  if (player.personality === "sharp") return 0.72;
  if (player.personality === "chaos") return 0.56;
  return 0.42;
}

function botReactionDelayForPlayer(player) {
  const factors = { quick: 0.84, average: 1, deliberate: 1.16 };
  const factor = player?.tempoProfile === "variable"
    ? 0.9 + (String(player.id || player.name).length % 5) * 0.05
    : factors[player?.tempoProfile] || 1;
  return Math.round(PALACE_JUMP_IN_POLICY.botReactionDelayMs * factor);
}

function formatPlayedLabel(cards) {
  if (!cards.length) return "";
  if (cards.length === 1) return describeCard(cards[0]);
  return cards.length + " " + cards[0].rank + "s";
}

function removePlayableSet(player, source, cardIndex, rules, selectedCardIds = null) {
  const card = player[source][cardIndex];
  if (!rules.multiPlaySameRank || source === "faceDown" || card.blind) {
    return player[source].splice(cardIndex, 1);
  }

  if (selectedCardIds && selectedCardIds.length) {
    const rank = effectiveRank(card, rules);
    const selected = [];
    for (let index = player[source].length - 1; index >= 0; index -= 1) {
      const item = player[source][index];
      if (selectedCardIds.includes(item.id) && effectiveRank(item, rules) === rank) {
        selected.unshift(player[source].splice(index, 1)[0]);
      }
    }
    if (source === "hand" && player.hand.length === 0 && player.faceUp.length > 0) {
      for (let index = player.faceUp.length - 1; index >= 0; index -= 1) {
        const item = player.faceUp[index];
        if (selectedCardIds.includes(item.id) && effectiveRank(item, rules) === rank) {
          selected.push(player.faceUp.splice(index, 1)[0]);
        }
      }
    }
    return selected.length ? selected : [player[source].splice(cardIndex, 1)[0]];
  }

  if (isMagicCard(card, rules)) {
    return player[source].splice(cardIndex, 1);
  }

  const played = [];
  for (let index = player[source].length - 1; index >= 0; index -= 1) {
    if (effectiveRank(player[source][index], rules) === effectiveRank(card, rules)) {
      played.unshift(player[source].splice(index, 1)[0]);
    }
  }
  if (source === "hand" && player.hand.length === 0 && player.faceUp.length > 0) {
    for (let index = player.faceUp.length - 1; index >= 0; index -= 1) {
      if (effectiveRank(player.faceUp[index], rules) === effectiveRank(card, rules)) {
        played.push(player.faceUp.splice(index, 1)[0]);
      }
    }
  }
  return played;
}

export function isMagicCard(card, rules) {
  const rank = effectiveRank(card, rules);
  return isMagicRank(rank, rules);
}

function isMagicRank(rank, rules) {
  return rank === "Joker"
    || (rules.twosReset && rank === "2")
    || (rules.sevensLow && rank === "7")
    || (rules.eightsInvisible && rank === "8")
    || (rules.tensBurn && rank === "10");
}

function dealPlayers(profiles, deck, rules) {
  const players = profiles.map((profile, index) => ({
    id: profile.id || (index === 0 ? "human" : String(profile.name || "bot").toLowerCase()),
    botId: index === 0 ? null : (profile.id || String(profile.name || "bot").toLowerCase()),
    name: profile.name,
    avatar: profile.avatar,
    gender: profile.gender,
    personality: profile.personality,
    tempoProfile: index === 0 ? "human" : botTempoProfileForName(profile.id || profile.name),
    bot: index !== 0,
    out: false,
    hand: [],
    faceUp: [],
    faceDown: []
  }));

  dealRound(players, deck, "faceDown", rules.faceDownCount);
  dealRound(players, deck, "faceUp", rules.faceUpCount);
  dealRound(players, deck, "hand", rules.handSize);

  players.forEach((player) => {
    if (player.bot) optimizeBotSetup(player, rules);
    player.hand = sortHand(player.hand, rules);
    player.faceUp = sortHand(player.faceUp, rules);
  });

  return players;
}

function dealRound(players, deck, zone, count) {
  for (let card = 0; card < count; card += 1) {
    players.forEach((player) => {
      player[zone].push(deck.shift());
    });
  }
}

function optimizeBotSetup(player, rules) {
  const setupCards = player.hand.concat(player.faceUp);
  const sorted = [...setupCards].sort((left, right) => cardPower(right, rules) - cardPower(left, rules));
  const faceUp = sorted.slice(0, rules.faceUpCount);
  const faceUpIds = faceUp.map((card) => card.id);
  player.faceUp = faceUp;
  player.hand = setupCards.filter((card) => !faceUpIds.includes(card.id));
}

function currentSource(player) {
  if (player.hand.length) return "hand";
  if (player.faceUp.length) return "faceUp";
  return "faceDown";
}

function createDeck(rules) {
  const cards = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: rank + "-" + suit, rank, suit });
    }
  }
  if (rules.jokers) {
    cards.push({ id: "joker-red", rank: "Joker", suit: "red" });
    cards.push({ id: "joker-black", rank: "Joker", suit: "black" });
  }
  return cards;
}

function isLegalCard(card, pile, rules) {
  if (!pile.length) return true;
  const rank = effectiveRank(card, rules);
  if (rules.twosReset && rank === "2") return true;
  if (rules.eightsInvisible && rank === "8") return true;
  if (rules.tensBurn && rank === "10") return true;

  const top = activePileCard(pile, rules);
  if (!top) return true;
  if (rules.sevensLow && effectiveRank(top, rules) === "7") return cardPower(card, rules) <= cardPower(top, rules);
  return cardPower(card, rules) >= cardPower(top, rules);
}

function activePileCard(pile, rules) {
  for (let index = pile.length - 1; index >= 0; index -= 1) {
    const card = pile[index];
    const rank = effectiveRank(card, rules);
    if (rules.twosReset && rank === "2") return null;
    if (rules.tensBurn && rank === "10") return null;
    if (rules.eightsInvisible && rank === "8") continue;
    return card;
  }
  return null;
}

function pileClearReason(pile, rules, card) {
  if (rules.tensBurn && effectiveRank(card, rules) === "10") return "ten";
  if (!rules.fourOfKindBurns || pile.length < 4) return null;
  const lastFour = pile.slice(-4);
  return lastFour.every((item) => effectiveRank(item, rules) === effectiveRank(lastFour[0], rules)) ? "fourKind" : null;
}

function drawBackUp(player, deck, handSize, rules) {
  const drawn = [];
  while (player.hand.length < handSize && deck.length) {
    const card = deck.pop();
    drawn.push(card);
    player.hand.push(card);
  }
  player.hand = sortHand(player.hand, rules);
  return drawn;
}

function hasPlayerGoneOut(player) {
  return player.hand.length === 0 && player.faceUp.length === 0 && player.faceDown.length === 0;
}

function activePlayers(game) {
  return game.players.filter((player) => !player.out);
}

function remainingPlayers(game) {
  return game.players
    .map((player, index) => ({ player, index }))
    .filter((entry) => !entry.player.out);
}

function findStartingPlayer(game, rules = CLASSIC_RULES) {
  const candidates = [];
  game.players.forEach((player, index) => {
    player.hand.forEach((card) => {
      if (effectiveRank(card, rules) !== "2" && card.rank !== "Joker") {
        candidates.push({ index, player, card, power: cardPower(card, rules) });
      }
    });
  });

  const preferred = candidates.filter(({ card }) => card.rank !== "7" && !isMagicCard(card, rules));
  const eligible = preferred.length ? preferred : candidates;
  eligible.sort((left, right) => left.power - right.power || left.index - right.index || left.card.id.localeCompare(right.card.id));
  return eligible[0] || { index: 0, player: game.players[0], card: game.players[0].hand[0] };
}

function nextActivePlayer(game, current) {
  for (let step = 1; step <= game.players.length; step += 1) {
    const index = (current + step) % game.players.length;
    if (!game.players[index].out) return index;
  }
  return current;
}

function draw(deck, count) {
  return deck.splice(0, count);
}

function shuffle(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function effectiveRank(card, rules = CLASSIC_RULES) {
  return card.rank === "Joker" ? rules.jokerMode || "2" : card.rank;
}

function cardPower(card, rules = CLASSIC_RULES) {
  return RANKS.indexOf(effectiveRank(card, rules));
}

function compareCards(left, right, rules = CLASSIC_RULES) {
  return cardPower(left, rules) - cardPower(right, rules);
}

function sortHand(cards, rules = CLASSIC_RULES) {
  return [...cards].sort((left, right) => sortPower(left, rules) - sortPower(right, rules));
}

function sortPower(card, rules) {
  const magicOrder = [];
  if (rules.sevensLow) magicOrder.push("7");
  if (rules.eightsInvisible) magicOrder.push("8");
  if (rules.tensBurn) magicOrder.push("10");
  if (rules.twosReset) magicOrder.push("2");
  magicOrder.push("Joker");
  const rank = effectiveRank(card, rules);
  const magicIndex = magicOrder.indexOf(rank);
  if (magicIndex !== -1) return 100 + magicIndex;
  return cardPower(card, rules);
}

function clampPlayerCount(playerCount) {
  return Math.max(2, Math.min(4, Number(playerCount) || 2));
}

function cloneGame(game) {
  return {
    ...game,
    deck: [...(game.deck || [])],
    pile: [...(game.pile || [])],
    safeOrder: [...(game.safeOrder || [])],
    quickMatchRank: game.quickMatchRank || null,
    jumpInWindow: game.jumpInWindow ? { ...game.jumpInWindow, eligiblePlayerIndices: [...(game.jumpInWindow.eligiblePlayerIndices || [])] } : null,
    botStrategyMemory: (game.botStrategyMemory || []).map((entry) => ({ ...entry })),
    botTurnCount: Number(game.botTurnCount || 0),
    lastEvent: game.lastEvent ? { ...game.lastEvent, cardIds: [...(game.lastEvent.cardIds || [])] } : null,
    setupReady: [...(game.setupReady || [])],
    message: typeof game.message === "string" ? game.message.replace(/\bOmar\b/g, "Oner") : game.message,
    log: (game.log || []).map((line) => typeof line === "string" ? line.replace(/\bOmar\b/g, "Oner") : line),
    players: (game.players || []).map(migrateLegacyBotIdentity).map((player) => ({
      ...player,
      hand: [...(player.hand || [])],
      faceUp: [...(player.faceUp || [])],
      faceDown: [...(player.faceDown || [])]
    }))
  };
}
