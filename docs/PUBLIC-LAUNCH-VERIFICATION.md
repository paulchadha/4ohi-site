# Public launch verification

Verification date: 2026-07-25

## DNS and hosting

- Authoritative nameservers: `ns71.domaincontrol.com`, `ns72.domaincontrol.com`.
- Both authoritative servers, Google Public DNS, and Cloudflare DNS returned the four documented GitHub Pages A records, four AAAA records, and `www` CNAME `paulchadha.github.io`.
- The retired GoDaddy Website Builder addresses are absent. Direct requests to each GitHub IPv4 edge served the current Four of Hearts site with `Server: GitHub.com`.
- GitHub Pages health reported both hostnames valid, served by Pages, HTTPS-eligible, and free of CAA errors.

## HTTPS and redirects

- Certificate state: pending GitHub issuance.
- HTTPS enforcement: intentionally disabled until the certificate matches both hostnames.
- Final apex HTTPS, `www` canonical redirect, HTTP-to-HTTPS, certificate, and mixed-content checks: pending.

## Public browser acceptance

The Palace-first local acceptance run loaded all 21 indexable pages plus the custom 404. It completed the six-chapter Palace preview, a friendly incorrect path, and both lessons for Hearts, Spades, and Euchre. It covered skip navigation, visible 44-pixel targets, 125-percent text zoom, reduced motion, and home, Palace, Palace tutorial, and News at 320, 360, 390, 412, 430, 768, 1366, and 1920 pixel widths without horizontal overflow. Results are in `docs/visual-evidence/palace-local-results.json`.

Final HTTPS evidence will be written to `docs/visual-evidence/public-launch-results.json` by:

```powershell
node scripts/verify-public-site.mjs
```

## Privacy and metadata

- Static validation covers titles, descriptions, canonical URLs, Open Graph metadata, social image, favicon, theme color, robots, sitemap, heading order, images, links, accessibility hooks, mixed-content source URLs, common tracking code, and secret patterns.
- Browser acceptance checks cookies, third-party requests, insecure requests, console errors, failed requests, responsive overflow, and custom 404 status.
- No account, form, analytics, ad technology, tracking pixel, remote font, local storage, or cookie is part of the site.

## Email preservation

- Proton MX, SPF, verification, DMARC, and three DKIM CNAME records were present and consistent on authoritative and public resolvers after cutover.
- A fresh unrelated-mailbox inbound message and reply from `support@4ohi.com` are pending company confirmation. DNS evidence alone is not treated as send/receive proof.

## Domain ownership protection

Ownership protection is verified. The additive challenge TXT publicly returns `cb671e54e3d83a6de07c4ed963a882`, and the GitHub Pages API reports `protected_domain_state: verified`. The record uses its own hostname, did not replace a Proton record, and must remain published.

## Release and rollback

- GitHub Pages run `30177242400` successfully deployed commit `44dd907d119e32f525d5e11511e7633e0410fb4d`.
- Content rollback uses a new revert commit; history is never rewritten.
- Website DNS rollback removes only the GitHub A/AAAA records and restores the two documented GoDaddy Website Builder A records plus the prior `www` CNAME.
- Website rollback never touches Proton Mail or unrelated DNS records.
