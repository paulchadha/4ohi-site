The existing GitHub Pages site now has one public leaderboard hub and seven
game pages using the shared verified-results contract. The isolated checkout
starts from remote main 3a94f9547de502a22a216f92a27729625d62d79c. The original
4ohi-site working tree, its 322 pending changes and its branch were preserved.

| Canonical game | Website board | Existing product route |
| --- | --- | --- |
| bobby | bobby-leaderboard.html | bobby-the-breadasaurus.html |
| evil-doom-boy | evil-doom-boy-leaderboard.html | games/evil-doom-boy/ |
| gin-rummy | gin-rummy-leaderboard.html | gin-rummy.html |
| hearts | hearts-leaderboard.html | hearts-play.html |
| sling | sling-bling-leaderboard.html | sling-nouveau.html |
| spades | spades-leaderboard.html | spades-play.html |
| thumb-command | thumb-command-leaderboard.html | games/thumb-command/ |

The hub is leaderboards.html. The shared Games navigation and all seven
canonical product pages link to it or their corresponding board. Templates
and generated HTML are included so the maintained build preserves the links.
Solitaire is excluded from the new board registry. Evil Doom Boy uses the
active inner project; its Boy/Girl character choice is preserved. The canceled
Shadow Run project is not registered or revived. Existing compatibility routes
retain their prior purpose.

The existing Palace reader, styling, endpoint and personal-rank boundary are
unchanged. Palace remains available through palace-leaderboard.html. The new
consumer never reads a private board, account profile, token or own-rank field.

The fixed game origin is https://plankton-app-qgwhz.ondigitalocean.app.
Discovery uses GET /games/v1/catalog, contract
four-of-hearts.verified-results.v1/schemaVersion 1. Only exact catalog-advertised
/games/{canonicalGameId}/v1/public-leaderboard paths may be fetched, with
mode=ranked and limit=25. Requests omit credentials, referrers and caches and
reject redirects. Capability paths are validated but private paths are never
used. The board response must match the game, default board, rules, policy and
metric from discovery. PostgreSQL versions remain opaque decimal strings.

The consumer supports both source-defined tie policies: value/wins shared
competition ranks and earliest recorded best-result sequential ranks. It
does not supply a rating formula or assume that points are ratings. Null or
disabled policy/validator metadata produces an explicit unavailable state
without fabricated scores or successful-empty results. Genuine empty results
require a valid enabled board and eligibleCount 0. A disabled public policy or
changed rules/board/policy scope clears old rows immediately. Temporary errors
retain only same-scope public data with a visible stale message and Retry.

Known service policies are Hearts/Spades rating and Thumb Command's existing
mission-points policy. Thumb remains unavailable until its trusted validator
is actually ready. Gin has no established ranked metric in this contract;
Bobby, Evil Doom Boy and Sling still require their trusted result/ranking
integration. Website UI availability follows service metadata; it is not
activated by embedding fixture scores or frontend readiness flags.

Local verification:

    node scripts/build-site.mjs
    node --test scripts/game-leaderboards.test.mjs scripts/palace-leaderboard.test.mjs
    node scripts/validate-site.mjs
    node scripts/verify-game-leaderboards.cjs

The browser script uses an existing playwright-core installation (or the
PLAYWRIGHT_MODULE path) and an installed Chrome binary (CHROME_PATH optional).
Its website and API requests are intercepted from actual source and isolated
fixtures. It makes no production result, account, Auth0 or deployment write.
Fixtures in scripts/fixtures are test evidence and are never imported by the
website consumer. The catalog fixture and 32-eligible/25-row public fixture came
from the actual isolated PostgreSQL service proof, with no private context.

Results: 21 contract tests passed (11 shared and 10 Palace); 168-page static
validation passed; 27 browser cases passed with no page errors, credentialed
requests or private requests. Browser checks cover all seven pages, 320/390px
phones, tablet/wide/landscape views, unavailable/loading/empty/error/stale/retry,
text-only names, current versions, publication/scope changes and foreground
refresh within 10 seconds. Hidden pages pause; foreground entry refreshes.
These are local tests, not live release or human gameplay acceptance.

The review packet is saved alongside this checkout under evidence/website-browser,
including responsive images and results.json. Five inherited Git checkout
line-ending conversions were restored to exact remote Git blob bytes before
the final build. Their normalized content was identical; no existing CSS or
Palace consumer behavior was changed. The generated asset manifest also
refreshes two inherited stale CSS fingerprints against their unchanged files.

Root owns publication through the existing Pages main/root workflow. Compare
fresh remote main before any normal push; preserve concurrent changes. Deploy
and verify the shared catalog/public endpoints, exact 4ohi.com/www CORS and
real readiness before claiming populated boards work live. Do not seed data.
After website publication, verify its exact source and public URLs. A focused
website revert restores prior pages/navigation without altering account or
result ledgers. No new hosting, remote push or deployment was performed by
this preparation.
