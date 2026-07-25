# Release checklist

Last run: 2026-07-25

## Content and legal

- [x] Company name is “Four of Hearts Interactive, LLC.”
- [x] All four games are described as Internal Alpha; no public download claim or store badge is shown.
- [x] `support@4ohi.com` is the only published email address and is operational per company confirmation.
- [x] No home address, private phone, secret, internal endpoint, or private screenshot is published.
- [x] Privacy and terms pages plainly identify their current alpha scope.
- [ ] Privacy Policy and Terms receive qualified legal review before public commercial launch.

## Site quality

- [x] All eight HTML pages load in the local browser preview.
- [x] Internal links and `mailto:` links pass `scripts/validate-site.mjs`.
- [x] Each page has one H1 and appropriate landmarks; the 404 page is `noindex`.
- [x] Keyboard focus is visible, primary targets are at least 44 pixels high, and reduced motion is respected.
- [x] Images have alt text and loaded successfully.
- [x] Layout has no horizontal overflow at 320×568, 360×800, 390×844, 430×932, 768×1024, 1366×768, or 1920×1080.
- [x] Titles, descriptions, canonical URLs, Open Graph data, social image, favicon, theme color, robots, and sitemap are present.
- [x] Browser checks found no console errors, failed resources, mixed content, first-party cookies, or tracking requests.
- [x] `git diff --check` and the repository secret scan pass.
- [ ] Physical-device acceptance testing remains separate from browser simulation.

## Deployment and DNS

- [x] Release commits are pushed; Pages workflow `30175139178` succeeded for `874e28deb1a917bc050854cbc1c3b0a6de754e20`.
- [x] GitHub Pages custom domain is `4ohi.com`; repository `CNAME` matches.
- [x] Pages source is `main` at repository root and the pre-release workflow is green.
- [x] Public DNS baseline was reconfirmed through Google and Cloudflare resolvers.
- [x] HTTPS enforcement remains off while DNS and certificate prerequisites are unmet.
- [x] MX, SPF, and DMARC answers were preserved; no DNS mutation occurred.
- [ ] Export the authenticated GoDaddy zone immediately before cutover.
- [ ] Apply only the documented website A/AAAA and `www` CNAME changes.
- [ ] Confirm propagation, certificates, apex canonical URL, and `www` redirect.
- [ ] Enable HTTPS enforcement only after certificate provisioning.

## Account and email operations

- [x] `support@4ohi.com` operational state is documented.
- [ ] Verify mail-provider 2FA, recovery, aliases, DKIM, and message-level SPF/DKIM/DMARC results in an authorized review.
- [ ] Verify GitHub and GoDaddy 2FA, recovery contacts, domain auto-renew, and billing in authenticated accounts.
- [x] Repository contains no credentials, recovery codes, private keys, or private correspondence.

## Evidence

- Browser results: `docs/visual-evidence/browser-results.json`
- Screenshots: `docs/visual-evidence/home-320x568.png`, `home-768x1024.png`, and `home-1366x768.png`
- Automated validation: `node scripts/validate-site.mjs`