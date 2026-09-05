# GildenSpire Website Release — September 5, 2026

## Public identity

GildenSpire is the exact public title. It is a Four of Hearts Interactive dragon flight-and-fight adventure in development. No public build, release date, platform, price, rating, store listing, or team-play availability is claimed.

The positioning line is “Flight or Fight.” The public experience presents the intended loop: raise a distinct dragon, take direct control in a vast world built to be flown through, and fight for the sky. The Golden Egg is presented as the long-term legend goal. Team play is described only as planned.

## Public routes

- /gildenspire.html — canonical product page
- /games/gildenspire/ — compatibility route
- /news-introducing-gildenspire-flight-or-fight.html
- /news-why-flying-has-to-be-fun.html
- /news-building-dragons-that-actually-feel-different.html

GildenSpire is also featured on the homepage, Games page, global Games menu, footer, News page, RSS feed, and sitemap.

## Artwork and provenance

Founder-supplied source board:

- docs/source-assets/gildenspire/gildenspire-concept-board-source.png

The source board contains an embedded working-title treatment. That treatment is not used as public website copy. Its individual world, dragon, and gameplay panels are used only through documented crops.

A clean, text-free production hero was generated from the founder direction:

- docs/source-assets/gildenspire/gildenspire-hero-generated-v1.png

Reproducible derivatives live under assets/gildenspire/ and are rebuilt with scripts/process-gildenspire-art.py. Exact source and derivative SHA-256 hashes are recorded in assets/gildenspire/provenance.json.

## Content architecture

The catalog record is in scripts/studio-product-manifest.mjs. The homepage feature, Games feature, and dedicated page live in scripts/gildenspire-content.mjs. Three launch-development records live in content/news.json. Responsive styles live in assets/gildenspire.css.

The dedicated page contains:

- Hero and honest development status
- Raise, Fly, and Fight sections
- A twelve-species dragon roster presented as current design direction
- The Golden Egg objective
- Development-news links and status summary

## Validation

Run:

    node scripts/build-site.mjs
    node scripts/validate-site.mjs
    node scripts/verify-gildenspire.mjs

The focused browser suite checks direct routes, title and metadata, status language, artwork loading, article visibility, keyboard-accessible navigation, reduced motion, and horizontal overflow at 320, 375, 430, 768, 1024, 1440, and 1920 pixels. It also creates desktop and mobile evidence in docs/visual-evidence/gildenspire-2026-09-05/.