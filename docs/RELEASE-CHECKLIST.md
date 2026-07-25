# Release checklist

Last run: 2026-07-25

## Content and legal

- [x] Company name is “Four of Hearts Interactive, LLC.”
- [x] All four games are described as Internal Alpha; no public download claim or store badge is shown.
- [x] Quick Play is clearly described as teaching puzzles rather than full games, gambling, or competitive play.
- [x] `support@4ohi.com` is the only published email address and is operational per company confirmation.
- [x] No home address, private phone, secret, internal endpoint, or private screenshot is published.
- [x] Privacy and terms pages plainly identify their current alpha scope.
- [ ] Privacy Policy and Terms receive qualified legal review before public commercial launch.
- [ ] Final trademark and source-art provenance review is completed for the supplied brand board.

## Site quality

- [x] All 21 indexable HTML pages plus the custom 404 load in the local browser preview.
- [x] Internal links, scripts, and `mailto:` links pass `scripts/validate-site.mjs`.
- [x] Each page has one H1 and appropriate landmarks; the 404 page is `noindex`.
- [x] Keyboard focus is visible, primary targets are at least 44 pixels high, tabs support arrow keys, and reduced motion is respected.
- [x] Images have alt text and loaded successfully.
- [x] Home, Palace, Palace tutorial, and News have no horizontal overflow at 320, 360, 390, 412, 430, 768, 1366, or 1920 pixel widths; 125-percent text zoom also passes.
- [x] The Palace friendly-error branch and all six chapters were completed in browser automation.
- [x] Both teaching decisions and the `Nice play.` completion state were reached for Hearts, Spades, and Euchre.
- [x] Titles, descriptions, canonical URLs, Open Graph data, social image, favicon, theme color, robots, and sitemap are present.
- [x] Browser checks found no console errors, failed resources, mixed content, first-party cookies, or tracking requests.
- [x] `git diff --check`, JavaScript syntax, and the repository secret scan pass.
- [ ] Physical-device acceptance testing remains separate from browser simulation.

## Deployment and DNS

- [x] Interactive-edition commits are pushed and the current Pages deployment matches commit `44dd907d119e32f525d5e11511e7633e0410fb4d`.
- [x] GitHub Pages custom domain is `4ohi.com`; repository `CNAME` matches.
- [x] Pages source is `main` at repository root and the prior release workflow is green.
- [x] HTTPS enforcement remained off throughout DNS propagation and while the certificate was not valid.
- [x] The website-only DNS change was limited to the documented apex A/AAAA and `www` CNAME records; Proton Mail and unrelated records were preserved.
- [ ] Export the authenticated GoDaddy zone immediately before cutover.
- [x] Apply only the documented website A/AAAA and `www` CNAME changes.
- [x] Confirm authoritative and public propagation to GitHub Pages and removal of the GoDaddy placeholder.
- [ ] Confirm matching apex and `www` certificates, canonical redirects, and absence of TLS warnings.
- [ ] Enable HTTPS enforcement only after certificate provisioning.
- [ ] Complete a fresh inbound-and-reply delivery test for `support@4ohi.com`.
- [x] Add and retain GitHub Pages account-level domain-verification TXT protection; public TXT and Pages `protected_domain_state: verified` are confirmed.

## Evidence

- Palace local browser results: `docs/visual-evidence/palace-local-results.json`
- Public launch record: `docs/PUBLIC-LAUNCH-VERIFICATION.md`
- Final HTTPS browser results: `docs/visual-evidence/public-launch-results.json`
- Current screenshots: `palace-home-1440x900.png`, `palace-tutorial-390x844.png`, and `news-390x844.png` in `docs/visual-evidence/`
- Automated validation: `node scripts/validate-site.mjs`