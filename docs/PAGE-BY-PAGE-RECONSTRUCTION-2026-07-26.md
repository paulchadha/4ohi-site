# Page-by-Page Founder Reconstruction — July 26, 2026

## Initial state

The repository began clean and synchronized on `main` at `8cb22922e8755f321f608c58a9cef70dedab0d7f`. GitHub Pages was serving that exact SHA. No other process or scheduled task was found writing to `4ohi-site`.

## Screenshot findings

The founder screenshots showed two competing home experiences, clipped and overlapping Power Cards, repeated July 25 News dates, uneven More Games spacing, a generic gray future-games block, large empty About fields, a rejected founder headline and defensive biography copy, and website game moments that did not adequately depict Palace or the three secondary games.

## Decisions

- `/` is the one canonical Palace-led homepage.
- The 4OH logo and Palace navigation link both point to `index.html` and retain name/language URL state.
- `/palace.html` is a noindex compatibility route that uses `location.replace` to preserve query and hash while avoiding a competing history entry.
- The site uses one release-strip countdown and the existing single date configuration.
- Transmission 001 is a small development-log link, not a hero identity.
- Power Cards use a non-overlapping four-card grid on desktop and two-by-two grid on phones. The rule panel is below the cards.
- News dates are July 14, 17, 20, 23, and 26, 2026, newest first.
- More Games uses equal-height product cards and a blue-purple-ruby mystery-card future panel.
- About uses five short brand-colored beats. The founder headline is now “Games have rules. People make them interesting.” Public defensive credential disclaimers were removed; factual approval remains flagged.

## Gameplay reconstruction

Palace now keeps its defining structure visible: hand, three face-up cards, three face-down cards, opponent, center pile, and draw deck. The guided local scenario teaches legal equal-or-higher play, matching, pickup, 2 reset, 7 lower, 8 transparent, 10 burn, hand-to-face-up-to-face-down progression, mystery reveal, completion, replay, rules, and News.

Hearts displays four seats, Hearts-broken state, Queen of Spades status, points, current trick, and a point-avoidance decision. Spades displays partnerships, contract, books, bags, Nil context, current trick, and contract play. Euchre displays partnerships, dealer, upcard, trump, maker, bowers, and Order Up/play context.

These are local website teaching moments, not native applications, multiplayer sessions, accounts, matchmaking, rankings, or production game services. State exists only in page memory.

## QA summary

`docs/visual-evidence/page-reconstruction-local-results.json` records 23 pages, 9 name/language states, 4 completed tutorials, canonical routing, one countdown, non-overlapping Power Cards, ordered unique News dates, five About beats, complete Palace setup, keyboard controls, responsive widths from 320 through 768 pixels plus desktop, and zero cookies/storage/third-party requests.

## Remaining review

Founder physical-device and final wording approval remain required. Palace history, translations, and any commercial/legal reliance remain subject to their existing review controls.