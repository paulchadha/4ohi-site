export const PALACE_BOT_PACING = Object.freeze({
  thinkingDelayMs: 330,
  humanOutThinkingDelayMs: 60,
  cardMovementMs: 230,
  humanOutCardMovementMs: 120,
  reducedMotionCardMovementMs: 90,
  postPlayObservationMs: 130,
  humanOutObservationMs: 40,
  reducedMotionObservationMs: 70,
  nextPlayerTransitionMs: 70,
  humanOutTransitionMs: 30,
  pickupObservationMs: 920,
  humanOutPickupObservationMs: 310,
  clearObservationMs: 260,
  jumpInReactionMs: 190
});

export const PALACE_BOT_TEMPO_PROFILES = Object.freeze({
  quick: 0.84,
  average: 1,
  deliberate: 1.16,
  variable: 1
});

function stableTempoJitter(bot) {
  const identity = String(bot?.botId || bot?.id || bot?.name || "bot");
  const hash = identity.split("").reduce((sum, character) => (sum * 31 + character.charCodeAt(0)) % 997, 17);
  return 0.9 + (hash % 21) / 100;
}

export function palaceBotTempoFactor(bot) {
  const profile = bot?.tempoProfile || "average";
  const factor = profile === "variable" ? stableTempoJitter(bot) : PALACE_BOT_TEMPO_PROFILES[profile] || 1;
  return Math.max(0.8, Math.min(1.2, factor));
}

export function palaceBotReactionDelayMs(bot) {
  return Math.round(PALACE_BOT_PACING.jumpInReactionMs * palaceBotTempoFactor(bot));
}

export function palaceBotActionDelay({ bot = null, reducedMotion = false, humanOut = false, previousAction = "play", testMode = false, matchFinished = false } = {}) {
  if (testMode || matchFinished) return 0;
  const tempo = palaceBotTempoFactor(bot);
  const thinking = humanOut ? PALACE_BOT_PACING.humanOutThinkingDelayMs : PALACE_BOT_PACING.thinkingDelayMs;
  const observation = previousAction === "pickup"
    ? (humanOut ? PALACE_BOT_PACING.humanOutPickupObservationMs : PALACE_BOT_PACING.pickupObservationMs)
    : previousAction === "clear"
      ? PALACE_BOT_PACING.clearObservationMs
      : humanOut
        ? PALACE_BOT_PACING.humanOutObservationMs
        : reducedMotion
          ? PALACE_BOT_PACING.reducedMotionObservationMs
          : PALACE_BOT_PACING.postPlayObservationMs;
  const transition = humanOut ? PALACE_BOT_PACING.humanOutTransitionMs : PALACE_BOT_PACING.nextPlayerTransitionMs;
  return Math.round((thinking + observation) * tempo + transition);
}

export function palaceCardMovementDuration({ reducedMotion = false, humanOut = false } = {}) {
  if (reducedMotion) return PALACE_BOT_PACING.reducedMotionCardMovementMs;
  return humanOut ? PALACE_BOT_PACING.humanOutCardMovementMs : PALACE_BOT_PACING.cardMovementMs;
}
