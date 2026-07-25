# Four of Hearts Interactive website

Public company website for Four of Hearts Interactive, LLC and `4ohi.com`.

## Current product state

- Palace, Hearts, Spades, and Euchre are in Internal Alpha.
- Public app-store availability is not claimed and no download badges are shown.
- `play.html` offers two short, no-stakes teaching choices for each game; these are tutorials, not full game builds.
- Player, privacy, security, and general inquiries currently use `support@4ohi.com`.

## Architecture

- Dependency-free static HTML, CSS, and JavaScript generated from shared templates; no framework or production runtime.
- `scripts/build-site.mjs` generates 22 HTML pages plus sitemap and RSS from shared navigation, metadata, and `content/news.json`.
- All tutorials keep progress only in page memory. They use no account, storage, form, API, or network request beyond static site assets.
- No analytics, advertising, tracking pixels, remote fonts, or first-party cookies.
- GitHub Pages publishes `main` from the repository root.
- Canonical hostname: `https://4ohi.com/`; `www.4ohi.com` redirects to the apex.

## Local preview and validation

```powershell
node scripts/build-site.mjs
python -m http.server 8080
node scripts/validate-site.mjs
```

Open `http://localhost:8080/`. The validation script checks every generated page, internal and email links, scripts, metadata, images, heading order, accessibility hooks, CNAME, sitemap, mixed content, tracking code, and common secret patterns.

Browser acceptance covers the six-chapter Palace preview, all three two-round supporting lessons, a friendly incorrect choice, phone through desktop widths, 125-percent text zoom, keyboard entry, reduced motion, and zero console or request errors.

## Deployment

Push reviewed changes to `main`. GitHub Pages deploys the repository root. Wait for the `pages-build-deployment` workflow, confirm its head SHA matches the pushed commit, and verify every public page.

The `CNAME` file is set to `4ohi.com`, and the apex plus `www` resolve to GitHub Pages. Public-launch evidence and any remaining external verification are recorded in the release checklist and operations documents.

Run the public-domain browser acceptance suite with Playwright available on `NODE_PATH`:

```powershell
node scripts/verify-public-site.mjs
```

Never change MX, SPF, DKIM, DMARC, provider verification, or unrelated TXT records during a website release.

## Operations documentation

- [Domain and DNS](docs/DOMAIN-AND-DNS.md)
- [Email operations](docs/EMAIL-OPERATIONS.md)
- [Website deployment](docs/WEBSITE-DEPLOYMENT.md)
- [Security and account recovery](docs/SECURITY-AND-ACCOUNT-RECOVERY.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)
- [Public launch verification](docs/PUBLIC-LAUNCH-VERIFICATION.md)
- [Brand assets](docs/BRAND-ASSETS.md)
- [Privacy policy review](docs/PRIVACY-POLICY-REVIEW.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Palace tutorial](docs/PALACE-TUTORIAL.md)
- [Palace history sources](docs/PALACE-HISTORY-SOURCES.md)
- [News authoring](docs/NEWS-AUTHORING.md)
- [Social links](docs/SOCIAL-LINKS.md)
- [Performance](docs/PERFORMANCE.md)

Never commit credentials, tokens, recovery codes, private keys, private correspondence, or account exports.