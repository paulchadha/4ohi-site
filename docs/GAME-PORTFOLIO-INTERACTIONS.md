# Game Portfolio Interactions

## Homepage hierarchy

1. Compact Four of Hearts studio marquee with four linked artwork layers.
2. Editorial world spread: Palace, Bobby the Breadasaurus, Evil Doom Adventures: Shadow Run, Thumb Command.
3. Compact playable Palace band.
4. Seven-game portfolio reel including Hearts, Spades, and Euchre.
5. Three-item studio news module.
6. Compact studio signoff.

Each artwork tile and editorial region is one semantic anchor. There are no nested anchors or inert overlays. Hover and focus affect art presentation without intercepting pointer events.

## Input behavior

- Keyboard: every game region is tab-focusable and has a high-contrast focus outline.
- Touch: the entire visible game region is the target.
- Mobile reel: horizontal scroll-snap plus previous/next buttons.
- Reduced motion: art transitions are disabled.
- Locale: internal game links preserve the selected query locale.

Canonical titles are sourced from scripts/game-catalog.mjs. Honest status and action availability remain manifest-controlled.
