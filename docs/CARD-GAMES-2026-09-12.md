# Six card-game pages — September 12, 2026

The Games card collection and Palace, Hearts, Spades, Euchre, Solitaire, and War pages now share one presentation, with accurate rules, play formats, social possibilities, progress continuity, and current availability. Hearts, Spades, and Euchre no longer offer substitute website lessons. Palace retains its complete browser game; the other five pages are informational.

## Image evidence

No screenshots were fabricated and no new artwork was generated. `assets/card-apps/provenance.json` records source filenames, SHA-256 hashes, dimensions, and precise capture/artwork descriptions. Images are proportionally resized to WebP, displayed without cropping, and linked at full size.

- Palace: retained September 12 Samsung screenshot, `portfolio-native-table.png`, from the Palace app owner. Only operating-system bars were cropped. Actual local bot table.
- Hearts: a fresh web export of unchanged Hearts mobile-app source at audited commit `55c649f`, explicitly configured for Hearts. Captured after selecting Play with Bots. The retained original is `docs/card-source-captures/hearts-table.png`. An older mislabeled export was rejected because its rendered interface was Euchre. Reproduce with `HEARTS_EXPORT_DIR` and `scripts/capture-hearts.cjs` after exporting the app outside this website repository.
- Spades: audited `spades-phone.png`, browser rendering of the actual app at 844 × 390, local bot bidding.
- Euchre: audited `table-844x390.png`, browser rendering of the actual app, local bot calling.
- Solitaire: `home-garden-v2.png`, artwork referenced by the actual Solitaire home component. Clearly labeled as artwork, not gameplay.
- War: `four-hearts-palace-garden.png`, artwork referenced by the actual War home and table components. Clearly labeled as artwork, not gameplay. The initially considered unused hero asset was rejected.

## Capability evidence and limits

Source READMEs, September 12 app audit reports, and responses from the existing Palace and War task owners informed the text. No phone was operated and no app behavior was changed for this website work.

- Palace: local 1–3 bots; private app online automatic seating/ready/play tested with phone and browser. Device-local People/Bots ratings. Online service state is not durable across a server restart. Browser edition remains local bots with one browser-local saved game.
- Hearts, Spades, Euchre: complete local bot games. Scores carry between hands in a current match, but local matches do not resume after app restart. Online code exists, with live acceptance and durable rankings outstanding. No public matchmaking, invite, account, or ranking service is promised.
- Solitaire: truly solo Klondike, multiple modes, local Save & Home and on-device Ranked Challenge rating. No public leaderboard or multiplayer.
- War: local shared-device play for 2–4 named players, match resume, Battle History, and tournament progress. No remote rooms or social/account service. Battle History is not a skill ranking.

## Palace composition and validation

The website table uses a narrower desktop frame, tighter opponent spacing, one visible table boundary, legal-card highlighting, and scrollable large hands. Short landscape screens use a compact arrangement with all controls in view. The rules engine, saved-game schema, and gameplay code are unchanged.

Release checks: static site validation; eight-width checks of all seven card routes; seven interactive table viewports; a full rendered Palace game including reserve and hidden cards, pickup, burn, resume, keyboard, reduced motion, and privacy gates; production portfolio regression checks; SOVINTO typography checks. Machine results are retained in the corresponding `docs/visual-evidence/card-*` directories. Live verification targets the exact deployed commit.
