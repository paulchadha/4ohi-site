# Website performance budget

The site is dependency-free static HTML, CSS, and JavaScript. It uses system fonts and optimized local WebP artwork. No framework, analytics bundle, ad technology, remote font, API bootstrap, service worker, or third-party runtime is part of the public path.

## Budgets

- Keep the shared CSS below 40 KB uncompressed.
- Keep each shared JavaScript file below 20 KB uncompressed.
- Keep ordinary above-the-fold transferred assets below 300 KB before compression where practical.
- Preserve explicit image dimensions and lazy-load below-fold artwork.
- Avoid work on page load that requires network access beyond same-origin static assets.

The current Palace CSS is about 26 KB; site behavior is about 3 KB; Palace tutorial logic is about 12 KB; secondary tutorial logic is about 8 KB. Game WebP icons are roughly 53 to 72 KB each. The 1200 by 630 Open Graph image is metadata-only and does not load into page layout.

## Verification

Browser acceptance checks failed resources, third-party requests, mixed content, storage, console errors, responsive overflow, and image completion. Before release, inspect a cold-load network trace at phone width and confirm that no unapproved source or unexpectedly large replacement asset entered the critical path.
