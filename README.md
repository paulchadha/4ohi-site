# Four of Hearts Interactive website

Public company website for Four of Hearts Interactive, LLC and `4ohi.com`.

## Current product state

- Palace, Hearts, Spades, and Euchre are in Internal Alpha.
- Public app-store availability is not claimed and no download badges are shown.
- Player, privacy, security, and general inquiries currently use `support@4ohi.com`.

## Architecture

- Plain semantic HTML and CSS; no build step, framework, client JavaScript, forms, or runtime dependencies.
- No analytics, advertising, tracking pixels, remote fonts, or first-party cookies.
- GitHub Pages publishes `main` from the repository root.
- Canonical hostname: `https://4ohi.com/`; `www.4ohi.com` should redirect to the apex after DNS cutover.

## Local preview and validation

```powershell
python -m http.server 8080
node scripts/validate-site.mjs
```

Open `http://localhost:8080/`. The validation script checks pages, internal and email links, metadata, images, accessibility hooks, CNAME, sitemap, mixed content, tracking code, and common secret patterns.

## Deployment

Push reviewed changes to `main`. GitHub Pages deploys the repository root. Wait for the `pages-build-deployment` workflow, confirm its head SHA matches the pushed commit, and verify every public page.

The `CNAME` file is already set to `4ohi.com`, but the apex and `www` still point to the GoDaddy placeholder. Do not enable HTTPS enforcement until website DNS points to GitHub and GitHub provisions matching certificates.

Never change MX, SPF, DKIM, DMARC, Proton verification, or unrelated TXT records during a website release.

## Operations documentation

- [Domain and DNS](docs/DOMAIN-AND-DNS.md)
- [Email operations](docs/EMAIL-OPERATIONS.md)
- [Website deployment](docs/WEBSITE-DEPLOYMENT.md)
- [Security and account recovery](docs/SECURITY-AND-ACCOUNT-RECOVERY.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)
- [Brand assets](docs/BRAND-ASSETS.md)
- [Privacy policy review](docs/PRIVACY-POLICY-REVIEW.md)

Never commit credentials, tokens, recovery codes, private keys, private correspondence, or account exports.