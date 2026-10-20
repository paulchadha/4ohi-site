# Sling Bling website release — October 20, 2026

The saved release is based on main commit `0410b456d6e5c67324ce8faeb3688fa705e9bd22`. Before publishing, remote main and the latest successful Pages build were both verified at that commit; neither interrupted attempt had published this update.

This release integrates the already supplied Sling Bling development artwork, illustrated product page, catalog tile, creature and city galleries, stable `sling-nouveau` route/identity, and the October 20 developer post. All 45 historical article records retain their titles, bodies, dates, routes and identifiers (only the previous feature flag changes). There are 46 public articles.

## Checks

Fresh validation passed for 129 root documents and shared links, images, metadata, RSS/sitemap, accessibility hooks and secret/tracking scan. The shared journal suite passed historical GUIDs, all 20 journals, drafts, withdrawn-route cleanup, shared publication and escaping. The queue suite verified 20 planned product entries, real publication dates, idempotence and exclusion of 19 future drafts from 161 public HTML/XML files. Chrome passed the illustrated product/news pages at 320–1440 pixels, 30 portfolio checks, and 10 journal/filter/reading gates at 320–1920 pixels. Palace passed 33 engine checks, 100 simulations, fixed-session replay and conservation; all 9 browser gates passed, including two complete games and same-deal replay. `release-hashes.json` records the exact checked bytes and deterministic second build.

## Future daily publication: prepared, not scheduled

The source is `content/news.json`; records with `scheduledFor` are the complete 20-post campaign manifest. One post is published on October 20. Nineteen drafts have `date: null` and planned UTC days October 21–November 8. There is no verified automatic scheduler. The existing GitHub Pages route publishes committed generated files from main and does not run the queue script.

Use a clean release checkout synchronized with current main. Preview with `node scripts/publish-due-news.mjs`. On October 21 that should list only `gin-rummy-gold-trim`. To publish due work, run `node scripts/publish-due-news.mjs --publish`, then `node scripts/build-site.mjs`, `node scripts/validate-site.mjs`, `node scripts/verify-workbench.mjs`, and `node scripts/verify-news-schedule.mjs`. Review, commit only the changed source/generated site files, push main without force, and verify the exact-SHA Pages build and live routes. The queue publishes *all* due drafts; if a run is late, review the preview carefully. It assigns the actual UTC publication day and never backdates missed days. No future publication is automatic until a separate scheduler is configured and verified.

The original dirty working checkout remains untouched. No app-project writes, new credentials, grants, hosting/security changes, services, payments or APK releases are part of this release.
