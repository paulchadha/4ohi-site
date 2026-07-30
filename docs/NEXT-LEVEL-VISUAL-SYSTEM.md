# 4OH Spatial Gallery Visual System

## Direction

The July 2026 rebuild makes the Four of Hearts homepage an explorable gallery rather than a stack of promotional cards. Its inspiration is the feeling of discovery found in exceptional cultural websites: one focused object at a time, controlled depth, quiet interface chrome, editorial pacing, and movement that responds to the visitor.

No reference-site assets, proprietary typefaces, maps, copy, branded elements, or source implementation are reproduced. The system is original to Four of Hearts and uses only approved 4OH artwork.

## Experience architecture

1. **One world in focus.** Palace, Commander ThumB, Hearts, Spades, and Euchre occupy a circular spatial stage. One game is active and actionable; neighboring worlds remain visible as depth cues.
2. **Exploration has several doors.** Visitors can use the numbered world controls, previous/next controls, arrow keys, a mouse wheel, a trackpad, or a touch drag. Scrolling exits normally at the first and last world so the gallery cannot trap the page.
3. **The interface stays quiet.** The company mark floats above the gallery. On desktop, company navigation becomes a compact glass navigation island near the bottom edge. Mobile uses an explicit Menu button and a readable overlay.
4. **The page changes rhythm.** The spatial opening gives way to a crisp studio statement, a typographic game index, an asymmetrical editorial newsroom, and a focused closing invitation.
5. **News is readable.** Homepage News uses near-black type on cool light gray rather than low-contrast beige. The full News page uses white type on near-black with large editorial imagery.

## Brand expression

- Four of Hearts Interactive is always the parent brand.
- 4OH remains the approved compact mark.
- Palace, Hearts, Spades, Euchre, and Commander ThumB are five distinct game worlds.
- Deep black, paper gray, electric blue, cyan, and 4OH gold provide the shared environment while each game keeps its own artwork and color.
- Large Georgia-based editorial display type is paired with a system sans-serif. No external font request is introduced.

## Implementation

- `scripts/build-site.mjs` generates the spatial homepage and loads the experience assets across generated pages.
- `assets/spatial-gallery.css` owns the spatial stage, homepage navigation island, studio statement, game index, homepage News, and full newsroom treatment.
- `assets/spatial-gallery.js` owns circular positioning, captions, mouse-wheel boundaries, drag/swipe, selectors, and keyboard behavior.
- `scripts/game-catalog.mjs` remains the single source of truth for all five game worlds.
- `scripts/verify-spatial-gallery.mjs` guards six viewport geometries, five-world state, active-world count, 42px targets, keyboard behavior, links, and horizontal overflow.

## Accessibility, privacy, and performance

- Exactly one game world is exposed as active at a time; inactive world links are removed from the keyboard order and marked `aria-hidden`.
- Captions update in an `aria-live` region.
- All visible gallery controls are at least 42px; phone controls are 44px.
- Motion is removed when `prefers-reduced-motion` is active.
- The gallery provides explicit controls in addition to gestures and never depends on hover.
- Existing semantic landmarks, skip link, current-page state, dialogs, and mobile navigation remain intact.
- No cookies, local storage, analytics, advertising, external fonts, or third-party embeds are introduced.
- Approved WebP artwork is reused; inactive artwork is lazy-loaded.