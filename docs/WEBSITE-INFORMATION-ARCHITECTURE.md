# Four of Hearts Interactive website information architecture

## Brand hierarchy

Four of Hearts Interactive, LLC is the parent company. 4OH is the approved compact mark. The studio line is **One Family. Many Games.**

The current catalog has seven peer game properties:

1. Palace — flagship card game; Interactive Preview.
2. Bobby the Breadasaurus — family adventure; In Development.
3. Evil Doom Adventures: Shadow Run — action platformer; In Development.
4. Commander Thum-B — arcade defense; In Development.
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

Commander Thum-B uses an immersive in-page mission navigation. Bobby and Shadow Run are cinematic overview pages without false play controls.

## Canonical routes

- / and /index.html — studio-first portfolio homepage.
- /games.html — reusable ten-product catalog.
- /palace.html, /palace-play.html, /palace-story.html, /palace-faq.html.
- /bobby-the-breadasaurus.html.
- /evil-doom-adventures.html.
- /games/thumb-command/ (canonical), with /thumb-command.html as the static implementation.
- /hearts-play.html, /spades-play.html, /euchre-play.html.
- /news.html and generated article routes, including Bobby and Shadow Run.
- /about.html, /support.html, and legal/safety routes.
- /play.html remains a compatible teaching-preview route.

The generator owns HTML, metadata, JSON-LD, sitemap, and RSS. Existing public URLs remain direct-navigation targets on GitHub Pages.

## Content and status rules

- Bobby and Shadow Run may say In Development or concept development; no platform, date, rating, level, download, or public-availability claims.
- Commander Thum-B is In Development with no false play or release claim.
- Palace may link to its website teaching preview, which is not a public app release.
- Hearts, Spades, and Euchre may link to their two-step teaching lessons.
- Concept-board embedded labels are not canonical content. Bobby friend names are not published.
- The approved game title is **Commander Thum-B** and the tagline is **Save Planet Earth**.

## Responsive and accessibility contract

Rendered QA covers 320×568, 375×812, 430×932, 768×1024, 1024×768, 1366×768, 1920×1080, and 844×390.

Every route must retain one H1, semantic landmarks, a skip link, visible focus, a usable mobile menu, readable targets, no horizontal overflow, reduced-motion support, meaningful alt text, local assets, and no cookies, storage, analytics, advertising, or tracking.

Validation commands:

    node scripts/build-site.mjs
    node scripts/validate-site.mjs
    node scripts/verify-company-architecture.mjs
    node scripts/verify-portfolio-expansion.mjs

Founder physical visual acceptance remains a separate human approval gate.
> **Current architecture (2026-07-31):** The founder-rejection reconstruction replaces the stacked presentation system with `assets/studio-reconstruction.css`, retains `scripts/game-catalog.mjs` as the ten-product source of truth, and validates the global shell with `scripts/verify-reconstruction.mjs`. See `docs/FOUNDER-REJECTION-RECONSTRUCTION-2026-07-31.md` for the current route map, status rules, visual system, evidence, and acceptance requirements.

## August 1, 2026 game-first reconstruction

The public information architecture now begins with Four of Hearts Interactive as the studio and a manifest-driven catalog of seven peer products. Global navigation is Home via the 4OH mark, Games (graphical mega menu), News, About, and Play Palace. Game-specific controls never appear globally.

Canonical clean destinations are `/games`, `/games/palace`, `/games/bobby-the-breadasaurus`, `/games/evil-doom-adventures-shadow-run`, `/games/thumb-command`, `/games/hearts`, `/games/spades`, `/games/euchre`, `/play`, `/news`, `/about`, `/support`, and `/privacy`. Static `.html` routes remain the implementation and backward-compatible public URLs; generated directory indexes provide redirects for the clean destinations.

The single source of catalog truth is `scripts/game-catalog.mjs`. See `docs/GAME-FIRST-RECONSTRUCTION-REVIEW.md` and `docs/GAME-STUDIO-WEBSITE-REFERENCE-AUDIT.md`.
## 2026-08-01 playable studio homepage

The homepage is company-first and portfolio-led: compact studio marquee, four major editorial worlds, compact Palace play band, all-seven portfolio reel, no more than three news items, and a compact studio signoff. Palace remains one game; Bobby, Evil Doom, Commander Thum-B, Hearts, Spades, and Euchre are peers in the manifest-backed portfolio. Full game regions are semantic links. Canadian-fun mode is query-driven and route-persistent without storage.

## Palace-first editorial entry — 2026-08-29

The homepage now leads with Palace as the flagship campaign while retaining Four of Hearts Interactive as the parent identity and all ten games as catalog-backed offerings. Global navigation remains company-level; Palace table-name controls remain isolated to the Palace play context. See `IMMERSIVE-EDITORIAL-EXPERIENCE-2026-08-29.md`.