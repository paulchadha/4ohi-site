# Palace browser game source and implementation record

Last updated: September 1, 2026

## Authoritative product source

The browser game was reconstructed from the real PalaceApp repository at `C:\Users\paulc\Documents\PalaceApp`, not from the former website tutorial.

| Item | Authority |
| --- | --- |
| Repository branch | `main` |
| Integrated source commit | `31c7578a3a15db6d3ac78a3c5d332d73a9353afd` |
| Gameplay candidate in source history | `c366a0cb0785e3e317c39d81705b4bbf46253782` |
| App version | `0.1.10` |
| Android version code | `8` |
| Android and iOS bundle identity | `com.chadhausdigital.palacehostelrules` |
| Release status | Private founder review; not a store or public production release |
| Rules engine | `src/game/palaceEngine.js` and `src/game/palaceRules.js` |
| Presentation timing | `src/game/palacePresentation.js` and `src/game/palaceTiming.js` |
| Native app UI and Palace card renderer | `App.js` (`PlayingCard` at the integrated commit) |
| Shared premium table primitives/design styles | `src/components/fourOfHearts/PremiumTable.js` plus the `StyleSheet` definitions in `App.js` |
| Card assets | Palace card faces/backs are code-rendered; there is no separate Palace card-face bitmap set |
| Table artwork | `assets/four-hearts-table-garden-v1.png` |
| Palace app icon | `assets/icon-palace-4hearts.png` |

The source app contains no authored sound files or production sound controls. Website sound is therefore an optional, browser-synthesized enhancement and is off until the visitor enables it.
### Source-app storage and tests

The native app stores profile and ranked-play values through AsyncStorage, including `chadhaus.playerName`, `chadhaus.playerAvatar`, `chadhaus.playerPhoto`, `chadhaus.botRating`, `chadhaus.peopleRating`, `chadhaus.palaceBanterMode`, `four-of-hearts-ranked-reconnect`, and `fourOfHearts.palaceIdentity`. The local bot game itself is React state rather than a durable native match-save schema. None of these native keys is read or copied by the website.

Authoritative app test command: `npm test` (`node --test test/*.test.cjs`). Website integration commands are `node scripts/verify-palace-web-engine.mjs`, `node scripts/verify-palace-web.mjs`, and `node scripts/measure-palace-web.mjs`; rendered commands require the bundled Playwright dependency path documented in the repository environment.

## Browser architecture

The site remains a dependency-free static site. The complete browser game consists of:

- `assets/palace-web/shared/palaceEngine.js` and `palaceRules.js`: byte-identical copies of the authoritative engine and rules at the commit above.
- `assets/palace-web/shared/palacePresentation.js` and `palaceTiming.js`: copied presentation policy and timing constants.
- `assets/palace-web.js`: a web-only DOM controller, accessibility layer, local one-game persistence, bot scheduling, and browser settings.
- `assets/palace-web.css`: responsive table presentation and mobile/desktop reflow.
- `assets/palace-web/table-garden.png` and `palace-app-icon.png`: exact PalaceApp artwork copies.

Integrity hashes at integration:

| File | SHA-256 |
| --- | --- |
| `palaceEngine.js` | `8BF95A18DE3CA56F0C6B5128E71EF19294D14AB81E35AAB6EEF4DB4B23E2966A` |
| `palaceRules.js` | `259BBDC7C57111B8D39B4667E743B0A3277B9FA5B7FDE9ECA52211AA6905F8AD` |

`node scripts/verify-palace-web-engine.mjs` also checks the vendored files against PalaceApp when the sibling repository is present. To synchronize a future engine revision: record the reviewed PalaceApp SHA, copy the four shared modules and approved art without editing them, update the recorded source SHA in `assets/palace-web.js`, then run the engine, rendered-browser, privacy, architecture, and site validation suites before publishing.

## Rules and one-game contract

The browser edition uses the authoritative deal, setup swapping, legal-move, rank matching, pickup, bot, special-card, jump-in, draw-pile, face-up, face-down, and placement logic. A visitor may choose one to three bots and complete exactly one local game. After the final placement, the result is shown without an offer to begin another game.

Progress is stored only on the visitor's device under `4oh_palace_web_v1`; preferences use `4oh_palace_web_preferences_v1`. The save schema is version 1 and includes the source commit. Invalid, corrupt, mismatched, or completed state is discarded safely. PalaceApp's own AsyncStorage keys are not read, copied, or shared by the website.

## Deliberate platform differences

- PalaceApp is a React Native/Expo interface optimized primarily for a landscape device. The website controller is semantic HTML and reflows to portrait phones, tablets, laptops, and desktop screens.
- Native UI code was not embedded into the static site; only the production engine, rule policy, timing policy, and approved art are shared.
- The website has optional synthesized sound because the source app has no authored audio assets.
- Website progress is local and limited to the single browser game. There are no accounts, rankings, multiplayer, chat, analytics, advertising, purchases, or cross-device synchronization.
- Bot timing pauses while the tab is hidden and reduced-motion preferences eliminate nonessential animation.

The former `assets/palace-tutorial-v3.js` is no longer loaded by `palace-play.html`; the complete browser edition fully supersedes it.
## Measured production characteristics

Measured locally in headless Chrome at 390 × 844 through `node scripts/measure-palace-web.mjs`:

| Measurement | Result |
| --- | ---: |
| Entry navigation to interactive game introduction | 649.8 ms |
| Deal button to interactive setup | 66.5 ms |
| Legal card selection response | 20.3 ms |
| Selected-card play response | 24.2 ms |
| Observed normal-speed bot action | 498.2 ms |
| Browser-game JavaScript and CSS | 93,790 bytes |
| Palace table and icon art | 3,683,925 bytes |

These are local no-cache measurements, not claims about a visitor's network. The entry loads the small controller and the app icon; the table asset is requested when game markup is introduced and is decoded before play begins. Cards are rendered as CSS/HTML rather than separate image downloads, so identical card faces are not repeatedly fetched. Bot work is timer-bounded, timers are replaced on authoritative rerender, and bot scheduling pauses while the document is hidden. Full raw measurements are in `docs/visual-evidence/palace-web-2026-08-31/performance-results.json`.