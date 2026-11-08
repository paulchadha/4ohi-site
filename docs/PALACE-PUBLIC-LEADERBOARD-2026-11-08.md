# Palace public leaderboard

The Palace product page links to `/palace-leaderboard.html`, a live public Global Top 25 with the current champion. The moonlit scene and crown reuse the approved app artwork; provenance and byte hashes are in `assets/palace-leaderboard/ARTWORK.md`. Personal rank remains in the authenticated app.

The browser reads only:

```text
GET https://plankton-app-qgwhz.ondigitalocean.app/games/palace/v1/public-leaderboard?mode=ranked&limit=25
```

Requests omit credentials, authorization headers, referrers and cached responses. The public contract includes opaque public player IDs, display names, rank/rating, outcome counters, champion, eligible count and snapshot/version metadata. It excludes personal standing, canonical account IDs, provider subjects and email. The client rejects unexpected/private response fields and renders all player names as text. No browser authentication, new hosting, local score projection or production fixture data is introduced.

Loading, genuinely empty results, initial failure and stale prior results are distinct. Refresh remains available after failure. Foreground pages refresh every five seconds and immediately on foreground/online; hidden pages pause polling. The last service snapshot and version remain visible. A service failure never becomes an empty leaderboard. Private rank is explained without asking visitors to send credentials through the website.

Validation:

```text
node scripts/build-site.mjs
node --test scripts/palace-leaderboard.test.mjs
node scripts/validate-site.mjs
node scripts/verify-palace-web-engine.mjs
node scripts/verify-palace-leaderboard.cjs
```

The browser suite uses the repository's existing Playwright/Chrome tooling. Set `CHROME_PATH` when the local browser requires an explicit path; `LEADERBOARD_QA_OUT` selects its output directory. Its API responses are isolated fixtures and never reach production. It verifies six responsive sizes, loading/empty/error/stale/retry behavior, literal player-name rendering, privacy, navigation, hidden/foreground behavior and a refresh under ten seconds.

The initial local verification passed eight reader/contract tests, fifteen browser checks, the site's 160-page static validation, and existing Palace engine checks (33 cases plus 100 complete simulations). These are local implementation checks. A successful live API read and exact-SHA Pages deployment must be observed separately before calling this a deployed working feature.

Release through the existing GitHub Pages `main:/` workflow only after the compatible public API is active. Confirm the exact resulting Pages source SHA, API destination, CORS for `https://4ohi.com` and `https://www.4ohi.com`, and real empty/populated/error behavior in a fresh session. Do not publish a fixture or success-like placeholder while the backend is unavailable. Rollback is a focused revert commit on main, preserving unrelated site work and all game/account records.
