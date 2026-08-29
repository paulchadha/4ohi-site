# Website build and release pipeline

1. Update `scripts/studio-product-manifest.mjs`, source content, and approved art.
2. Regenerate derivatives with `scripts/process-founder-portfolio-art.py` when source boards change.
3. Run `scripts/build-site.mjs` to produce HTML, sitemap, RSS, and fingerprinted asset references.
4. Run `scripts/validate-site.mjs` and product-specific verifiers.
5. Run `scripts/verify-ten-product-portfolio.mjs` against the local HTTP server.
6. Review fresh screenshots and the short `.webm` tour under `docs/visual-evidence/studio-portfolio-2026-08-29/`.
7. Commit focused source/generated changes, push `main`, wait for the exact-SHA Pages deployment, and smoke-test the public domain.

Publishing does not alter DNS, Proton Mail, or sibling product repositories.
