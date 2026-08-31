# 4OH studio portfolio visual system

## Direction

The July 31 rebuild presents Four of Hearts Interactive as a studio of distinct worlds rather than a Palace-first gallery. The opening feeling is discovery: a confident studio promise, layered art, large cinematic doors, editorial pacing, and visible proof that the family extends beyond card games.

The system is original to Four of Hearts. It reproduces no reference-site assets, proprietary typefaces, maps, copy, branded elements, or implementation.

## Experience architecture

1. The studio leads with “One Family. Many Games.”
2. Palace, Bobby the Breadasaurus, and Evil Doom Adventures: Shadow Run receive major visual doorways.
3. Thumb Command, Hearts, Spades, and Euchre remain visible in a compact portfolio ribbon.
4. Games renders all seven reusable catalog records.
5. News and About continue the company story rather than turning one product into the company.

## Visual language

- Studio frame: midnight blue, electric sky, gold, and cream.
- Bobby: warm bread browns, sunlit orange, landscape green, and bright blue.
- Shadow Run: black, charcoal, danger red, and Evil Girl deep purple #4E2A84.
- Large system typography and responsive editorial scale; no remote font dependency.
- Local WebP artwork with preserved founder source boards and repeatable derivative generation.

## Implementation

- scripts/build-site.mjs owns shared structure, navigation, metadata, sitemap, and RSS.
- scripts/game-catalog.mjs is the ten-product source of truth.
- scripts/portfolio-content.mjs owns Bobby and Shadow Run page content.
- assets/portfolio-worlds.css owns studio and portfolio visual treatment.
- scripts/process-portfolio-art.py owns optimized crops and selective recolor derivatives.
- scripts/verify-portfolio-expansion.mjs guards the experience at eight viewport geometries.

## Accessibility and privacy

The experience retains semantic landmarks, one H1, skip links, visible focus, keyboard and mobile menus, reduced-motion behavior, readable targets, local assets, and zero cookies, storage, analytics, ads, external fonts, or tracking.

Founder physical visual acceptance remains pending.
