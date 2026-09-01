export const PALACE_SPECIAL_RANKS = Object.freeze(["2", "7", "8", "10"]);

export const FOUR_OF_HEARTS_PALACE_RULES = Object.freeze({
  twosReset: true,
  tensBurn: true,
  fourOfKindBurns: true,
  sevensLow: true,
  eightsInvisible: true,
  multiPlaySameRank: true,
  jumpInFourOfKind: true,
  quickDrawMatch: true,
  humanFirstOutEndsBots: true,
  botLoopProtection: true,
  jokers: false,
  jokerMode: "2",
  handSize: 3,
  faceUpCount: 3,
  faceDownCount: 3
});

export const PALACE_POWER_CARDS = Object.freeze([
  Object.freeze({
    rank: "2",
    title: "Reset",
    description: "Play a 2 at any time. It resets the requirement, so the next player may play any card. The pile stays on the table.",
    example: "A 2 on a King keeps every card in the pile but removes the King requirement."
  }),
  Object.freeze({
    rank: "7",
    title: "Seven or Lower",
    description: "After a 7, the next player must play a 7 or lower. Another 7 keeps the restriction going.",
    example: "A 3, 4, 5, 6, or 7 may follow a 7."
  }),
  Object.freeze({
    rank: "8",
    title: "Transparent",
    description: "Play an 8 and look through it. The next player still follows the card underneath it.",
    example: "A 7 under an 8 still means seven or lower. Stacked 8s remain transparent."
  }),
  Object.freeze({
    rank: "10",
    title: "Burn",
    description: "A 10 wipes out the whole pile. Then the player who burned it leads again.",
    example: "Unlike a 2, a 10 removes every card in the pile."
  })
]);
