# Commander Thum-B website authority

Commander Thum-B is the Four of Hearts Interactive arcade-defense property at `/thumb-command.html`. The company remains the parent brand; Commander Thum-B is one of seven current game worlds.

## Product identity

- Title: **Commander Thum-B**
- Tagline: **Save Planet Earth**
- Hero craft: the blue-white-gold Blueguard interceptor
- Threat palette: purple, magenta, violet, coral, and black
- Core premise: the city is the base
- Flagship environment: Chicago
- Current world-tour environments: Chicago, San Francisco, New York City, London, and Tokyo
- Status: In Development; no store, platform, download, or release-date claim is authorized

The page sequence is hero, mission, gameplay, Blueguard progression, alien forces, world tour, defense systems, gallery, news, and a truthful final mission-information call to action.

## Routes and compatibility

The canonical game route is `/thumb-command.html`. Retired public game and article routes are compatibility documents with `noindex`, canonical metadata, meta refresh, and same-origin JavaScript replacement that preserves query and hash. GitHub Pages cannot emit custom HTTP 301 responses from a root-branch static site, so these are the strongest redirects available without changing the established host.

## Build and acceptance

Run:

```text
python scripts/process-thumb-command-art.py
node scripts/build-site.mjs
node scripts/build-site.mjs
node scripts/validate-site.mjs
node scripts/verify-company-architecture.mjs
```

The browser gate covers the homepage tile, ten-product navigation, five-city page, five new articles, metadata, broken images, overflow, touch targets, reduced motion, keyboard focus, console errors, and all compatibility routes at phone, tablet, laptop, and desktop sizes.
