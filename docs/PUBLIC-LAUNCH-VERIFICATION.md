# Public launch verification

Verification date: 2026-07-26

## DNS and hosting

- Authoritative nameservers: `ns71.domaincontrol.com`, `ns72.domaincontrol.com`.
- Both authoritative servers, Google Public DNS, and Cloudflare DNS returned the four documented GitHub Pages A records, four AAAA records, and `www` CNAME `paulchadha.github.io`.
- The retired GoDaddy Website Builder addresses are absent. Direct requests to each GitHub IPv4 edge served the current Four of Hearts site with `Server: GitHub.com`.
- GitHub Pages health reported both hostnames valid, served by Pages, HTTPS-eligible, and free of CAA errors.

## HTTPS and redirects

- Certificate state: approved for `4ohi.com` and `www.4ohi.com`, expiring 2026-10-23.
- GitHub Pages HTTPS enforcement: enabled only after strict certificate validation passed for both hostnames.
- `https://4ohi.com/` returns the site with no certificate warning. `https://www.4ohi.com/` redirects to the canonical apex.
- Plain HTTP reaches the canonical HTTPS origin. The apex redirects directly; `www` may traverse the cached apex canonicalization before the HTTPS redirect.

Historical pre-recovery evidence (resolved):
- Current TLS probe: both hostnames present `CN=*.github.io`, issued by Let’s Encrypt `YR2`, with SANs only for GitHub-owned names. Neither `4ohi.com` nor `www.4ohi.com` matches, so enforcement remains off. Google and Cloudflare return no CAA record, ruling out a published CAA authorization conflict.
- Current state supersedes the historical probe above: GitHub approved a certificate covering both hostnames and HTTPS enforcement is enabled.
- After more than one hour without a certificate request, GitHub's documented remove-and-re-add custom-domain procedure was used in Pages settings only. The new request progressed from `authorization_pending` to `approved` after the automatic Pages rebuild. DNS and Proton Mail records were not changed.

## Public browser acceptance

The Palace-first local and final public HTTPS acceptance runs loaded all 21 indexable pages plus the custom 404. They completed the six-chapter Palace preview, a friendly incorrect path, and both lessons for Hearts, Spades, and Euchre. They covered skip navigation, visible 44-pixel targets, 125-percent text zoom, reduced motion, and home, Palace, Palace tutorial, and News at 320, 360, 390, 412, 430, 768, 1366, and 1920 pixel widths without horizontal overflow. Results are in `docs/visual-evidence/palace-local-results.json` and `docs/visual-evidence/public-launch-results.json`.
## Palace-first recovery visual review

The rejected public baseline was studio-first: a conventional copy/image split, generic 4OH art in the hero, Palace below the first viewport, and large low-information dark regions. Automated correctness did not make that composition acceptable.

The recovered local homepage is materially different. It opens inside a full-bleed Palace world with the approved castle art, Palace name, `Rule the table.` direction, Internal Alpha state, Four of Hearts endorsement, News access, tutorial/discovery actions, animated cards, and the three-layer rhythm. Manual desktop and mobile crop review confirmed the castle is central and the phone viewport includes Palace, the headline, supporting copy, and the tutorial action.

Visual evidence is stored in `docs/visual-evidence/`: desktop, wide-desktop, phone, and tablet home; Palace product; active and full tutorial; history; News landing and article; More Games; and each policy/support route. The active tutorial evidence visibly includes readable rank/suit cards, rival reserve, pile, contextual feedback, and the continue/replay flow.

This visual review is separate from the machine-readable acceptance record and was not inferred from line counts.

Final HTTPS evidence was written to `docs/visual-evidence/public-launch-results.json` by:

```powershell
node scripts/verify-public-site.mjs
```

## Privacy and metadata

- Static validation covers titles, descriptions, canonical URLs, Open Graph metadata, social image, favicon, theme color, robots, sitemap, heading order, images, links, accessibility hooks, mixed-content source URLs, common tracking code, and secret patterns.
- Browser acceptance checks cookies, third-party requests, insecure requests, console errors, failed requests, responsive overflow, and custom 404 status.
- No account, form, analytics, ad technology, tracking pixel, remote font, local storage, or cookie is part of the site.

## Email preservation

- Proton MX, SPF, verification, DMARC, and three DKIM CNAME records were present and consistent on authoritative and public resolvers after cutover.
- The founder physically confirmed a fresh inbound message from an unrelated mailbox and successful reply from `support@4ohi.com` on 2026-07-25. No message content or private correspondent data was recorded. DNS evidence remains a separate preservation check.

