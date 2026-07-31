# Founder-Rejection Reconstruction Audit

Date: 2026-07-31
Starting commit: `6447d753858ea92fbf7f0b8ed71a6a5b923750fe`

## What failed

- The generated pages loaded eleven overlapping style sheets and up to ten global scripts. Successive redesign layers competed for layout, stacking, spacing, and responsive behavior.
- The homepage led with the studio's family origin instead of the games, repeated the same origin across multiple sections, and made the portfolio feel secondary.
- The header was visually crowded. At intermediate widths it became a horizontally scrolling row instead of a deliberate mobile navigation pattern.
- The Games control used a native `details` element without a sufficiently strong shared interaction contract. It depended on page-specific CSS layers for positioning and could appear detached from the navigation.
- Game links were generated from a catalog, but duplicated visual lists and legacy controls created several opportunities for labels, states, and destinations to diverge.
- Multiple prominent visual systems were present at once: Palace app styling, founder redesign styling, company architecture styling, spatial gallery styling, immersive styling, and portfolio styling.
- Several hero treatments used excessive scale or dead space, particularly on phones, and artwork could be clipped or pushed below the initial viewport.
- News cards were visually repetitive and low-contrast in places. Status and action hierarchy was inconsistent.
- Page motion was distributed across several scripts, increasing the chance that decorative layers could interfere with clicks.
- Legacy mojibake remains visible in generated output when the source is read through an incorrect Windows code page; the generator and browser output must remain UTF-8.

## Why it failed

The site evolved through additive redesigns. New CSS and JavaScript were layered over old systems instead of replacing the global presentation. That preserved useful content but made the visible interface difficult to reason about and physically inconsistent across routes and viewports.

## What is being replaced

- The stacked global stylesheet bundle with one reconstruction stylesheet.
- The competing home hero, orbit, spatial gallery, and ribbon composition with a game-first editorial journey.
- The crowded responsive header with one desktop dropdown and one mobile disclosure menu.
- Repetitive catalog styling with a reusable, art-led game-card system.
- Family-origin-led homepage and About introduction with concise game-studio positioning.
- Distributed decorative motion with a small, progressive-enhancement interaction layer that respects reduced motion.

## What remains worth preserving

- `scripts/game-catalog.mjs` as the canonical portfolio and route source.
- The Palace mini-match logic, power-card interaction, rules, naming context, and history pages.
- Existing Bobby, Evil Doom, Commander Thum-B, Palace, Hearts, Spades, and Euchre artwork.
- The verified Northwestern purple treatment for Evil Doom Girl (`#4E2A84`).
- News data and honest development-status language.
- Privacy, security, support, terms, sitemap, metadata, localization, and no-tracking principles.
- Semantic landmarks, skip links, focus hooks, CSP, and asset fingerprinting.

## Preservation inventory

### Content worth preserving

- Palace rules, power cards, history, table-name context, and playable tutorial.
- Bobby's collect/explore/reunite direction without treating exploratory board names as canon.
- Evil Doom Adventures' two-hero rescue story and movement vocabulary.
- Commander Thum-B's 1970s-inspired mission framing and explicitly in-development status.
- Published newsroom entries whose claims and dates remain accurate.

### Functional code worth preserving

- Static generator, canonical catalog, news filtering, game tutorials, asset hashing, and validation scripts.
- Page-specific interaction modules only on pages that need them.

### Components to replace

- Global header presentation, homepage composition, catalog presentation, shared buttons, shared cards, section spacing, and mobile navigation layout.

### Styling to remove from generated pages

- The eleven legacy global style imports. Files remain in the repository for rollback/history, but reconstructed pages no longer load them globally.

### Duplicate/conflicting systems

- Legacy `palace-site`, `founder-redesign`, `app-experience-v2`, `company-architecture`, `next-level`, `spatial-gallery`, `immersive-world`, and `portfolio-worlds` global presentation layers.

## New acceptance criteria

- Games and artwork dominate the homepage before company history.
- All seven canonical games appear in one centrally generated Games menu and on the Games index.
- Every visible interactive affordance is a semantic link or button with a working destination/action.
- The Games menu works with pointer, keyboard, touch, Escape, and outside click; mobile navigation is a reliable disclosure pattern.
- Every canonical game has a deliberate route with honest status language.
- No key route has horizontal overflow at 320, 375, 430, tablet, laptop, or large-desktop widths.
- The site uses one coherent global visual system, clear focus states, 44-pixel touch targets, and reduced-motion behavior.
- Family-origin messaging appears once on About and nowhere as the homepage's central pitch.
- Browser interaction tests, route validation, link validation, accessibility checks, production generation, and screenshot review pass.
- Functional reconstruction may be marked complete only with the explicit statement: “Functional reconstruction complete; visual acceptance pending founder review.”
