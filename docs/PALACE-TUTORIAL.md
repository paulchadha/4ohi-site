# Palace tutorial specification

## Public scope

`palace-play.html` is a roughly 60-second teaching preview, not a production match. One persistent table teaches exactly three beginner moves: match the top rank, beat it with a higher rank, or use a clearly marked wild card when ordinary play is blocked. Completion then introduces the full game's hand, face-up, and face-down finish without turning the tutorial into a rulebook.

The tutorial uses a generic branded `WILD` card because the founder explicitly approved teaching the wild-card concept. It still does not publish unapproved numeric special-rank effects. Palace is a folk game with extensive house-rule variation; update the generator, tutorial, history note, acceptance steps, and this document together when the exact Four of Hearts special-card table is final.

## Interaction contract

State exists only in JavaScript memory and resets on reload. Every choice is a native button. Incorrect choices return friendly contextual feedback without penalty. Focus moves into refreshed tutorial content only after a player action, so the first page Tab remains the skip link. The final state reads `You cleared the Palace.` and offers replay and onward navigation.

`assets/more-games-tutorial.js` provides two-decision lessons for Hearts, Spades, and Euchre. Each ends at `Nice play.`. These lessons also avoid accounts, stakes, saved progress, APIs, and production-game claims.

## Acceptance

Run `node scripts/verify-palace-site.mjs` against a local server and the canonical HTTPS origin. The suite completes low-card feedback for all three rounds, match, beat, wild, completion, all three secondary lessons, keyboard entry, 44-pixel targets, text zoom, reduced motion, cookies/storage, responsive layouts, and request integrity.

The active arena uses readable rank/suit cards, a fanned responsive hand, a large center pile, a rival reserve, move meter, contextual rule line, selection lift, play motion, friendly blocked-card feedback, wild-card art, and a final crown state. It is intentionally bounded: rival state is scripted, progress is local, and no production matchmaking or backend is implied.

Visual acceptance includes desktop and phone homepage captures plus the full phone tutorial page. The active interaction is also covered by machine-readable state transitions and the final heading `You cleared the Palace.`.

## Continuous app-parity mini-match (supersedes all scene-based previews)

`assets/palace-tutorial-v3.js` runs five connected scenes: recoverable match-or-beat play; a visible ten burn; an opponent thinking pause and pile pickup; interactive 2/7/8/10 power-card teaching; and hand/face-up/face-down progression. Completion offers replay, full rules, Palace history, and news. Cards are real buttons with opaque faces, stable corners/suits, selection lift, hand reflow, pile depth, keyboard/touch input, live feedback, and reduced-motion alternatives. The tutorial performs no fetch after initial load and uses only page memory.
## Continuous mini-match supersession

The prior five-scene Field Training implementation is retired. `assets/palace-tutorial-v3.js` now presents one continuous mini-match: match/beat, ten burn, opponent pickup, four power cards, three levels, crown completion, and replay. Do not reintroduce a scene rail, training language, small central table, or large unused margins.


## App-world correction

The mini-match now uses blue felt, gold table rails, garden/castle framing, named seats, and a compact game HUD. Its five chapters still teach match/beat, burn, pickup, powers, and three levels. The displayed name and art follow **This Table Calls It**.
