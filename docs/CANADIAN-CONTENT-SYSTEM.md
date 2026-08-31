# Canadian Content System

Canadian-fun mode is a deliberate site-wide editorial layer, not a pile of one-off jokes.

## Architecture

- Locale authority remains the existing ?lang=en-CA query parameter.
- assets/canadian-copy.js is the centralized, reviewable copy registry.
- assets/canadian-mode.js applies keyed and route-scoped variants and carries the locale across internal navigation.
- Nothing is written to cookies, local storage, session storage, or analytics.
- Default English remains in semantic HTML; the Canadian layer enhances it after parsing.

## Coverage

The registry covers global navigation, homepage, all seven game worlds, Games, News, About, Support, Privacy, footer, custom 404, and loading/error/empty/retry language. Metadata variants are explicit for Home, Games, and 404.

The voice is dry, useful, game-aware, and restrained. It avoids repeated “eh,” snow clichés, or jokes where legal clarity matters. Canadian copy must never change product status, canonical game title, safety meaning, or privacy obligations.

## Authoring rule

Add a stable key to the registry, bind with data-canadian-key or the route selector map, then add a browser assertion. Never scatter locale conditionals through page templates.
