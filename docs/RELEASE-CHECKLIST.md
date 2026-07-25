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

- [x] All nine HTML pages load in the local browser preview.
- [x] Internal links, scripts, and `mailto:` links pass `scripts/validate-site.mjs`.
- [x] Each page has one H1 and appropriate landmarks; the 404 page is `noindex`.
- [x] Keyboard focus is visible, primary targets are at least 44 pixels high, tabs support arrow keys, and reduced motion is respected.
- [x] Images have alt text and loaded successfully.
- [x] Home and Quick Play have no horizontal overflow at 320×568, 360×800, 390×844, 430×932, 768×1024, 1366×768, or 1920×1080.
- [x] A friendly incorrect choice and both rounds of Palace, Hearts, Spades, and Euchre were completed in browser automation.
- [x] The four-heart “table legend” completion state was reached.
- [x] Titles, descriptions, canonical URLs, Open Graph data, social image, favicon, theme color, robots, and sitemap are present.
- [x] Browser checks found no console errors, failed resources, mixed content, first-party cookies, or tracking requests.
- [x] `git diff --check`, JavaScript syntax, and the repository secret scan pass.
- [ ] Physical-device acceptance testing remains separate from browser simulation.

## Deployment and DNS

- [ ] Interactive-edition commits are pushed and Pages matches the final commit.
- [x] GitHub Pages custom domain is `4ohi.com`; repository `CNAME` matches.
- [x] Pages source is `main` at repository root and the prior release workflow is green.
- [x] HTTPS enforcement remains off while DNS and certificate prerequisites are unmet.
- [x] No DNS or email setting was changed in this website work.
- [ ] Export the authenticated GoDaddy zone immediately before cutover.
- [ ] Apply only the documented website A/AAAA and `www` CNAME changes.
- [ ] Confirm propagation, certificates, apex canonical URL, and `www` redirect.
- [ ] Enable HTTPS enforcement only after certificate provisioning.

## Evidence

- Browser results: `docs/visual-evidence/browser-results.json`
- Current screenshots: `v2-home-320x568`, `v2-home-1366x768`, `v2-play-390x844`, `v2-play-1366x768`, and `v2-tour-complete-1440x900` in `docs/visual-evidence/`
- Automated validation: `node scripts/validate-site.mjs`