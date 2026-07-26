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
- Content rollback uses a new revert commit; history is never rewritten.
- Website DNS rollback removes only the GitHub A/AAAA records and restores the two documented GoDaddy Website Builder A records plus the prior `www` CNAME.
- Website rollback never touches Proton Mail or unrelated DNS records.
