# Four of Hearts Interactive Website Information Architecture

## Brand hierarchy

Four of Hearts Interactive is the parent company. `4OH` is its approved compact mark. Palace and Commander ThumB are peer game properties; Hearts, Spades, and Euchre are additional catalog entries. No game name substitutes for the company identity.

The reusable game source of truth is `scripts/game-catalog.mjs`. Add future games there, then render cards, navigation, and status from the shared record.

## Global navigation

Every public page uses the same company-level header:

1. Home
2. Games
   - Palace
   - Commander ThumB
   - View All Games
3. News
4. About 4OH
5. Support

The Games disclosure is native, keyboard-operable, Escape-closeable, and converted into the mobile menu below 820 pixels. Language and general settings remain global. Palace naming is not global.

## Game-local navigation

Palace and Commander ThumB each have a local sub-navigation below the company header. The Palace table-name control, “THIS TABLE CALLS IT,” exists only on `/palace-play.html`. Its Palace, Shed, and private traditional-name behavior affects only the Palace playing route and never changes the company, Commander ThumB, or another game.

## Canonical routes

- `/` and `/index.html`: Four of Hearts Interactive company homepage.
- `/games.html`: reusable game catalog.
- `/palace.html`: Palace overview.
- `/palace-play.html`: interactive Palace five-scene tutorial.
- `/palace-story.html` and `/palace-faq.html`: Palace history and rules.
- `/commander-thumb.html`: Commander ThumB Coming Soon overview.
- `/news.html`: filterable company newsroom.
- `/news-commander-thumb-is-coming.html`
- `/news-welcome-to-the-thum-system.html`
- `/news-building-commander-thumb.html`
- Existing Palace and company articles remain public.
- `/about.html`, `/support.html`, and the legal/safety routes remain company-level pages.
- `/play.html` and the three secondary `*-play.html` routes remain compatible teaching-preview URLs.

Generated HTML, sitemap, RSS, metadata, and structured data come from `scripts/build-site.mjs`. Older `.html` URLs remain valid direct-navigation targets on GitHub Pages.

## Status language

- Palace: Interactive Preview; a website tutorial is available.
- Commander ThumB: Coming Soon; no public play link and no invented release date.
- Hearts, Spades, and Euchre: Internal Alpha; website lessons are available, but no public-game availability is claimed.

The guarded Commander release article remains in `content/drafts/` and is excluded from the generator, sitemap, RSS feed, and public routes until a working public version is verified.

## Responsive and accessibility contract

Production QA covers 320, 375, 430, 768 portrait, 1024 landscape, 1366 laptop, and 1920 desktop widths. Pages must retain one H1, landmarks, skip link, visible focus, a usable mobile menu, 40–44 pixel interactive targets, no horizontal overflow, reduced-motion support, local images with meaningful alt text, and no cookies, browser storage, analytics, advertising, or tracking.

Run:

```powershell
node scripts/build-site.mjs
node scripts/validate-site.mjs
node scripts/verify-company-architecture.mjs
```

`scripts/verify-palace-site.mjs` is the compatibility entry point for the same current production browser gate.
## 2026-07-31 production presentation

The company hierarchy is unchanged. The homepage is now an immersive five-world navigator led by Palace, while preserving standard Home, Games, News, About 4OH, and Support navigation and all existing deep routes. See `docs/IMMERSIVE-DIGITAL-EXPERIENCE-2026-07-31.md`.
