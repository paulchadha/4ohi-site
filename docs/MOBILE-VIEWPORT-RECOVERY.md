# Mobile viewport recovery

Date: July 26, 2026

## Incident

The earlier screenshot verifier passed viewport dimensions to `BrowserContext.newPage()`. Playwright does not apply viewport options there, so files named as 390-pixel captures were actually rendered at the default desktop width. This allowed a desktop composition to reach production even though the evidence filenames appeared to represent phone testing.

## Repair

- The verifier now creates a page and calls `page.setViewportSize()` before navigation.
- The homepage has a dedicated phone composition: compact 4OH header, centered Palace artwork, readable launch message, four-column countdown, full-width actions, compact three-level rail, and no decorative card collisions.
- Page heroes, News, More Games, About, Palace, dialogs, power cards, and game shelves now collapse or scroll intentionally at phone widths.
- The Palace mini-match remains playable without horizontal overflow at 390 × 844.

## Regression matrix

The automated browser gate now captures and measures:

- Homepage: 320 × 568, 360 × 800, 390 × 844, and 430 × 932.
- Palace, News, More Games, and About: 390 × 844.
- Palace mini-match in English and Arabic/Shed mode: 390 × 844.

For phone captures, the gate rejects:

- document-level horizontal overflow;
- headings clipped outside the viewport;
- desktop-sized visible headings;
- headers taller than 80 pixels;
- a primary homepage play action below the first normal phone viewport.

The full functional suite still covers 23 pages, nine locale/name states, all four tutorials, all four Palace power cards, the traditional-name Easter egg, and zero browser storage.

## Evidence

Canonical phone evidence is stored in `docs/visual-evidence/`:

- `app-home-320x568.png`
- `app-home-360x800.png`
- `app-home-390x844.png`
- `app-home-430x932.png`
- `app-palace-390x844.png`
- `app-news-390x844.png`
- `app-games-390x844.png`
- `app-about-390x844.png`
- `app-mini-match-390x844.png`
- `app-mini-match-ar-shed-390x844.png`

The release gate requires both the local run and the post-deployment public run of `scripts/verify-app-parity.mjs` to pass.


## Founder correction acceptance

The new responsive gate covers 320, 360, 390, and 430-pixel widths. The phone header intentionally uses a second compact row so table-name and language choices remain visible. See [Interactive Table and Mobile QA](INTERACTIVE-TABLE-AND-MOBILE-QA.md).
