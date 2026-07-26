# Interactive Table and Mobile QA

## Visual system

All four tutorials use the approved app-world vocabulary: blue felt, gold trim, bright sky/garden/castle framing, legible physical cards, named seats, and game-state HUDs. Palace teaches match-or-beat, burn, pickup, all four powers, and three levels. Hearts, Spades, and Euchre expose rules and score/status language specific to each game.

## Required phone matrix

Automated browser QA covers 320×568, 360×800, 390×844, and 430×932 plus RTL at 390×844. The release fails for horizontal overflow, clipped H1s, hidden name/language controls, oversized phone headings, a primary action below the first common phone viewport, or a tutorial that cannot finish.

## Physical phone acceptance

After the exact commit is deployed, open a private/incognito browser and verify:

1. `https://4ohi.com/?game=palace`
2. `https://4ohi.com/?game=shed`
3. Confirm Shithead through the ten-tap Shed action and capture the resulting URL/art.
4. Open Palace Quick Play and complete all five chapters.
5. Open Hearts, Spades, and Euchre Quick Play and complete both decisions.
6. Rotate once, return to portrait, and confirm no clipping or sideways scroll.

Record device, browser, viewport/orientation, build commit, pass/fail, and screenshots. Founder physical-device evidence is mandatory and cannot be inferred from desktop emulation.