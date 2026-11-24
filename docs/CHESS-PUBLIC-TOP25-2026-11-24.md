# Chess public Top 25

This website-only change adds `chess-leaderboard.html`, a prominent entry on `chess.html`, and discovery from the existing leaderboard hub and board navigation. It changes no app, account, database, ranking rule or backend deployment. News and the daily publication queue are unchanged.

## Existing public source

The supported anonymous GET is `https://four-of-hearts-accounts-567g6.ondigitalocean.app/chess/api/leaderboard?pool=rapid&filter=all&limit=25&offset=0`. Replace only the allowlisted pool with `blitz` or `bullet`. The existing service already permits browser reads from `https://4ohi.com`; no CORS/provider/tenant configuration was changed. The new page's connection policy permits only this known origin in addition to self.

The canonical Chess source was inspected read-only: `server/app.ts` public leaderboard route, `server/store.ts` leaderboard and rating-settlement paths, `shared/time-controls.ts`, `docs/SERVICE_CONTRACT.md` and the existing bot/private/eligibility fixtures. The public contract is `rated-result-1-provisional-visible-2`: nondevelopment members with at least one rated human result; computer ratings are separate, private/unrated games do not settle this rating. Provisional players remain visible until 20 rated results. Pools are Bullet (1/2 minutes), Blitz (3/5 minutes) and Rapid (30 minutes).

Source inspection and actual credential-free public reads confirmed two eligible Rapid players and zero Blitz/Bullet players during preparation. Counts are observations, not embedded website data. The site always fetches the current public feed. No starting ratings or synthetic players are shown.

## Rendering and freshness

- Default Rapid; pool selection has shareable URLs and browser history. Pools are never merged.
- At most 25 returned players, preserving the service's competition ranks and deterministic tie order. Equal displayed ratings share ranks such as 1, 1, 3.
- Display only public handle, rating, rank and provisional marker. Public identifiers are discarded before rendering. Anonymous reads omit credentials and referrers; private/unknown payload fields fail closed. No authenticated or administrative endpoint is used.
- Confirmed empty and unavailable states are distinct. Rows remain stable during refresh, with no loading flash. Errors retain received rows explicitly marked stale.
- Refresh every 60 seconds while visible, with an abort timeout, pool-race protection and disposal on navigation. Display the service feed timestamp and measured receive age; mark data stale after 120 seconds or a failed refresh. The timestamp describes the feed response, not the last game played.
- Keyboard-accessible pool choice, scrollable semantic table, readable mobile/desktop layouts, live status and direct source links without JavaScript.

## Validation

Preparation passed 11 dedicated public-reader tests, 13 existing game-leaderboard tests, static validation of 182 pages and Palace fixed-deal/replay/save/conservation checks. Browser fixtures passed nine groups across 320, 390, 768 and 1440 pixels: nonempty/25 cap/ties, error and recovery, slow quiet refresh with stable row nodes/layout, stale-row retention, pool-switch race/history, confirmed empty, hidden-page polling pause, measured age, real entry links and no-JavaScript source access. Actual public feeds also passed the finished reader's validation and existing website CORS checks.

Fixture data remains in excluded test sources and private evidence, never public HTML, RSS, sitemap or the production reader. All historical article records and pages, the Palace demo and leaderboard implementation remain unchanged. Final deployment and live-browser evidence is recorded separately in the private release receipt.
