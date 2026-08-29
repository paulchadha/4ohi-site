# New Layout Rejection Audit

## Rejected active system

The founder-rejected homepage is generated in `scripts/build-site.mjs` and styled by `assets/game-first-v3.css`, with tab switching in `assets/game-first-v3.js`.

- `.feature-stage`, `.feature-panel`, `.feature-content`, `.feature-selectors`, and `.feature-selector` create a near-full-viewport rotating-feature composition. Although four titles exist in data, only one is visible and the others behave like similarly framed slides.
- `.all-games-stage`, `.game-world-grid`, `.game-world-card`, and `.game-world-copy` create a repeated rectangular portfolio grid. The art is partly clickable through an absolutely positioned link overlay, but the semantic structure makes the image and title look separate from the actual link.
- `.play-palace-home`, `.studio-news-home`, and `.studio-statement` rely on large vertical section padding and repeat the same centered shell rhythm.
- Mobile rules in `game-first-v3.css` primarily stack the desktop structures. They do not create a distinct phone composition for Bobby or Evil Doom.

No user-visible `Bobby the Brontosaurus`, `Bobby Brontosaurus`, or `Bread Brontosaurus` string exists in the current clean starting state. The canonical manifest already says `Bobby the Breadasaurus`; that data is retained.

## Removed from the production path

- The feature-panel/tab stage and its four equal selector controls.
- The repeated `game-world-card` portfolio grid.
- The active `game-first-v3.css` and `game-first-v3.js` references.
- The old homepage body class `game-first-home`.
- The assumption that a game image can sit outside its semantic destination link.

After validation, the unused V3 CSS and JavaScript files are deleted. There is one active homepage system.

## Retained only as content or data

- `scripts/game-catalog.mjs` remains the single catalog authority.
- Approved art paths, focal points, status, availability, descriptions, routes, and news records are retained.
- Shared company navigation, legal pages, footer structure, Palace functionality, and all tutorials remain.

## Structurally new composition

The replacement is a playable studio marquee followed by an editorial world track:

1. A short asymmetrical studio marquee layers multiple game worlds in one composition.
2. Four major worlds appear as an interlocking editorial sequence, not equal cards or hidden slides.
3. Bobby and Evil Doom receive dedicated full-width visual moments with mobile-specific crops.
4. Palace gets a compact playable strip instead of dominating the portfolio.
5. Ten games appear in a variable-width studio reel whose entire links are interactive.
6. Three compact news links and one short studio statement finish the page.

Every game artwork region is a normal semantic link. No nested anchors or nonsemantic click handlers are used.
