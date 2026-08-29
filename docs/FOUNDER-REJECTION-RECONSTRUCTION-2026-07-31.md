# Game-First Website Reconstruction

Date: 2026-07-31
Branch: main
Starting commit: 6447d753858ea92fbf7f0b8ed71a6a5b923750fe

## Architecture

The public website is a generated static site. scripts/build-site.mjs owns the shared shell, route generation, metadata, navigation, footer, and page composition.

scripts/game-catalog.mjs is the single source of truth for the seven public game names, status labels, artwork, genres, descriptions, overview destinations, and honest play availability:

1. Palace — Interactive Preview — /palace.html
2. Bobby the Breadasaurus — In Development — /bobby-the-breadasaurus.html
3. Evil Doom Adventures: Shadow Run — In Development — /evil-doom-adventures.html
4. Thumb Command — Coming Soon — /thumb-command.html
5. Hearts — Internal Alpha — /hearts-play.html
6. Spades — Internal Alpha — /spades-play.html
7. Euchre — Internal Alpha — /euchre-play.html

The shared header renders its Games menu from that catalog. The Games index renders its cards from the same catalog. New games must be added to the catalog first; a valid deliberate route is required before publishing.

## Global shell

Primary navigation:

- Home
- Games
- Play Palace
- News
- About 4OH

Desktop Games navigation uses a click- and keyboard-operable disclosure. Mobile uses the same semantic disclosure inside a full-height navigation panel. Escape closes the active disclosure and then the mobile panel. Outside click closes the Games menu. Every visible action is a link or button.

Palace table-name controls remain in Palace context only and do not rename the company or any other game.

## Visual system

Generated pages load assets/studio-reconstruction.css as the single global visual system. The previous eleven-layer global CSS stack remains in version history and on disk for rollback reference but is no longer loaded by generated pages.

The system defines:

- Shared spacing, typography, containers, buttons, focus rings, status badges, cards, menus, dialogs, footer, and responsive breakpoints.
- An art-led, game-first homepage with layered featured artwork instead of a corporate mission hero.
- Distinct world treatments: bright bread adventure, Northwestern-purple shadow action, modern city-defense Thumb Command editorial art, and app-like Palace table presentation.
- Motion limited to short hover/reveal transitions, with complete prefers-reduced-motion handling.
- Minimum 44-pixel interactive targets.

The implementation is original Four of Hearts code and uses only approved repository artwork and brand assets. It borrows the reference's confidence, editorial pacing, layering, scale contrast, and exploratory rhythm without copying its branding, text, logos, assets, or exact compositions.

## Status language

- “Interactive Preview” means a public website teaching experience is available; it does not mean the native game is released.
- “Internal Alpha” describes testing-stage work and does not imply public availability.
- “In Development” and “Coming Soon” may not be paired with a Play or Download action unless a functioning public version exists.
- No launch dates, platforms, statistics, partnerships, awards, reviews, or quotes may be invented.

## Evil Doom Girl color standard

Evil Doom Girl's canonical website identity is Northwestern purple #4E2A84. Hot pink and magenta may not be her principal interface color. The browser test reads the computed background color and requires rgb(78, 42, 132).

## Image conventions

- Use approved local repository artwork only.
- Hero images need explicit dimensions and fetchpriority=high only when initially visible.
- Below-the-fold imagery uses loading=lazy.
- Art containers define stable aspect ratios or minimum sizes to prevent layout shift.
- Full concept boards are supporting development material, not generic card thumbnails.
- Bobby board names remain exploratory unless separately approved.

## Route map

Company:

- / and /index.html
- /games.html
- /news.html
- /about.html
- /support.html
- /contact.html
- /privacy.html
- /security.html
- /terms.html
- /404.html

Palace:

- /palace.html
- /palace-play.html
- /palace-faq.html
- /palace-story.html
- compatibility hub /play.html

Other game routes:

- /bobby-the-breadasaurus.html
- /evil-doom-adventures.html
- /thumb-command.html
- /hearts-play.html
- /spades-play.html
- /euchre-play.html

News routes are generated from content/news.json as /news-{slug}.html.

## Content reduction

The homepage contains no four-daughters, four-kids, founder-children, family-origin, family-story, or “smiles” pitch. “One Family. Many Games.” remains only as a sparse studio slogan in structured brand data where appropriate.

About contains one origin sentence: “The name Four of Hearts was inspired by the founder’s four daughters.” It is not repeated elsewhere in the reconstructed homepage or navigation.

## Interaction and physical QA

scripts/verify-reconstruction.mjs checks:

- 16 key routes at 320×568, 375×812, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080, and 844×390.
- HTTP status, one H1, main landmark, broken images, runtime errors, horizontal overflow, cookies, local storage, and session storage.
- Desktop and mobile Games navigation with all seven games.
- Escape handling, touch behavior, keyboard focus, all game destinations, mobile navigation, hover state, and exact Evil Doom purple.
- Required desktop and mobile screenshot evidence.

scripts/capture-reconstruction-tour.mjs records a brief browser tour through the Games menu, Bobby, Shadow Run, mobile navigation, and Play Palace.

## Evidence

Evidence root: docs/visual-evidence/reconstruction/

- desktop-home-top.png
- desktop-home-featured.png
- desktop-games-menu-open.png
- desktop-games-index.png
- desktop-palace.png
- desktop-bobby.png
- desktop-evil-doom.png
- desktop-thumb-command.png
- desktop-news.png
- desktop-about.png
- mobile-home.png
- mobile-navigation-open.png
- mobile-games.png
- mobile-bobby.png
- mobile-evil-doom.png
- mobile-play-palace.png
- evil-doom-girl-purple.png
- desktop-navigation-focus.png
- game-card-hover.png
- reconstruction-tour.webm
- reconstruction-results.json

## Founder acceptance

Automated interaction and computed-layout tests prove only the tested function and geometry. They do not prove taste or physical visual acceptance.

The Codex in-app image-view bridge was unavailable during this task because of a Windows ACL sandbox error. Screenshot evidence and the tour recording were still generated locally for direct founder review.

Functional reconstruction complete; visual acceptance pending founder review.