## Domain ownership protection

Ownership protection is verified. The additive challenge TXT publicly returns `cb671e54e3d83a6de07c4ed963a882`, and the GitHub Pages API reports `protected_domain_state: verified`. The record uses its own hostname, did not replace a Proton record, and must remain published.

## Release and rollback

- GitHub Pages run `30182211280` successfully deployed the approved Palace release commit `c6a7590a69f312cb10a90978fd54fdce6e16d84b`.
- GitHub Pages run `30184458266` successfully deployed GitHub's automatic restored-CNAME commit `79e8a2831ddd27644052b065e225daaaf9d58c09` during certificate recovery.
- GitHub Pages run `30206574573` successfully deployed the Palace countdown campaign commit `235ec4571662003c9234585678fca469691f741e`; the complete public HTTPS browser suite passed afterward.
- Content rollback uses a new revert commit; history is never rewritten.
- Website DNS rollback removes only the GitHub A/AAAA records and restores the two documented GoDaddy Website Builder A records plus the prior `www` CNAME.
- Website rollback never touches Proton Mail or unrelated DNS records.

## Founder redesign local QA — July 26, 2026

The generated redesign passed static validation for 22 pages and the complete local browser suite. Evidence: `docs/visual-evidence/founder-redesign-local-results.json`; fresh homepage, Palace product, tutorial, history, newsroom, mobile, tablet, desktop, and wide-desktop screenshots are in `docs/visual-evidence/`. Public exact-SHA deployment and HTTPS rerun remain to be appended after push.
## Founder redesign public acceptance — July 26, 2026

- Site implementation SHA: `824081281695805ade6d37bd95d8eb920fbbbfa1`.
- QA/evidence SHA: `1e92d24c052217c30a4935e6664798d864bcdde7`.
- Documentation SHA deployed for this acceptance: `7c115ba4625e311ec3d1aa0d10ad41061be90b07`.
- GitHub Pages run `30208167171` completed successfully for that exact SHA.
- `https://4ohi.com`, secure `www`, and both HTTP forms end at canonical `https://4ohi.com/` with strict certificate verification result 0.
- Presented certificate: subject `CN=4ohi.com`; SANs `4ohi.com` and `www.4ohi.com`; issuer Let’s Encrypt YR1; validity July 26–October 24, 2026.
- GitHub Pages reports `https_enforced: true`, `protected_domain_state: verified`, `pending_domain_unverified_at: null`, and `status: built`.
- Public A and AAAA records are the four GitHub Pages addresses; `www` is `paulchadha.github.io`.
- Proton preservation check: MX remains `mail.protonmail.ch` priority 10 and `mailsec.protonmail.ch` priority 20; SPF and Proton verification TXT remain present. No DNS or mail record was changed.
- Full public browser suite: 21 content routes, 32 required responsive compositions, homepage countdown/logo/CTA, continuous Palace mini-match completion, ten burn, opponent pickup, four power cards, three levels, Palace/Shed/Easter-egg reset, three secondary tutorials, privacy center, custom 404, metadata, robots, sitemap, RSS, keyboard entry, 44-pixel targets, 125% text zoom, and reduced motion all passed.
- Public runtime: zero cookies, localStorage, sessionStorage, third-party requests, insecure requests, failed requests, mixed content, or console errors.
- Public transfer measurements: homepage 232,348 bytes at 1440×900; Palace tutorial 78,817 bytes at 390×844.
- Evidence: `docs/visual-evidence/founder-redesign-public-results.json` plus the refreshed screenshot set in `docs/visual-evidence/`.
## Founder experience evidence — July 26, 2026

Local integrated evidence is `visual-evidence/founder-experience-results.json` plus four mini-match screenshots. The gate passed 22 pages, eight viewports, ten locale/name combinations, full tutorial/replay, Easter-egg/reset, RTL, metadata, and zero-storage privacy. Public exact-SHA evidence must be rerun after push and Pages deployment.
## Founder experience production verification — July 26, 2026

