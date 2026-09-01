# Palace browser game visual acceptance

Acceptance date: September 1, 2026

PalaceApp source: `31c7578a3a15db6d3ac78a3c5d332d73a9353afd`

Evidence directory: `docs/visual-evidence/palace-web-2026-08-31/`

## Method

The reference frames were captured from the unmodified Expo web rendering of the real PalaceApp. The website frames were captured from the generated `palace-play.html` and driven through its public controls by Playwright. Reference frames use the app's 844 × 390 landscape presentation; website frames use a 390 × 844 portrait phone to prove intentional reflow rather than screenshot imitation. Both use the same rules engine and garden-table assets.

The app and website do not expose deterministic replay as a public feature, so the frames match state categories rather than exact card faces. The final app result reference is an authentic completed hand from a separate deterministic capture; the web result is an authentic completed one-game browser session.

## State-by-state acceptance

| State | PalaceApp reference | Website implementation | Acceptance note | Result |
| --- | --- | --- | --- | --- |
| Game setup | `app-01-game-setup.png` | `web-01-setup.png` | Player/bot setup, Palace identity, and start action remain clear after portrait reflow. | Accepted |
| Initial hand | `app-02-initial-hand.png` | `web-02-initial-hand.png` | Three-zone deal and setup choices are immediately legible. | Accepted |
| Human turn | `app-03-human-turn.png` | `web-03-human-turn.png` | Active player, legal cards, pile, deck, and action affordance retain the app hierarchy. | Accepted |
| Bot turn | `app-04-bot-turn.png` | `web-04-bot-turn.png` | Bot identity, status, timing, and table state remain visible without blocking the hand. | Accepted |
| Special-card effect | `app-05-special.png` | `web-05-special.png` | Rank effect is announced in text and reflected in the pile state. | Accepted |
| Pickup | `app-06-pickup.png` | `web-06-pickup.png` | Pickup consequence is explicit and the transferred cards remain visible. | Accepted |
| Draw pile nearly exhausted | `app-07-draw-nearly-exhausted.png` | `web-07-draw-nearly-exhausted.png` | Low deck count and transition toward table cards are understandable. | Accepted |
| Face-up phase | `app-08-face-up.png` | `web-08-face-up.png` | Hand exhaustion exposes the face-up row and legal selection state. | Accepted |
| Face-down phase | `app-09-face-down.png` | `web-09-face-down.png` | Blind cards and the flip action are clearly differentiated from the pile. | Accepted |
| Game over | `app-10-game-over.png` | `web-10-game-over.png` | Winner/result treatment is clear; the website correctly ends after one completed game. | Accepted |

## Responsive and interaction acceptance

Rendered checks passed at 320 × 568, 375 × 812, 390 × 844, 430 × 932, 768 × 1024, 1024 × 768, and 1440 × 900. There was no horizontal document overflow, clipped action dock, or unreachable hand at those sizes. Keyboard setup, card selection, dialogs, focus visibility, reduced motion, corrupt-save recovery, Canadian copy, and production-only interface gating also passed.

`browser-results.json` records nine passed browser gates and zero failures, including explicit resume after tab closure. `e2e-observed-states.json` records a completed rendered game in 92 public-control actions with initial hand, human turn, pickup, bot turn, special card, low draw pile, face-up, and face-down phases all observed.

## Accepted differences

The app's compact landscape table and the site's portrait phone layout cannot have identical geometry. The website preserves the interaction hierarchy, art, state communication, and card-zone semantics while stacking the opponent rail, table, hand, and action dock for touch access. Browser fullscreen and sound are optional enhancements; neither changes game rules or state.