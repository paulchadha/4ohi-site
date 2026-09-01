# Website Gameplay Architecture

Website game experiences are local and privacy-preserving. They use semantic buttons, live status, keyboard activation, touch targets, and reduced-motion fallbacks. They make no post-load game request. Palace stores one versioned game and sound/motion preferences in the browser; the three secondary card lessons remain page-memory only.

## Shared table family

Blue felt, gold/wood framing, garden/sky atmosphere, four named seats, physical cards, card backs, compact HUDs, immediate selection feedback, play-to-center motion, and responsive hand reflow.

## Palace mapping

The complete Palace browser edition imports the byte-identical PalaceApp engine and rules. Setup includes three face-down cards, three face-up cards, a hand, one to three bots, pile, and draw deck. It runs legal play, jump-ins, burn, pickup, all app-defined powers, draw exhaustion, hand, face-up, and face-down phases until the engine declares a winner. Completion is persisted and exposes no second public game. See `docs/PALACE_WEB_SOURCE.md`.

## Secondary games

- Hearts: four seats, current trick, Hearts broken, Queen of Spades, points, safe follow/duck decisions.
- Spades: partnerships, current trick, bid/contract, books, bags, Nil context, trump decisions.
- Euchre: partnerships, dealer, upcard, trump, maker, bowers, Order Up/play decisions.

These moments intentionally stop short of full native-app rules engines or production multiplayer.
## 2026-08-01 portfolio interaction layer

Homepage discovery is implemented in scripts/homepage-playable-studio.mjs, assets/playable-studio.css, and assets/playable-studio.js. The interactive Palace tutorial remains isolated to Palace routes. Portfolio cards link to real play routes only where the manifest declares one; in-development worlds link to their overview pages. Mobile portfolio controls enhance native horizontal scrolling and scroll snap.
