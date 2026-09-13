# Gin Rummy website addition — September 12, 2026

Paul explicitly selected Gin Rummy as a new Four of Hearts app and authorized its website/portfolio addition and original artwork. Game implementation and online service work belong to the assigned game task. This website presents the app as in development and makes no shipped, downloadable, persistent-rating, or verified-online-play claim.

- Canonical page: `gin-rummy.html`; alias: `games/gin-rummy/`.
- Included in the shared product catalog, Games menu, card collection on home and Games, footer, and sitemap.
- Standard two-player Gin Rummy basics are summarized in original wording and linked to [Bicycle's rules](https://bicyclecards.com/how-to-play/gin-rummy). These explain the intended game, not completed app features.
- Original concept illustration generated using the built-in ImageGen tool for this authorized addition. The selected version uses deliberately minimalist 5, 6, and 7 of hearts, blue felt, two empty chairs, and a garden terrace. The earlier candidate was rejected for inconsistent card pips.
- Selected original: `assets/gin-rummy/concept-source.png`; web derivative: `assets/card-apps/gin-rummy.webp`. Source hash and dimensions are in `assets/card-apps/provenance.json`. Caption explicitly says original AI-generated concept artwork, not a gameplay screenshot.
- No app repository or phone was modified. No public online-play or download button was added.

Validation: 78 rendered card-page/table checks cover eight pages at eight widths and Palace one-/three-bot tables at seven viewports. The new page is included in sitewide internal-link/asset checks and portfolio verification. Full-game Palace testing on production reads this test browser's saved record and uses public controls; local QA hooks remain disabled on the public host.

The game owner subsequently supplied a real `phone-game.png` capture and reported passing nine engine/server tests plus independent-browser join/pass/draw/discard/reload checks at 360, 768, and 1440 pixels. The page now includes this as an expandable actual development-build preview, separate from concept art. Copy reflects verified development testing, including match recovery after restart, while public HTTPS hosting and downloadable/native packaging remain unavailable. The screenshot contains generic test players only.
