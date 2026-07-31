# Visual Evidence Index

Founder source screenshots are referenced in the July 26 page-by-page correction request and are not copied into the repository.

Current generated evidence:

- `page-reconstruction-local-results.json` — local automated acceptance record.
- `app-home-320x568.png`, `360x800`, `390x844`, `412x915`, `430x932`, `768x1024`, and desktop — canonical homepage.
- `app-power-cards-1440.png` — Power Card geometry and selected-state evidence.
- `app-palace-390x844.png` — canonical product page on phone.
- `app-mini-match-390x844.png` and RTL Shed variant — Palace table.
- `app-news-*`, `app-games-*`, `app-about-*` — editorial/product pages.
- Hearts, Spades, and Euchre phone-table screenshots from the previous founder correction remain useful; the JSON result is authoritative for current DOM/state assertions.
- `commander-thumb-hero-320x568.png`, `430x932`, `768x1024`, and `1366x768` — Commander ThumB hero at phone, tablet, and laptop sizes.
- `palace-readability-375x812.png` — repaired Play Palace contrast and solid-surface treatment on a phone.
- `commander-thumb-results.json` — passing local Commander route, lore, spelling, artwork, responsive, keyboard, reduced-motion, and Palace readability record.

- `page-reconstruction-public-results.json` — passing public acceptance record for deployed SHA `3e26967f4a938e63a8c56cedea847bdc652ebc20`.

The public result was captured after the exact product SHA built successfully and was retested through `https://4ohi.com`.
## Company architecture production audit

- `company-architecture-results.json` — 20 routes, seven viewports, mobile/keyboard navigation, Palace selector isolation, Commander metadata/status/news, News filters, localization, four tutorials, and zero-storage results.
- `company-index-*` — Four of Hearts Interactive homepage at 320, 430, 768, and 1366 pixels.
- `company-games-*` — reusable Games catalog at the same widths.
- `company-commander-thumb-*` — original 1970s-inspired Commander ThumB promotion at the same widths.
- `company-palace-play-*` — Palace-local controls and tutorial at the same widths.

Generated locally July 26, 2026 with `scripts/verify-company-architecture.mjs`.
## Immersive digital experience — 2026-07-31

Baseline files use `immersive-before-*`; rebuilt files use `immersive-after-*`. Home evidence covers 320×568, 360×800, 390×844, 412×915, 430×932, 768×1024, 1366×768, and 1920×1080. Palace, Palace Play, Palace Story, Games, News, and About each include 390×844 and 1366×768 captures. The capture source is `scripts/capture-immersive-evidence.mjs`.
