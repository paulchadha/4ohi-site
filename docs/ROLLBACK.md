# Website rollback procedure

Use GitHub history, never a force push or destructive reset. Identify the last known-good public commit and its successful Pages run. Create a new normal revert commit for the specific change, run the generator twice, static validation, browser acceptance, privacy/secret scans, and `git diff --check`, then push main. Wait for the exact revert SHA to deploy and verify HTTPS, canonical redirects, assets, and the public acceptance suite.

Do not change DNS or Proton Mail records for a content rollback. The custom domain, verified ownership TXT, MX, SPF, DKIM, DMARC, and Proton verification records are outside a website-code rollback.
## Founder experience rollback

Revert the focused website commits only, rebuild, push, and wait for the reverted exact SHA on GitHub Pages. Do not change A/AAAA/CNAME, GitHub domain verification TXT, Proton MX/SPF/DKIM/DMARC, DigitalOcean, or PalaceApp to roll back website presentation.

## App-parity rollback unit

Treat the generator, `palace-app-web.css`, `product-authority.js`, `release-strip.js`, `power-cards.js`, FAQ page, generated HTML, and app-parity documentation as one release unit. To roll back, revert the focused release commits rather than deleting generated pages or changing DNS. Rebuild from the reverted generator, validate locally, push normally, wait for the exact-SHA Pages run, and repeat public HTTPS QA. Do not touch Proton Mail or GitHub Pages DNS records for a visual/content rollback.


## Fingerprinted front-end rollback

Revert the website commit, rebuild generated pages so asset hashes match the reverted contents, push, and wait for the exact SHA. Do not change DNS or Proton mail records for this front-end-only rollback.


## Page reconstruction rollback

Revert the focused website commits, rebuild generated documents and fingerprint manifest, push, wait for exact SHA, and rerun canonical route, game, and privacy tests. DNS, Proton mail, DigitalOcean, and native apps are outside this rollback.
## Immersive release rollback — 2026-07-31

Revert the focused immersive release commit and rebuild. The rollback unit is the two `immersive-world` assets, the homepage generator changes, generated HTML, verifier, evidence, and related documentation. No DNS, Proton Mail, native game, DigitalOcean, or other repository change is part of this release.

## Immersive reconstruction rollback — 2026-08-29

Rollback is a normal revert of the focused redesign/test/documentation commits followed by an exact-SHA Pages deployment check. Do not force-push, delete evidence, modify DNS, or alter mail records. Rebuild after a revert so generated pages and asset hashes remain synchronized.