- Product SHA `a9c2c33a7b7d8802a7db97050403f3eebbc6d008` deployed successfully in Pages run `30210204360`.
- The full production Chromium suite passed at `https://4ohi.com`: 22 pages, 8 responsive viewports, 10 locale/name combinations, complete mini-match and replay, private-name dialog/reset, RTL, metadata, and zero cookies/storage/external resources.
- Apex DNS resolves to the four GitHub Pages A and four AAAA addresses; `www` resolves to `paulchadha.github.io`.
- HTTP apex, HTTP www, and HTTPS www return 301 to canonical `https://4ohi.com/`.
- Both hostnames strictly validate the same Let's Encrypt certificate, negotiate TLS 1.3, and have no certificate warning. Certificate validity: July 26 through October 24, 2026.
- GitHub Pages reports `built`, `https_enforced: true`, `protected_domain_state: verified`, and no pending unverified date.
- Proton MX 10/20, SPF, verification TXT, DMARC quarantine, and all three DKIM CNAME selectors remain public and unchanged.
- The founder confirmed support email is working. This confirmation, rather than DNS inference, is the mailbox delivery evidence for this release.
- No DNS, Proton, DigitalOcean, PalaceApp, or native-game configuration was changed by the founder website recovery.

## July 26 app-parity candidate

Local candidate evidence is recorded in `docs/visual-evidence/app-parity-results.json` with first-viewport and tutorial screenshots listed in `APP-PARITY-AND-PAGE-HIERARCHY.md`. It covers 23 pages, nine locale/name states, all four tutorials, physical power cards, RTL, responsive geometry, the traditional-name confirmation, and zero storage. Public exact-SHA results must be appended after GitHub Pages deploys this candidate.

## App-parity exact-SHA public verification — 2026-07-26

- Public source SHA: `701cf3f234e40e72dd7f0dfc5f357c1bea881c95`.
- GitHub Pages run: `30213379342`; build, status report, and deploy jobs completed successfully for that exact SHA.
- Authenticated Pages state: `status: built`, `cname: 4ohi.com`, `https_enforced: true`, `protected_domain_state: verified`, source `main:/`.
- Ownership TXT: `_github-pages-challenge-paulchadha.4ohi.com = cb671e54e3d83a6de07c4ed963a882` on the GoDaddy authoritative server, Cloudflare `1.1.1.1`, and Google `8.8.8.8`.
- Apex A and AAAA records match all eight GitHub Pages endpoints; `www` is `paulchadha.github.io` on authoritative, Cloudflare, and Google resolution.
- HTTP apex, HTTP www, and HTTPS www each return `301` to `https://4ohi.com/`; HTTPS apex returns `200`.
- Strict TLS trust and hostname validation passes for both names with one Let's Encrypt certificate, SANs `4ohi.com` and `www.4ohi.com`, TLS 1.3, valid from 2026-07-26 through 2026-10-24.
- Public Playwright acceptance passed 23 pages, nine locale/name states, all four tutorials, physical power cards, RTL, responsive first viewports, traditional-name confirmation, and zero cookies/storage/external resources.
- `robots.txt`, `sitemap.xml`, and `feed.xml` return `200`; an unknown path returns HTTP `404` with the custom card-not-found page.
- No certificate warning, mixed-content request, browser error, tracker, external script, or persisted preference was observed.
- The founder confirmed `support@4ohi.com` inbound and reply operation in this release thread. DNS verification separately confirms both Proton MX records, SPF, Proton verification, DMARC quarantine, and all three DKIM selectors unchanged.

Public browser evidence: `docs/visual-evidence/app-parity-public-results.json`.
## Immersive presentation verification — 2026-07-31

Local browser gates passed for eight opening viewport sizes and 28 route/viewports. Required first-screen Palace art, countdown, Play, latest News, name control, language control, and 4OH identity were programmatically confirmed. Public verification must be repeated against the exact deployed SHA after push and recorded with the final production run.
## Public deployment evidence — 2026-07-31

- Deployed implementation SHA: `912b512d09c279be5b910a42f6c6f2fb91406237` (GitHub Pages build status `built`).
- `https://4ohi.com/`: 200 from GitHub Pages.
- `http://4ohi.com/`, `http://www.4ohi.com/`, and `https://www.4ohi.com/`: 301 to `https://4ohi.com/`.
- GitHub Pages: custom domain `4ohi.com`, `https_enforced: true`, `protected_domain_state: verified`.
- Certificate: approved for `4ohi.com` and `www.4ohi.com`, expiry reported as 2026-10-23.
- DNS: four GitHub Pages A records, four GitHub Pages AAAA records, and `www` CNAME to `paulchadha.github.io` confirmed.
- Public browser gates: 20 routes × 7 viewport profiles; eight opening viewports; 28 immersive route/viewports; gallery keyboard/touch-equivalent controls; localization; Palace scope; privacy; and overflow all passed.
- Runtime payload observed by the public immersive gate: 275,777 bytes of local CSS and JavaScript.
