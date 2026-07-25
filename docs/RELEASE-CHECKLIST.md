# Release checklist

## Content and legal

- [ ] Company name is “Four of Hearts Interactive, LLC.”
- [ ] Game availability claims match reality.
- [ ] Privacy policy matches current app, server, hosting, email, and crash-reporting behavior.
- [ ] Terms receive legal review before public commercial launch.
- [ ] No home address, secret, internal endpoint, or private screenshot is published.
- [ ] All four company email addresses are operational before publishing them as contact channels.

## Site quality

- [ ] `index.html`, `games.html`, `support.html`, `privacy.html`, `security.html`, `terms.html`, `contact.html`, and `404.html` load.
- [ ] All internal links resolve.
- [ ] All `mailto:` links use the intended address.
- [ ] Heading order and landmarks are sensible.
- [ ] Keyboard focus is visible and every interactive element is reachable.
- [ ] Text and controls meet WCAG AA contrast.
- [ ] Images have appropriate alt text; decorative images use empty alt text.
- [ ] Reduced-motion preference is respected.
- [ ] Layout passes at 320×568, 360×800, 390×844, 430×932, 768×1024, and desktop widths.
- [ ] Favicon, title, description, canonical, Open Graph, and theme color are present.
- [ ] 404 behavior is appropriate.
- [ ] No console errors, broken images, mixed content, tracking requests, or unexpected cookies.

## Deployment and DNS

- [x] Repository is clean and all commits are pushed.
- [x] GitHub Pages deployment is green at the temporary URL.
- [ ] Pre-change DNS is exported.
- [ ] Apex and `www` use GitHub's current documented values.
- [ ] `https://4ohi.com/` has a valid certificate.
- [ ] `www` redirects to the apex.
- [ ] MX, SPF, DKIM, DMARC, and Proton verification remain intact.

## Email

- [ ] Proton verifies the custom domain.
- [ ] Required addresses and display names exist; catch-all is off.
- [ ] External inbound mail reaches support, privacy, and security.
- [ ] Support reply and Paul outbound mail reach an external mailbox.
- [ ] SPF, DKIM, and DMARC pass.
- [ ] Exactly one root SPF record and one DMARC record exist.

## Documentation

- [ ] Account settings, records, reasons, verification, rollback, responsible accounts, renewals, and limitations reflect reality.
- [ ] Links and commands are tested.
- [ ] No secret is committed.
- [ ] Full commit hashes and messages are captured in the launch report.
