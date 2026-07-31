# Four of Hearts Interactive website information architecture

## Brand hierarchy

Four of Hearts Interactive, LLC is the parent company. 4OH is the approved compact mark. The studio line is **One Family. Many Games.**

The current catalog has seven peer game properties:

1. Palace — flagship card game; Interactive Preview.
2. Bobby the Breadasaurus — family adventure; In Development.
3. Evil Doom Adventures: Shadow Run — action platformer; In Development.
4. Commander Thum-B — arcade defense; Coming Soon.
5. Hearts — card game; Internal Alpha teaching lesson.
6. Spades — card game; Internal Alpha teaching lesson.
7. Euchre — card game; Internal Alpha teaching lesson.

No game name substitutes for the company. Future games are added to scripts/game-catalog.mjs and flow through shared navigation and catalog rendering.

## Global navigation

Every public page uses this studio-level header:

1. Home
2. Games — all seven titles plus View All Games
3. Play Palace
4. News
5. About 4OH

Support remains in the footer and at /support.html. The Games disclosure is keyboard-operable, Escape-closeable, and integrated with the mobile menu. No Palace-specific selector appears globally.

## Game-local behavior

The table-name control, “This table calls it,” exists only on /palace-play.html. It never renames the company or another game.

Commander Thum-B retains local navigation. Bobby and Shadow Run are cinematic overview pages without false play controls.

## Canonical routes

- / and /index.html — studio-first portfolio homepage.
- /games.html — reusable seven-game catalog.
- /palace.html, /palace-play.html, /palace-story.html, /palace-faq.html.
- /bobby-the-breadasaurus.html.
- /evil-doom-adventures.html.
- /commander-thumb.html.
- /hearts-play.html, /spades-play.html, /euchre-play.html.
- /news.html and generated article routes, including Bobby and Shadow Run.
- /about.html, /support.html, and legal/safety routes.
- /play.html remains a compatible teaching-preview route.

The generator owns HTML, metadata, JSON-LD, sitemap, and RSS. Existing public URLs remain direct-navigation targets on GitHub Pages.

## Content and status rules

- Bobby and Shadow Run may say In Development or concept development; no platform, date, rating, level, download, or public-availability claims.
- Commander Thum-B is Coming Soon with no false play or release claim.
- Palace may link to its website teaching preview, which is not a public app release.
- Hearts, Spades, and Euchre may link to their two-step teaching lessons.
- Concept-board embedded labels are not canonical content. Bobby friend names are not published.
- The only approved Commander product title is **Commander Thum-B**.

## Responsive and accessibility contract

Rendered QA covers 320×568, 375×812, 430×932, 768×1024, 1024×768, 1366×768, 1920×1080, and 844×390.

Every route must retain one H1, semantic landmarks, a skip link, visible focus, a usable mobile menu, readable targets, no horizontal overflow, reduced-motion support, meaningful alt text, local assets, and no cookies, storage, analytics, advertising, or tracking.

Validation commands:

    node scripts/build-site.mjs
    node scripts/validate-site.mjs
    node scripts/verify-company-architecture.mjs
    node scripts/verify-portfolio-expansion.mjs

Founder physical visual acceptance remains a separate human approval gate.
