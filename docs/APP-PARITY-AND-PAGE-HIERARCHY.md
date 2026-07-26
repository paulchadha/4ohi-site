# Palace app parity and page hierarchy

## Controlling visual reference

The July 26, 2026 founder-supplied Palace app home screen is the controlling visual reference for the website. The web system uses the app's sky blue, deep Palace blue, cream, gold, garden green, rounded controls, friendly depth, and family-entertainment warmth. Dark navy is retained only where contrast and theatrical pacing help.

The approved Four of Hearts mark remains the brand mark. The app-parity work does not redraw, reinterpret, or replace the logo.

## Shared experience layer

`assets/palace-app-web.css` is the final visual layer after the established site styles. It provides:

- a bright Palace-world homepage;
- visible table-name, language, and Settings controls;
- rounded app-like buttons, panels, and cards;
- compact, content-first page openings;
- responsive and RTL behavior;
- reduced-motion handling;
- a friendlier rounded heading treatment that avoids the former oversized block-only look.

The site remains generated from `scripts/build-site.mjs`. Generated HTML is not the authoring source.

## Page decisions

### Home

The first view presents the 4OH logo, visible controls, Palace world art, release countdown, and mini-match call to action. The 2 of clubs, 7 of diamonds, 8 of spades, and 10 of hearts are physical interactive cards, not text tiles. Their rules are respectively reset, require lower, transparent, and burn.

The "many names" homage says the game crossed generations and borders through person-to-person teaching. It does not make an unsupported millennia claim. The feedback link uses the approved `What Our Table Calls Palace` email subject.

### News

The former full-viewport editorial title card is removed. The first desktop viewport contains the compact newsroom heading and the featured story. Recent stories follow immediately. Canonical metadata continues to say Palace; visible article copy uses the centralized selected-name renderer where the product identity is not a fixed historical reference.

### More Games

The former full-viewport title card is removed. Hearts, Spades, and Euchre artwork and calls to action appear in the first desktop viewport. Palace/Shed remains the flagship context and preserves the URL state.

### About

The About page leads with the four-daughter origin and then connects the founder's 50+ years of play and 20+ years examining strategy in a university environment to the product philosophy. "Gameologist" remains explicitly playful, not a credential.

### Tutorials

Palace/Shed uses the five-part mini-match. Hearts, Spades, and Euchre keep their two-decision Quick Play lessons. All progress remains in page memory and is discarded on refresh.

## Social preview art

`assets/og-palace-app-world.jpg` was generated once with the built-in image-generation tool, then resized to 1200 by 630 and optimized for Open Graph use. It depicts a bright cream-and-blue Palace castle, garden, and the four correct power cards. It contains no generated 4OH logo, no people, no marketing claim, and no watermark. The approved site logo remains separate.

Final generation prompt:

> Create a premium, cheerful 3D storybook Palace card-game world for a 1200×630 social preview: brilliant sky, garden, cream castle with royal-blue roofs, heart above the door, and physical 2♣, 7♦, 8♠, and 10♥ cards; reserve upper-left negative space; no people, brand logo, words, watermark, Fortnite imitation, or dark sci-fi palette.

## Visual evidence

The final local evidence set is under `docs/visual-evidence/`:

- `app-home-1440x900.png`
- `app-home-390x844.png`
- `app-power-cards-1440.png`
- `app-news-1440x900.png`
- `app-games-1440x900.png`
- `app-about-1440x900.png`
- `app-mini-match-390x844.png`
- `app-mini-match-ar-shed-390x844.png`
- `app-parity-results.json`

The automated suite checks geometry, but acceptance also included human inspection of the homepage, compact News and More Games first viewports, About hierarchy, and the physical-card presentation.
