# Palace tutorial specification

## Public scope

`palace-play.html` is a 60 to 120 second teaching preview, not a production match. It teaches the verified core rhythm in six chapters: deal three layers; match or climb; matching rank; blocked play and pickup; special-card awareness; hand to face-up to face-down finish.

The tutorial intentionally does not assign effects to special ranks. Palace is a folk game with extensive house-rule variation, and the exact Four of Hearts special-card table has not received founder approval. Publishing an invented effect would create a false product promise. Once approved, update the generator, tutorial script, history note, acceptance steps, and this document together.

## Interaction contract

State exists only in JavaScript memory and resets on reload. Every choice is a native button. Incorrect choices return friendly contextual feedback without penalty. Focus moves into refreshed tutorial content only after a player action, so the first page Tab remains the skip link. The final state reads `You cleared the Palace.` and offers replay and onward navigation.

`assets/more-games-tutorial.js` provides two-decision lessons for Hearts, Spades, and Euchre. Each ends at `Nice play.`. These lessons also avoid accounts, stakes, saved progress, APIs, and production-game claims.

## Acceptance

Run `node scripts/verify-palace-site.mjs` against a local server and the canonical HTTPS origin. The suite completes the friendly-error path, every Palace chapter, all three secondary lessons, replay-ready final states, keyboard entry, 44-pixel targets, text zoom, reduced motion, cookies/storage, and request integrity.
