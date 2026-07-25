# Four of Hearts Interactive website

Public company website for Four of Hearts Interactive, LLC and `4ohi.com`.

## Current product state

- Palace, Hearts, Spades, and Euchre are in Internal Alpha.
- Public app-store availability is not claimed and no download badges are shown.
- `play.html` offers two short, no-stakes teaching choices for each game; these are tutorials, not full game builds.
- Player, privacy, security, and general inquiries currently use `support@4ohi.com`.

## Architecture

- Plain semantic HTML and CSS with one dependency-free JavaScript file for Quick Play; no build step or framework.
- Quick Play keeps progress only in page memory. It uses no account, storage, form, API, or network request beyond static site assets.
- No analytics, advertising, tracking pixels, remote fonts, or first-party cookies.
- GitHub Pages publishes `main` from the repository root.
- Canonical hostname: `https://4ohi.com/`; `www.4ohi.com` should redirect to the apex after DNS cutover.

## Local preview and validation

```powershell
python -m http.server 8080
node scripts/validate-site.mjs
```

Open `http://localhost:8080/`. The validation script checks all nine pages, internal and email links, scripts, metadata, images, heading order, accessibility hooks, CNAME, sitemap, mixed content, tracking code, and common secret patterns.

Quick Play browser acceptance should cover a friendly incorrect choice, both rounds of all four tutorials, the four-heart completion state, tab arrow keys, phone through desktop widths, reduced motion, and zero console or request errors.

## Deployment

Push reviewed changes to `main`. GitHub Pages deploys the repository root. Wait for the `pages-build-deployment` workflow, confirm its head SHA matches the pushed commit, and verify every public page.

The `CNAME` file is already set to `4ohi.com`, but the apex and `www` still point to the GoDaddy placeholder. Do not enable HTTPS enforcement until website DNS points to GitHub and GitHub provisions matching certificates.

Never change MX, SPF, DKIM, DMARC, provider verification, or unrelated TXT records during a website release.

## Operations documentation

- [Domain and DNS](docs/DOMAIN-AND-DNS.md)
- [Email operations](docs/EMAIL-OPERATIONS.md)
- [Website deployment](docs/WEBSITE-DEPLOYMENT.md)
- [Security and account recovery](docs/SECURITY-AND-ACCOUNT-RECOVERY.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)
- [Brand assets](docs/BRAND-ASSETS.md)
- [Privacy policy review](docs/PRIVACY-POLICY-REVIEW.md)

Never commit credentials, tokens, recovery codes, private keys, private correspondence, or account exports.