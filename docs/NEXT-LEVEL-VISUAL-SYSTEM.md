# 4OH Spatial Editorial Visual System

## Direction

The July 2026 redesign moves Four of Hearts Interactive away from stacked, oversized marketing blocks and into an exploratory digital-gallery experience.

The reference point is the feeling of spatial discovery found in high-end cultural websites: restrained navigation, a deep canvas, floating objects, editorial typography, and interaction that rewards curiosity. No reference-site assets, maps, layouts, copy, or branded elements are reproduced.

## Brand expression

- Four of Hearts Interactive remains the parent brand.
- The approved 4OH compact mark is the visual center of the company homepage.
- Palace and Commander ThumB appear as peer game portals.
- Approved game artwork remains the primary imagery.
- Deep ink, warm paper, luminous cyan, heart red, violet, and gold form the shared palette.
- Display typography uses a refined system-serif stack; controls and body copy use a clean system-sans stack. No third-party font request is made.

## Experience principles

1. **Discover, do not stack.** Game art occupies a spatial orbit and large editorial frames.
2. **Content remains primary.** Motion and decoration never hide required text or controls.
3. **Every viewport is intentional.** The orbit, cards, navigation, and editorial grids recompose from 320 pixels through large desktop widths.
4. **Motion is optional.** Pointer parallax, entrance reveals, and ambient animation are disabled by reduced-motion preferences.
5. **Privacy remains structural.** The experience creates no cookies, local storage, analytics, advertising, or third-party embeds.
6. **Game controls stay scoped.** Palace table naming remains confined to the Palace playing context.

## Implementation

- `assets/next-level.css` is the final visual-system layer. It contains the palette, type system, responsive compositions, focus treatment, and legacy-layer containment.
- `assets/next-level.js` adds an in-memory scroll indicator, intersection-based reveals, pointer-only orbit depth, and temporary hover/focus atmosphere changes.
- `scripts/build-site.mjs` owns the spatial homepage markup and loads both assets on every generated route.
- `scripts/commander-content-v2.mjs` preserves the exact `Commander ThumB` casing in visually transformed labels.

## Accessibility and performance

- Semantic landmarks, headings, skip links, accessible names, and keyboard menus remain intact.
- Focus is a high-contrast gold outline with an offset.
- Touch targets remain at least 42–44 pixels.
- Reduced-motion users receive the complete static experience.
- Artwork is reused in responsive WebP variants already managed by the asset manifest.
- No external font, script, image, or tracking dependency is introduced.
