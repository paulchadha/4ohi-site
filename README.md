# Four of Hearts Interactive website

Public company website for Four of Hearts Interactive, LLC and `4ohi.com`.

## Company and games

- Four of Hearts Interactive is the parent brand; `4OH` is the approved compact mark.
- Palace is a game with an interactive five-scene website preview.
- Commander ThumB is an original Coming Soon arcade-defense game. No public-play, store, or release-date claim is made.
- Hearts, Spades, and Euchre remain Internal Alpha and each has a two-step website lesson.
- The reusable catalog lives in `scripts/game-catalog.mjs`.

## Architecture

- Dependency-free static HTML, CSS, and JavaScript generated from shared templates.
- `scripts/build-site.mjs` generates 28 public documents plus sitemap and RSS from shared company navigation, metadata, the game catalog, Commander content, and `content/news.json`.
- The root route is the Four of Hearts Interactive company homepage. Palace and Commander ThumB appear as peer offerings.
- Company navigation is Home, Games, News, About 4OH, and Support. Palace naming controls exist only in the Play Palace context.
- All tutorials keep progress only in page memory. There is no account, backend form, cookie, browser storage, analytics, advertising, tracking pixel, social widget, or remote font.
- GitHub Pages publishes `main` from the repository root with canonical hostname `https://4ohi.com/`.

See [WEBSITE_INFORMATION_ARCHITECTURE.md](WEBSITE_INFORMATION_ARCHITECTURE.md) and [COMMANDER_THUMB_WEBSITE.md](COMMANDER_THUMB_WEBSITE.md).

## Local preview and production validation

```powershell
node scripts/build-site.mjs
python -m http.server 4173
node scripts/validate-site.mjs
node scripts/verify-company-architecture.mjs
```

The browser gate checks 20 direct routes; 320, 375, 430, tablet portrait, tablet landscape, laptop, and large-desktop layouts; mobile and keyboard navigation; the Games disclosure; visible targets; images; overflow; Palace naming isolation; Commander spelling/status/news; News filtering; all four tutorials; and zero cookies/storage/tracking. `scripts/verify-palace-site.mjs` remains a compatibility entry point for the same gate.

No project package manifest is used, so there is no separate dependency, lint, type-check, or framework build command. JavaScript syntax checking and the production generator are part of release QA.

## Deployment

Push reviewed changes to `main`. GitHub Pages deploys the repository root. Wait for `pages-build-deployment`, confirm its head SHA exactly matches the pushed commit, then rerun the browser gate against `https://4ohi.com`.

The `CNAME` file is `4ohi.com`. Never change Proton MX, SPF, DKIM, DMARC, provider verification, or unrelated TXT records during a website release.

## Operations documentation

- [Domain and DNS](docs/DOMAIN-AND-DNS.md)
- [Email operations](docs/EMAIL-OPERATIONS.md)
- [Website deployment](docs/WEBSITE-DEPLOYMENT.md)
- [Security and account recovery](docs/SECURITY-AND-ACCOUNT-RECOVERY.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)
- [Public launch verification](docs/PUBLIC-LAUNCH-VERIFICATION.md)
- [Brand assets](docs/BRAND-ASSETS.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Palace tutorial](docs/PALACE-TUTORIAL.md)
- [News authoring](docs/NEWS-AUTHORING.md)
- [Accessibility acceptance](docs/ACCESSIBILITY.md)
- [Commander ThumB website](COMMANDER_THUMB_WEBSITE.md)

Never commit credentials, tokens, recovery codes, private keys, private correspondence, or account exports.
