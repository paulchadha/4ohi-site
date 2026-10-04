# October 4 workbench release

The catalog contains 20 products: 17 games and 3 apps. Sling Nouveau is explicitly in development, uses an intentional typography treatment because approved artwork is unavailable, and offers no public play/download build. Unicorn Blast retains the `heartstack` ID and existing route; historical names resolve to its feed. Unicorn Land Adventures remains separate.

The journal contains 45 full English articles: all 21 originals, the 23 supplied editorial posts, and one source-backed Gin Rummy brief. Original titles, descriptions, bodies, dates and RSS identifiers match current main. New publication dates are October 4, 2026. Retrospectives identify broad periods separately. The earliest available website records date from July 25; they establish website work, not the beginning of the company. No additional unsupported company-origin facts were added. Product directions remain goals where release evidence is unavailable.

## Palace findings and repair

The browser reproduction found different deals across fresh visits, no public restart control, and an uncaught storage exception leaving the start button stuck. The completed-save gate also prevented another attempt. Existing asynchronous callbacks referenced mutable global state without a session generation check; saved-state validation accepted a very weak shape.

The public adapter uses the explicit 52-card `palace-web-demo-v1` fixture, the original two-seat configuration and house rules, and a stable bot policy with a logical gameplay clock. Concealed ranks are masked when choosing bot moves; blind cards are selected by position and resolved through the native rules. The vendored native engine/rules/timing files remain byte-identical to the reviewed source commit.

Restart and completion replay share one operation. It increments the generation, cancels timers, card animations and audio, clears transient state, clones the fixture, restores focus, and saves the new attempt when storage permits. The recovery button lives outside the rendered controller. Saves carry fixture/schema IDs and an action trace replayed from the fixture; incompatible, corrupt or tampered states recover automatically. Storage denial leaves in-memory play available with an accurate notice. Other product data and sound/motion preferences survive reset.

Atomic generated-file replacement also resolved workspace file-write errors and avoids rewriting identical output.

## Verified before publication

- Production build twice; deterministic output and static validation (128 root HTML documents).
- Shared content checks: 21 original dates/GUIDs, all 20 product journals, temporary private draft preview, public exclusion, publication/withdrawal cleanup and escaped text. The temporary draft and preview directory are removed.
- Palace: 33 native rules checks, 100 complete seeded engine simulations, deterministic fixture replay, alternative legal strategy, concealed-card policy and conservation.
- Actual Palace browser controls: two complete games (62 human actions, 123 transitions each), identical result after replay; legal moves; exact restart; pending callbacks; 20 rapid resets; animation cancellation; error recovery; valid progress/completion reload; incompatible/corrupt/legacy saves; blocked/quota-full storage; keyboard, focus, dialog and reduced motion.
- Full rendering of all 45 articles; canonical/Open Graph/JSON-LD dates; valid XML RSS/sitemap; 21 preserved feed identifiers; origin/interlude order; browser back/forward; private outputs return 404.
- 10 workbench browser gates, 30 portfolio gates, 71 card-page/table layout checks, 12 nested-navigation journeys, 20 Evil Doom/origin gates, privacy/GPC/cookie regressions and account-disabled markup preservation.
- Generated-output crawl: 158 public HTML routes and 337 browser-resolved internal links/assets.

Google Chrome and bundled Playwright Chromium exercised the game and articles. Microsoft Edge exercised the article system. All three use Chromium. Firefox and WebKit runtimes are unavailable. Viewports include 320, 390/430, 768, 1024, 1440 and 1920 pixels, plus 844×390 landscape. These are browser viewports; no physical phone was connected. Representative screenshots and machine-readable reports are in `docs/visual-evidence/final-2026-10-04/`.

The normal release is a non-forced commit/push to main followed by exact-SHA GitHub Pages verification and public-route tests. A clean checkout preserves the original dirty repository and avoids its pre-existing invalid Git ref. Account service changes, workflow files, CNAME and DNS are outside this release.

## Next developer post

Copy `content/article-template.json` into `content/news.json`, assign a permanent ID/slug and canonical `productIds`, and write the title, excerpt and body with status `draft`. Run `node scripts/preview-post.mjs SLUG` and open its local URL. Close the preview with Ctrl+C. When ready, set status `published` and the actual publication date, build and run the journal checks, then use the normal commit/push/Pages workflow. See `docs/NEWS-AUTHORING.md`.

Publication status and exact SHA are recorded in the accompanying live verification evidence after deployment.
