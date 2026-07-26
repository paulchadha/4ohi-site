# Website performance budget

The site is dependency-free static HTML, CSS, and JavaScript. It uses system fonts and optimized local WebP artwork. No framework, analytics bundle, ad technology, remote font, API bootstrap, service worker, or third-party runtime is part of the public path.

## Budgets

- Keep the shared CSS below 40 KB uncompressed.
- Keep each shared JavaScript file below 20 KB uncompressed.
- Keep ordinary above-the-fold transferred assets below 300 KB before compression where practical.
- Preserve explicit image dimensions and lazy-load below-fold artwork.
- Avoid work on page load that requires network access beyond same-origin static assets.

Final local cold-context browser measurements on 2026-07-25:

- Home at 1440x900 transferred 220,924 bytes total: 38,267 CSS, 3,828 JavaScript, 11,881 HTML, 11,976 favicon, and the 154,972-byte responsive Palace hero. The hero was the largest resource.
- Palace tutorial at 390x844 transferred 72,827 bytes total: 38,267 CSS, 17,206 JavaScript, 5,378 HTML, and 11,976 favicon. No game image is required for the interactive board.
- Decoded totals were 219,124 bytes for home and 71,027 bytes for the tutorial.
- Shared CSS is 37,967 decoded bytes; site behavior is 3,121; Palace tutorial logic is 13,078; and secondary-game tutorial logic remains below 8 KB.

These local HTTP figures include development-server response overhead and do not assume GitHub edge compression. The machine-readable entry-by-entry record is `docs/visual-evidence/palace-local-results.json`.

## Verification

Browser acceptance checks failed resources, third-party requests, mixed content, storage, console errors, responsive overflow, and image completion. Before release, inspect a cold-load network trace at phone width and confirm that no unapproved source or unexpectedly large replacement asset entered the critical path.

## Founder redesign measurements

Local browser QA on July 26, 2026 measured the 1440×900 homepage at 298,022 transferred bytes (7,262 JavaScript; 71,299 CSS; largest resource 154,972-byte Palace hero) and the 390×844 Palace tutorial at 145,207 transferred bytes (17,427 JavaScript; 71,299 CSS; largest resource 41,764-byte 4OH logo). Third-party requests: zero. The redesign uses local WebP/PNG art, system fonts, static HTML, and small framework-free scripts.

## App-parity asset budget

The Open Graph app-world illustration is a 1200Ã—630 progressive JPEG at approximately 189 KB and is metadata-only. Page art remains responsive WebP. New runtime files are local, dependency-free, and inert when their matching component is absent. No third-party font, image CDN, analytics, or embedded widget was added.
