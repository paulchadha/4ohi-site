# Workbench implementation — October 4, 2026

Implemented in the existing dependency-free static website. This first of four passes remains local: nothing was committed, pushed or deployed, and no public Sling Nouveau build was created. Pre-existing account-service work, Palace rules/engine assets and unrelated repository changes were preserved.

## Result

- Added Sling Nouveau to the shared product manifest, desktop/mobile Games menu, homepage discovery, game catalog, footer, related creative-product links, product filters, product page and sitemap. Its status is In Development; its actions are Meet Sling Nouveau and Follow development.
- No approved Sling Nouveau artwork was found in the repository or its asset/provenance records. The product uses intentional typography in the site's navy/coral/gold palette. Its social image is explicitly the studio mark, not another game's artwork or a fake screenshot.
- Current Unicorn Blast labels use the owner-approved name. The stable `heartstack` ID, `/heartstack-unicorn-blast.html` route, historical article wording and RSS identifiers remain intact. It stays distinct from Unicorn Land Adventures.
- News is Notes from the Workbench, with the requested supporting line, one featured story, recent updates, all-product and article-type filters, collection filters, newest/oldest reading and progressive load more. Static oldest-first, origin-series and product archives remain available without JavaScript.
- All 20 catalog products have From the developers and On the workbench sections. Eighteen display the latest relevant existing article, its actual date/type/excerpt and an archive link. Gin Rummy and Sling Nouveau await their first relevant posts from the next content prompt; they currently show clearly labeled design goals, with no fake articles or empty preview cards.
- The one `content/news.json` collection feeds full articles, News, product journals/archives, homepage previews, RSS and sitemap. Records now carry stable IDs, byline, article type, product IDs, explicit publication state, real dates and series metadata. Genuine revision dates, historical periods and approved images are optional.
- Only published records enter public output. Build regression checks prove draft isolation and removal of a generated article route after withdrawal to draft. Private source/template/output-manifest files remain in Jekyll-excluded `content`.
- All 21 existing article dates, routes and RSS GUIDs were preserved. Published bodies keep their original context; current product availability is shown separately. Article text is escaped and stays English under other site language settings, with an honest availability notice. Navigation language controls remain operational.

## Source and documentation files changed

```text
README.md
scripts/build-site.mjs
scripts/production-pages.mjs
scripts/studio-product-manifest.mjs
scripts/workbench-content.mjs                      (new)
content/news.json
content/article-template.json                      (new, private)
content/publication-history.json                   (new, private history fixture)
assets/workbench.css                               (new)
assets/workbench-nojs.css                           (new)
assets/workbench.js                                (new)
assets/production-locales.js
docs/NEWS-AUTHORING.md
docs/PRODUCT_REGISTRY.md
docs/WORKBENCH-IMPLEMENTATION-2026-10-04.md           (new)
scripts/verify-workbench.mjs                        (new)
scripts/verify-workbench-browser.mjs                (new)
scripts/verify-production-portfolio.mjs             (20-product expectation)
scripts/verify-sitewide-links.cjs                   (honors excluded service templates)
```

Generated files also include `assets/asset-manifest.js`, `assets/workbench-products.js` (aliases derived from the shared manifest), `content/journal-output-manifest.json` (private managed-route list), `feed.xml`, `sitemap.xml`, all 104 root HTML documents, and 30 nested pages. Three nested pages use the full shared shell (`games/thumb-command/index.html`, `games/evil-doom-boy/index.html`, `games/commander-thum-b/index.html`); the remainder are existing compatibility routes regenerated from the current sources. The 23 new root documents are `sling-nouveau.html`, `news-archive.html`, `news-origins.html`, and one `news-product-ID.html` archive for each of the 20 stable product IDs. All regenerated public document filenames are listed below.

## Verification performed

- Generator succeeded. A second isolated build produced identical public bytes.
- `node scripts/validate-site.mjs`: 104 root pages passed links, images, headings, metadata, sitemap, CSP/accessibility hooks, tracking/mixed-content and secret checks.
- `node scripts/verify-workbench.mjs`: historical dates/GUIDs/routes; all 20 journals; renamed-product aliases; honest Sling availability; idempotence; draft and withdrawn-route isolation; a shared multi-product article updating every destination; literal HTML escaping; invalid product-ID rejection.
- `node scripts/verify-workbench-browser.mjs`: 10 passing browser gates covering every product and filter, category/combined filtering, sort/load more/reload state, keyboard focus, desktop/mobile Sling navigation, French/Canadian/Arabic settings, English article notices, no-JavaScript reading, static archives, all article references and 320–1920px layouts.
- `node scripts/verify-company-architecture.mjs` (existing production-portfolio suite): 30 gates and 17 screenshots passed.
- `node scripts/verify-sitewide-links.cjs`: 134 public pages and 287 browser-resolved internal links/assets, zero failures. The crawler now follows the marketing site's publishing scope; excluded account-service templates are checked by that service's own tests rather than treated as static public pages.
- `node scripts/verify-palace-web-engine.mjs`: 33 focused rules/engine checks plus 100 complete seeded game simulations passed.
- `node scripts/verify-palace-web.mjs`: 9 browser gates, including a complete rendered game, save/recovery, keyboard, mobile and reduced motion, passed.
- `node scripts/verify-evil-doom-origin.mjs`: 20 identity, hero-selector, navigation, locale, metadata and responsive gates plus 11 screenshots passed.
- `node scripts/verify-account-integration.mjs`: opt-in account links, unsafe-origin rejection and deterministic markup for all 134 site HTML documents passed.
- Syntax checks and final diff whitespace review passed.

