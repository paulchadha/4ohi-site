# Founder experience release — July 26, 2026

## Product recovery

The rejected five-scene “Palace Field Training” module was removed. The Palace tutorial is now one continuous app-like mini-match using the approved Four of Hearts visual system:

- 4OH emblem in the product chrome;
- deep navy and teal table, cyan information, gold action states;
- rival at top, pile at center, player hand at bottom;
- match or beat, illegal-low recovery, ten burn, opponent pickup and hand growth;
- power cards 2, 7, 8, and 10;
- hand, face-up, and face-down levels;
- crown completion, replay, rules, and story paths;
- compact release countdown;
- keyboard, touch, reduced-motion, mobile, tablet, desktop, and short-landscape layouts.

The About page now joins the four-daughter origin, smile-first philosophy, founder biography, and Palace product decision into one human story. “Gameologist” is explicitly playful rather than a credential. Founder-supplied claims remain marked for factual approval.

## Approved app-facing provenance

The limited read-only PalaceApp audit inspected only its public `assets` inventory and public presentation documentation. Three public presentation references were copied into `docs/visual-evidence`:

- `app-home-reference.png`
- `app-play-reference.png`
- `app-table-reference.png`

Source: `C:\Users\paulc\Documents\PalaceApp\assets\chadhaus-*-clean.png`.

No PalaceApp file, native game code, server code, secret, private state, DigitalOcean configuration, Proton configuration, or mail DNS record was changed or copied into production assets.

## Automated evidence

`scripts/verify-founder-experience.mjs` records `docs/visual-evidence/founder-experience-results.json` and reference screenshots. The local gate covers:

- all 22 HTML pages;
- exactly one H1, canonical metadata, description, 9 language alternates, no overflow, no console errors, no third-party scripts;
- 320×568, 360×800, 390×844, 412×915, 430×932, 768×1024, 1366×768, and 1920×1080;
- Palace/Shed English and French, Palace Arabic RTL, Shed Hebrew RTL, Canadian-fun, Spanish, Simplified Chinese, and Hindi;
- full mini-match, replay, private-name dialog, fresh-URL reset;
- zero cookies, local storage, session storage, and external resource requests.

## Security and release

The site remains a static GitHub Pages publication with the existing CSP, HTTPS-only target, canonical apex domain, verified GitHub protected-domain state, local assets, and no form backend. DNS and Proton Mail records are outside this change. Rollback is `git revert` of the focused recovery commits; do not edit DNS or mail records to roll back presentation.
## Immersive founder pass — 2026-07-31

The latest founder-directed pass replaces conventional stacks with an exploratory, connected world while preserving approved content. Full decisions, QA, performance, privacy, rollback, and limitations are recorded in `IMMERSIVE-DIGITAL-EXPERIENCE-2026-07-31.md`.
