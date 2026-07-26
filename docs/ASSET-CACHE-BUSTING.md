# Asset Cache Busting

`scripts/build-site.mjs` fingerprints local CSS, JavaScript, and image `src`/`href` references with the first 12 characters of a SHA-256 content hash. It also emits `assets/asset-manifest.js`, which lets runtime-selected Palace/Shed/Shithead artwork use the same immutable version query.

When an asset changes, rebuild the site before committing. A passing browser gate requires every stylesheet and script URL to contain `?v=<hash>`. GitHub Pages may cache files, but a changed content hash produces a new URL and prevents stale phone CSS from impersonating the new release.

Rollback is a normal Git revert followed by rebuild, push, and exact-SHA Pages verification. Do not edit DNS or mail records for a front-end rollback.