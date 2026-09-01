export const PALACE_TRAY_MOTION = Object.freeze({
  enterMs: 360,
  moveMs: 380,
  exitMs: 240,
  pickupExitMs: 300
});

export function migrateLegacyBotIdentity(player) {
  if (!player) return player;
  if (player.id === "omar" || player.botId === "omar" || player.name === "Omar") {
    return { ...player, id: "omar", botId: "omar", name: "Oner" };
  }
  return player;
}

export function migrateLegacyPalaceGame(game) {
  if (!game || !Array.isArray(game.players)) return game;
  let changed = false;
  const players = game.players.map((player) => {
    const migrated = migrateLegacyBotIdentity(player);
    if (migrated !== player) changed = true;
    return migrated;
  });
  const migrateText = (line) => typeof line === "string" ? line.replace(/\bOmar\b/g, "Oner") : line;
  const message = migrateText(game.message);
  const log = (game.log || []).map(migrateText);
  if (message !== game.message || log.some((line, index) => line !== (game.log || [])[index])) changed = true;
  return changed ? { ...game, players, message, log } : game;
}

export function deriveTableCardTrayState(player, game = {}) {
  const faceUpCount = Math.max(0, player?.faceUp?.length || 0);
  const faceDownCount = Math.max(0, player?.faceDown?.length || 0);
  const handCount = Math.max(0, player?.hand?.length || 0);
  const tableCardCount = faceUpCount + faceDownCount;
  const authoritativeVisible = game.status === "playing" && !player?.out && tableCardCount > 0;
  const active = authoritativeVisible && handCount === 0;
  const interactive = active && game.currentPlayer === 0 && !game.resolvingTableCard;
  const pickupToHand = game.lastEvent?.type === "pickup" && game.lastEvent?.actorIndex === 0 && game.lastEvent?.source !== "hand";
  const exhausted = !tableCardCount && game.status === "playing" && !player?.out;
  return {
    authoritativeVisible,
    active,
    interactive,
    exhausted,
    tableCardCount,
    handCount,
    faceUpCount,
    faceDownCount,
    pickupToHand,
    state: game.resolvingTableCard ? "resolvingCard" : exhausted ? "exhausted" : active ? "active" : authoritativeVisible ? "resting" : "removed",
    phase: faceUpCount > 0 ? "faceUp" : faceDownCount > 0 ? "faceDown" : "empty"
  };
}

export function computeTableCardTrayLayout({ tableWidth, tableHeight, handClearance = 12, trayWidth = 216, trayHeight = 112, safeLeft = 8, safeRight = 8 }) {
  const width = Math.max(320, Number(tableWidth) || 320);
  const height = Math.max(280, Number(tableHeight) || 280);
  const pileCenterX = width / 2;
  const activeLeft = Math.max(safeLeft, Math.min((width - trayWidth) / 2, width - safeRight - trayWidth));
  const restingPreferred = pileCenterX + Math.max(74, width * 0.09);
  const restingLeft = Math.max(safeLeft, Math.min(restingPreferred, width - safeRight - trayWidth));
  const bottom = Math.max(10, Number(handClearance) || 12);
  const activeTop = Math.max(118, Math.min(height * 0.57, height - bottom - trayHeight));
  const restingTop = Math.max(activeTop, height - bottom - trayHeight);
  return {
    left: Math.round(activeLeft),
    top: Math.round(activeTop),
    restingOffsetX: Math.round(restingLeft - activeLeft),
    restingOffsetY: Math.round(restingTop - activeTop),
    restingLeft: Math.round(restingLeft),
    restingTop: Math.round(restingTop),
    width: trayWidth,
    height: trayHeight,
    pickupTranslateX: Math.round(-(activeLeft + trayWidth / 2 - pileCenterX)),
    pickupTranslateY: Math.round(Math.min(96, handClearance + 44))
  };
}
