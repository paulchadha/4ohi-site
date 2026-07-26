# Palace-first design system

## Source of truth

The approved 2026-07-25 brand board is preserved exactly at `docs/source-assets/4oh-brand-board-original.png`. Its SHA-256 is `62E1DF4436CC94BFDD747B266397BF17B6AEA922B8CDE4E9B90403AE07006E72`. Website derivatives live in `assets/`; never overwrite the source preservation copy.

## Visual hierarchy

Palace is the flagship and receives the castle art, electric-blue emphasis, largest hero, deepest tutorial, and first position in navigation and editorial layouts. Hearts uses ruby, Spades royal purple, Euchre emerald, and company-level accents use metallic gold or silver-ivory. The surrounding stage stays midnight navy so the game identities remain distinct.

Core CSS tokens are defined once in `assets/palace-site.css`: ink/navy backgrounds, royal and electric blue, ruby, emerald, royal purple, metallic gold, silver-ivory, and white. Do not introduce unrelated colors. Typography uses a local system stack; no remote fonts or render-blocking font requests are permitted.

## Interaction language

Buttons and links have visible focus, at least 44 CSS pixels of target height, plain action labels, and non-color state cues. Motion is restrained to reveal, hover, and pointer-light effects; `prefers-reduced-motion` reduces animation and transition duration to effectively zero. Tutorials use real buttons, live feedback, and no timed decisions.

## Asset rules

Use the optimized WebP icons at their intrinsic 512 by 512 ratio. Include explicit width and height, useful alt text, and lazy loading below the fold. `assets/og-brand.jpg` is the 1200 by 630 social preview. Do not stretch, recolor, overlay, or silently replace approved artwork.

## Palace-first recovery decision

The rejected baseline used a large studio headline, a conventional copy/image split, the generic 4OH mark as primary art, and broad low-information dark regions. It failed because Palace did not own the first viewport and the page read as a polished corporate landing page rather than a flagship game destination.

The recovery hero is a full-bleed Palace world: the approved castle tile is enlarged, responsively sourced, edge-faded into the navy environment, and layered behind the single `Rule the table.` direction. Palace is named before the headline; Internal Alpha, Four of Hearts endorsement, News, tutorial, discovery, and the three-layer rhythm all appear in the opening experience. The studio logo moves to a supporting section.

Pointer lighting, castle drift, card drift, focus lift, scroll reveal, and tutorial play motion provide depth without audio or mandatory hover. All stop or collapse under reduced motion. On phones, the composition pulls the castle, Palace name, headline, copy, and tutorial action into the first viewport instead of simply stacking a desktop split layout.
