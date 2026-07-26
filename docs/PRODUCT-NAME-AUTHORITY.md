# Global product-name authority

## Canonical and display identities

Palace is the canonical public and SEO identity. Search metadata, Open Graph metadata, JSON-LD, sitemap URLs, RSS URLs, and source citations remain Palace.

Visible table identity may be:

- `Palace` — default;
- `Shed` — public alternate display name;
- `Shithead` — confirmed traditional adult display name behind the existing private ten-tap Shed flow.

The traditional adult name must never appear in metadata, sitemap content, Open Graph fields, or JSON-LD.

## Resolver

`assets/product-authority.js` is the sole runtime authority. It exposes:

- `gameName`
- `gameNameUpper`
- `gameNameLower`
- `gameNamePossessive`
- `playGameLabel`
- `aboutGameLabel`
- `gameHistoryLabel`
- `gameRulesLabel`
- locale-aware message templates

It emits `fourOfHearts:gameNameChanged` after a visible name change. The header, footer, countdown, newsroom, game-family page, product page, tutorial compatibility layer, and approved editorial product-copy tokens consume that state.

## Authoring tokens

The generator provides:

- `gameToken(key, fallback)` for structured resolver values;
- `gameMessage(key, fallback)` for locale-aware phrases;
- `productCopy(value)` for visible editorial records that contain the canonical word Palace.

Use these helpers only in visible product-identity copy. Metadata and structured data must use canonical Palace text directly.

Fixed history, source titles, trademarks, URLs, slugs, and explanatory passages that compare alternate names may remain canonical. When ambiguity matters, use `data-canonical-game` and explain the fixed reference in nearby copy.

## Locale and grammar rules

Supported URL-only locales are English, French, Spanish, Hindi, Simplified Chinese, Hebrew, Arabic, and Canadian Just for Fun. Hebrew and Arabic set `dir="rtl"`.

Palace, Shed, and Shithead are product/table names and are not translated. Surrounding phrases are locale templates; English possessive punctuation is not mechanically appended in every language.

## URL and privacy rules

State lives only in `?lang=` and `?game=`. Internal links inherit both values. Back/forward navigation re-renders state. No cookie, local storage, session storage, IndexedDB, or visitor profile is used.

## Acceptance

`scripts/verify-app-parity.mjs` checks all public pages plus nine language/name combinations, RTL, state-preserving links, the ten-tap traditional-name flow, all tutorials, and zero storage. `scripts/validate-site.mjs` checks generated markup, metadata, links, mixed content, tracking, secrets, and accessibility hooks.


## Artwork is part of name authority

The active table name now selects its coordinated Palace, Shed, or confirmed Shithead art at the same render boundary as copy and links. See [Dynamic Naming and Artwork](DYNAMIC-NAMING-AND-ARTWORK.md).