Browser tests used the bundled Playwright packages via `NODE_PATH` and installed Chrome. Fresh evidence is under `docs/visual-evidence/workbench-2026-10-04/`, including journal/product/article/mobile screenshots and machine-readable results. News, article, Sling and journal screenshots were visually inspected. No production or remote deployment was tested or changed in this pass.

A local-only preview runs at `http://127.0.0.1:4173/news.html`. News and Sling Nouveau returned HTTP 200; `content/news.json` and the private article template returned HTTP 404. The preview is bound to loopback and excludes private source directories.

## Remaining content work

The next prompt supplies new articles. Complete that content pass and the remaining implementation prompts before deploying. Keep the first Sling and Gin Rummy journal entries unpublished until their real content and publication dates are supplied. The authoring guide and private article template explain product tagging, retrospectives without fake backdating, featuring, draft privacy and local preview.

## Regenerated public document filenames


- 404.html
- about.html
- about/index.html
- bobby-the-breadasaurus.html
- booyang-city.html
- commander-thumb.html
- contact.html
- euchre-play.html
- evil-doom-adventures.html
- evil-doom-boy-adventures.html
- evil-doom-girl-adventures.html
- funky-town.html
- games.html
- games/bobby-the-breadasaurus/index.html
- games/booyang-city/index.html
- games/commander-thum-b/index.html
- games/euchre/index.html
- games/evil-doom-adventures-shadow-run/index.html
- games/evil-doom-adventures/index.html
- games/evil-doom-boy-adventures/index.html
- games/evil-doom-boy/index.html
- games/evil-doom-girl-adventures/index.html
- games/evil-doom-girl/index.html
- games/funky-town/index.html
- games/gildenspire/index.html
- games/gin-rummy/index.html
- games/hearts/index.html
- games/index.html
- games/palace/index.html
- games/solitaire/index.html
- games/spades/index.html
- games/thumb-command/index.html
- games/war/index.html
- gildenspire.html
- gin-rummy.html
- hearts-play.html
- heartstack-unicorn-blast.html
- index.html
- lifestyle-apps.html
- lifestyle-apps/index.html
- lifestyle-apps/people-lens/index.html
- lifestyle-apps/sleep-amigo/index.html
- lifestyle-apps/sovinto/index.html
- lifestyle-apps/whomly/index.html
- news-ai-in-the-workshop-and-the-product.html
- news-archive.html
- news-bobby-and-the-breadstone.html
- news-bobby-the-breadasaurus-joins-the-family.html
- news-bobby-tower-defense-takes-shape.html
- news-booyang-a-town-that-grows-with-play.html
- news-building-a-safer-card-table.html
- news-building-a-town-that-refuses-to-look-normal.html
- news-building-commander-thumb.html
- news-building-dragons-that-actually-feel-different.html
- news-building-unicorn-land-adventures.html
- news-card-table-adds-solitaire-war.html
- news-commander-thumb-is-coming.html
- news-designing-the-alien-invasion.html
- news-evil-doom-girl-enters-development.html
- news-evil-doom-two-heroes-one-adventure.html
- news-evil-doom-two-heroes-one-route.html
- news-from-search-to-opportunity-building-whomly.html
- news-gildenspire-a-dragon-built-to-move.html
- news-heartstack-joins-the-workbench.html
- news-heartstack-unicorn-blast-development.html
- news-inside-princess-land-adventures.html
- news-introducing-gildenspire-flight-or-fight.html
- news-making-sleep-data-feel-human.html
- news-meet-sleep-amigo.html
- news-meet-the-blueguard.html
- news-meet-the-four-games.html
- news-origins.html
- news-palace-019-founder-review.html
- news-palace-enters-founder-testing.html
- news-people-lens-is-becoming-whomly.html
- news-people-lens-joins-the-lifestyle-line.html
- news-princess-land-adventures-development.html
- news-product-bobby.html
- news-product-booyang-city.html
- news-product-euchre.html
- news-product-evil-doom-boy.html
- news-product-funky-town.html
- news-product-gildenspire.html
- news-product-gin-rummy.html
- news-product-hearts.html
- news-product-heartstack.html
- news-product-palace.html
- news-product-princess-land.html
- news-product-sleep-amigo.html
- news-product-sling-nouveau.html
- news-product-solitaire.html
- news-product-sovinto.html
- news-product-spades.html
- news-product-thumb-command.html
- news-product-unicorn-land.html
- news-product-war.html
- news-product-whomly.html
- news-shadow-run-enters-development.html
- news-small-fixes-that-change-the-feel.html
- news-the-city-is-the-base.html
- news-thumb-command-save-planet-earth.html
- news-thumb-command-world-tour.html
- news-unicorn-land-adventures-development.html
- news-welcome-to-booyang-city.html
- news-welcome-to-four-of-hearts.html
- news-welcome-to-the-thum-system.html
- news-why-flying-has-to-be-fun.html
- news-why-were-building-palace.html
- news-why-were-building-sleep-amigo.html
- news.html
- news/index.html
- palace-faq.html
- palace-play.html
- palace-story.html
- palace.html
- people-lens.html
- play.html
- play/index.html
- princess-land-adventures.html
- privacy.html
- privacy/index.html
- security.html
- sleep-amigo.html
- sling-nouveau.html
- solitaire.html
- sovinto.html
- spades-play.html
- support.html
- support/index.html
- terms.html
- thumb-command.html
- unicorn-land-adventures.html
- war.html
- whomly.html
