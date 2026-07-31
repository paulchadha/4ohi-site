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

## Current Palace launch campaign

The launch campaign treats Palace as a card-table legend finally becoming an app. The approved castle art remains the world, while the approved four-colored-hearts 4OH emblem now anchors the header, favicon, Apple touch icon, and organization identity.

The first viewport uses a single editorial headline, cinematic negative space, an October 17, 2026 countdown, compact calls to action, floating table cards, and a moving strip of documented regional game-family names. The Fortnite reference informed only the promotional hierarchy: one dominant world, one immediate action, high contrast, and kinetic energy. No Fortnite layout, artwork, copy, or assets are reproduced.

`assets/palace-launch.css` layers the campaign over the stable `palace-site.css` system. Pointer lighting, castle drift, card drift, countdown updates, the mythology strip, focus lift, and tutorial play motion provide depth without audio or mandatory hover. Reduced-motion mode stops continuous animation, and the responsive composition keeps the logo, castle, campaign line, countdown, and primary play action readable from 320 through 1920 CSS pixels.

## Founder-directed composition

`assets/founder-redesign.css` is the final visual layer. It replaces repeated oversized cards with immersive chapters, editorial rule ribbons, full-width storytelling, cinematic art treatment, and a real table surface. Impact/Arial Narrow system typography supplies game-poster force without remote fonts. Palace owns midnight navy, electric blue, castle light, gold, and restrained silver; secondary games retain ruby, purple, and emerald identities. The approved 4OH mark remains the navigation, favicon, touch, footer, and social identity.
## App-parity table layer (July 26, 2026)

`assets/app-experience-v2.css` is the Palace product layer: navy/teal felt, cyan information, gold action states, compact product chrome, overlapping readable cards, full-viewport mini-match geometry, RTL card correction, 44-pixel controls, reduced motion, and short-landscape recovery. It derives from the approved public app presentation audit recorded in `FOUNDER-EXPERIENCE-RELEASE.md`.

## App-parity visual authority

The founder-supplied Palace app home screen is now the controlling visual reference. `assets/palace-app-web.css` is the final web layer: sky blue, royal/deep blue, cream, gold, garden green, rounded surfaces, friendly physical cards, and restrained dark contrast. Large condensed display typography was softened with a rounded system stack and more compact section pacing. See `APP-PARITY-AND-PAGE-HIERARCHY.md`.


## 2026 founder correction

The website now follows the app-world table system: royal/navy blues, gold rails, bright sky and garden framing, white physical cards, and compact mobile typography. Power cards must be drawn as playing cards, not abstract numeric blocks. See [Founder Correction Release](FOUNDER-CORRECTION-RELEASE-2026-07-26.md).
## Immersive world layer — 2026-07-31

The current production authority is `assets/immersive-world.css`, documented in `IMMERSIVE-DIGITAL-EXPERIENCE-2026-07-31.md`. It introduces organic masks, spatial depth, cyan/gold focus, restrained display-serif hierarchy, and connected scene rhythm while preserving the semantic company system. New work must extend these tokens and avoid returning to repetitive rectangular panels or page-filling type without a content reason.
