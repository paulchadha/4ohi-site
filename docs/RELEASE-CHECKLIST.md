# Release checklist

Last run: 2026-07-26

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
- [x] Palace, approved castle art, the real four-heart 4OH emblem, launch countdown, campaign headline, and 60-second play action dominate the first desktop viewport.
- [x] At 390×844, Palace art, title, supporting copy, and the primary tutorial action remain visible in the opening viewport.
- [x] Manual visual review confirms the rejected studio-first split hero is gone and the page reads as a Palace destination.
- [x] Active tutorial evidence shows readable cards, rival state, pile, feedback, and game-like table composition.
- [x] Internal links, scripts, and `mailto:` links pass `scripts/validate-site.mjs`.
- [x] Each page has one H1 and appropriate landmarks; the 404 page is `noindex`.
- [x] Keyboard focus is visible, primary targets are at least 44 pixels high, tabs support arrow keys, and reduced motion is respected.
- [x] Images have alt text and loaded successfully.
- [x] Home, Palace, Palace tutorial, and News have no horizontal overflow at 320, 360, 390, 412, 430, 768, 1366, or 1920 pixel widths; 125-percent text zoom also passes.
- [x] Palace low-card feedback plus match, beat, wild, and completion states were completed in browser automation.
- [x] Both teaching decisions and the `Nice play.` completion state were reached for Hearts, Spades, and Euchre.
- [x] Titles, descriptions, canonical URLs, Open Graph data, social image, favicon, theme color, robots, and sitemap are present.
- [x] Browser checks found no console errors, failed resources, mixed content, first-party cookies, or tracking requests.
- [x] `git diff --check`, JavaScript syntax, and the repository secret scan pass.
- [x] Every generated page includes the tested same-origin CSP with hashed JSON-LD; static validation rejects inline handlers, leaked filesystem paths, dynamic code execution, common secrets, and insecure assets.
- [x] Local cold-context weight is 277,427 bytes for desktop home and 123,019 bytes for the mobile Palace tutorial after the launch campaign and approved-logo assets.
- [ ] Physical-device acceptance testing remains separate from browser simulation.

## Deployment and DNS

- [x] Palace countdown campaign commit `235ec4571662003c9234585678fca469691f741e` was deployed successfully by Pages run `30206574573`; public HTTPS acceptance passed against that exact release.
- [x] GitHub Pages custom domain is `4ohi.com`; repository `CNAME` matches.
- [x] Pages source is `main` at repository root and the prior release workflow is green.
- [x] HTTPS enforcement remained off throughout DNS propagation and while the certificate was not valid.
- [x] The website-only DNS change was limited to the documented apex A/AAAA and `www` CNAME records; Proton Mail and unrelated records were preserved.
- [ ] Export the authenticated GoDaddy zone immediately before cutover.
- [x] Apply only the documented website A/AAAA and `www` CNAME changes.
- [x] Confirm authoritative and public propagation to GitHub Pages and removal of the GoDaddy placeholder.
- [x] Confirm matching apex and `www` certificates, canonical redirects, and absence of TLS warnings.
- [x] Enable HTTPS enforcement only after certificate provisioning.
- [x] Founder physically confirmed a fresh unrelated-mailbox inbound message and reply from `support@4ohi.com`; no message content was retained.
- [x] Add and retain GitHub Pages account-level domain-verification TXT protection; public TXT and Pages `protected_domain_state: verified` are confirmed.

## Evidence

- Palace local browser results: `docs/visual-evidence/palace-local-results.json`
- Public launch record: `docs/PUBLIC-LAUNCH-VERIFICATION.md`
- Final HTTPS browser results: `docs/visual-evidence/public-launch-results.json` (passing)
- Current screenshots: `palace-home-1440x900.png`, `palace-tutorial-390x844.png`, and `news-390x844.png` in `docs/visual-evidence/`
- Automated validation: `node scripts/validate-site.mjs`

## Founder-directed redesign gates

- [x] Palace, canonical logo, immersive art, countdown, Internal Alpha status, tutorial action, discovery action, and News access appear in the first viewport.
- [x] Rejected block-heavy Palace sections replaced with immersive chapters and full-width rules/story composition.
- [x] About page tells the four-daughter and smiles story; founder claims are qualified and recorded for approval.
- [x] Palace story separates sourced fact, table tradition, legend, product rules, and hyperbole.
- [x] Session-only Palace/Shed setting and ten-tap founder Easter egg reset on refresh and use no storage.
- [x] Five-scene tutorial verifies recoverable mistake, match, ten burn, opponent pickup, all power cards, three levels, replay/completion links.
- [x] Privacy Choices center accurately reports zero optional tracking/storage.
- [x] Local browser suite passed 21 routes, 32 viewport checks, three secondary tutorials, reduced motion, metadata/discovery, zero cookies/storage/third-party requests/console errors/failed requests.
- [x] Exact-SHA public deployment and public HTTPS acceptance recorded after commit/push.
- [ ] Founder factual approvals and qualified legal/history review completed before commercial reliance.
## Founder experience release gate

- [x] Field Training removed and continuous mini-match implemented.
- [x] Eight locale routes and RTL behavior verified locally.
- [x] Palace/Shed/private-name URL-state behavior verified locally.
- [x] Canadian-fun copy reviewed for affectionate, non-degrading tone.
- [x] Founder story integrated with claim boundaries.
- [x] Local semantic and Chromium gates passed.
- [x] Exact-SHA GitHub Pages product deployment `a9c2c33` verified publicly in run `30210204360`.

## July 26 app-parity gates

- [x] Shared generator produces 23 public HTML pages plus sitemap and RSS.
- [x] Static validation passes links, email links, metadata, CSP, images, tracking, mixed content, accessibility hooks, and secret scan.
- [x] Browser QA passes 23 pages and nine locale/name combinations.
- [x] News featured story and More Games shelf are visible in the first 1440Ã—900 viewport.
- [x] 2â™£, 7â™¦, 8â™ , and 10â™¥ physical-card interactions pass.
- [x] Palace plus Hearts, Spades, and Euchre tutorial completion passes.
- [x] Ten-tap traditional-name confirmation and reset behavior pass.
- [x] Cookies, local storage, session storage, and external resources remain empty.
- [x] Exact SHA `701cf3f234e40e72dd7f0dfc5f357c1bea881c95` deployed successfully and the full browser suite passed at `https://4ohi.com`.


## Founder correction gate

Before release, run `node scripts/build-site.mjs`, `node scripts/validate-site.mjs`, and `node scripts/verify-app-parity.mjs`. Require exact-SHA Pages deployment, then repeat the browser suite publicly. Founder physical-phone review remains a separate required acceptance item.


## Page-by-page reconstruction gate

Require one canonical homepage/countdown, a state-preserving legacy redirect, non-intersecting Power Cards, distinct News dates, five About beats, approved founder wording, complete Palace setup/levels, game-specific four-seat tables, responsive/keyboard/privacy passes, exact-SHA Pages success, and a public rerun.
