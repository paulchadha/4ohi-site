# 4OH Immersive Digital Experience — July 31, 2026

## Founder direction

This release replaces a conventional sequence of large headings and rectangular content blocks with one connected Four of Hearts world. The design is original to 4OH. It adopts the useful *principles* of exploratory digital archives—depth, discovery, focus, and spatial continuity—without copying another site’s source, layout, typography, assets, navigation, or proprietary interaction.

Accurate product and company content remains authoritative. Presentation changed; claims, status, routes, privacy commitments, Palace rules, history qualifications, localization, support details, and game availability did not.

## Experience architecture

- The homepage opens on Palace, the flagship, inside a five-world spatial gallery.
- The first viewport includes the 4OH mark, Palace artwork, countdown, Play Palace action, latest News signal, table-name control, and language control.
- Commander ThumB, Hearts, Spades, and Euchre remain peer offerings inside the same world navigator and game index.
- Palace-only naming controls are visible only while Palace is the active homepage world and in the Palace play context. They never rename Four of Hearts Interactive or another game.
- News is presented as a field of transmissions; Games as a world catalog; About as short, staggered human moments; Palace history as a trail of sourced fact, player tradition, and clearly labeled founder lore.
- Every deep route remains an ordinary document with standard links, browser history, direct refresh, and semantic landmarks.

## Visual and motion system

- Core palette: night ink, luminous cyan, Palace gold, paper cream, coral, green, and violet game accents.
- Typography uses system fonts only. Display serif is reserved for atmosphere and hierarchy; interface copy uses the system sans stack for clarity and speed.
- Organic masks, orbital lines, atmospheric gradients, depth planes, and staggered composition replace repetitive cards and boxed sections.
- Motion is enhancement only: IntersectionObserver reveals, gallery depth, and a short page-arrival transition. Content and controls do not depend on animation.
- `prefers-reduced-motion: reduce` disables decorative animation, transitions, and smooth scrolling.

## Responsive and touch behavior

The implementation is explicitly gated at 320×568, 360×800, 390×844, 412×915, 430×932, 768×1024, 1366×768, and 1920×1080. Mobile utilities use a two-row layout so countdown, language, and table name remain legible without horizontal overflow. All visible interactive targets are at least 44 CSS pixels in the mobile checks.

## Accessibility

- One `h1`, one `main`, semantic header/navigation/footer, and a working skip link remain on every route.
- The game gallery supports buttons, arrow keys, Home/End, touch drag, and wheel input; no action requires hover.
- Power Cards support click, touch, and arrow-key examination with `aria-pressed` and a polite live description.
- Current page and selected world states are exposed with `aria-current`; Palace name choices use `aria-pressed`.
- Focus rings use a high-visibility cyan outline.
- Decorative layers are ignored by assistive technology, and non-active game worlds leave the tab order.

## Privacy and security

No cookies, local storage, session storage, trackers, analytics, third-party scripts, external fonts, or advertising were added. Language and Palace table-name state remain URL-scoped. Existing Content Security Policy, canonical metadata, structured data, RSS, robots, sitemap, legal pages, and support details remain intact.

## Performance budget

The generated homepage references 275,939 bytes of local CSS and JavaScript, below the 450 KB production gate. The immersive layer is 21 KB of CSS and under 4 KB of JavaScript before transfer compression. Existing optimized WebP art is reused; no new bitmap payload was added to the runtime experience. Decorative geometry is CSS-native. CLS risk is limited by explicit image dimensions and viewport-reserved hero/gallery space.

## Verification

Automated local gates:

- `scripts/validate-site.mjs`: static routes, links, metadata, sitemap, feed, CSP, naming, and content checks.
- `scripts/verify-company-architecture.mjs`: 20 routes across seven viewport profiles, navigation, keyboard, News, Palace scope, privacy, localization, and tutorial gates.
- `scripts/verify-spatial-gallery.mjs`: five-world gallery, actions, keyboard, controls, overflow, and viewport-scale composition.
- `scripts/verify-immersive-experience.mjs`: eight first-viewport sizes, 28 route/viewports, required Palace opening elements, language navigation, Palace-only scoping, keyboard Power Cards, and CSS/JS payload.
- Existing founder, Palace, Commander ThumB, and app-parity browser suites remain green.

Before and after screenshots are stored under `docs/visual-evidence/immersive-before-*` and `docs/visual-evidence/immersive-after-*`.

## Known limitation

No physical iOS or Android device was attached to this workspace. Mobile validation uses real Chromium layout and input behavior at the required viewport sizes. Founder exploration review and physical-device feel testing remain appropriate after deployment; this is not a failed production gate.

## Rollback unit

The redesign is isolated in `assets/immersive-world.css`, `assets/immersive-world.js`, the homepage composition in `scripts/build-site.mjs`, and its generated HTML. Reverting the focused release commit and rebuilding restores the previous public presentation without DNS, email, native-app, or game-repository changes.
## Public deployment evidence — 2026-07-31

- Deployed implementation SHA: `912b512d09c279be5b910a42f6c6f2fb91406237` (GitHub Pages build status `built`).
- `https://4ohi.com/`: 200 from GitHub Pages.
- `http://4ohi.com/`, `http://www.4ohi.com/`, and `https://www.4ohi.com/`: 301 to `https://4ohi.com/`.
- GitHub Pages: custom domain `4ohi.com`, `https_enforced: true`, `protected_domain_state: verified`.
- Certificate: approved for `4ohi.com` and `www.4ohi.com`, expiry reported as 2026-10-23.
- DNS: four GitHub Pages A records, four GitHub Pages AAAA records, and `www` CNAME to `paulchadha.github.io` confirmed.
- Public browser gates: 20 routes × 7 viewport profiles; eight opening viewports; 28 immersive route/viewports; gallery keyboard/touch-equivalent controls; localization; Palace scope; privacy; and overflow all passed.
- Runtime payload observed by the public immersive gate: 275,777 bytes of local CSS and JavaScript.
