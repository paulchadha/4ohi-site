# Bobby Protector + Builder website integration

The public Bobby page, homepage and Games tiles, Games showcase, product gallery, related cards, current news artwork and social preview now use the founder-supplied Protector + Builder artwork dated October 31, 2026. The official title is Bobby the Breadasaurus: Tower Defense Adventures; compact labels retain Bobby the Breadasaurus.

The desktop hero uses live HTML copy on the quiet left side with Bobby on the right. At widths up to 1000px, the complete hero appears above the copy. The separately composed square tile keeps its full composition rather than using the generic landscape card crop. Links and controls remain real HTML. No release availability, store listing or gameplay screenshot claim is added.

## Source and reproducibility

- Base: production main `2c487af1d0ba5fcb6da25275f3f9081639cb059a`.
- Branch: `codex/bobby-protector-builder-20261102`.
- Original 1672 × 941 hero and 1254 × 1254 tile PNGs are preserved in `docs/source-assets/bobby-protector-builder-2026-10-31/`.
- Run `python scripts/process-bobby-protector-art.py` with Pillow to reproduce uncropped WebPs: hero 960 × 540 and 1600 × 900; tile 480 × 480 and 800 × 800.
- SHA-256 hashes, source hashes, byte sizes and exact dimensions are recorded in `assets/bobby/protector-builder/provenance.json`.
- Superseded originals and historical date-evidence snapshots remain unchanged and recoverable. Current article illustrations are labeled current artwork rather than historical date evidence.

## Verification

Build generation is idempotent. Static validation covers 152 routes, internal and email links, images, metadata, accessibility hooks, sitemap, domain identity, tracking and secret checks. All 113 JavaScript sources pass syntax checks. The privacy regression suite passes. Final local browser acceptance passes 30/30 production gates and 8/8 Bobby-specific responsive gates. Selected screenshots and machine-readable results are committed beside this report.

`node scripts/verify-bobby-protector.cjs` checks live title/control markup, loaded hero composition and zero horizontal overflow at widths 320, 390, 768, 1024, 1440 and 1920; checks full square tiles on Home and Games; and records screenshots under `docs/visual-evidence/bobby-protector-builder-20261102/`. Use `SITE_URL=https://4ohi.com` for production checks and `BOBBY_QA_OUT` to choose their output directory.

The existing production acceptance suite had two assertions predating current production content: a hardcoded 21 products despite 23 existing records, and a 1000px minimum despite current 844px phone captures. They now validate unique catalog IDs and image dimensions declared in the page. No product capabilities or card-game behavior were changed.

This report covers the public marketing website. Android/PWA integration and physical-device evidence are recorded separately in the Bobby application repository.
