# Website Information Architecture

The public hierarchy is company-first:

- `/` — Four of Hearts Interactive company homepage
- `/games.html` and `/games/` — complete game catalogue
  - Card Games: Palace, Hearts, Spades, Euchre, Solitaire, War
  - Arcade, Defense & Adventure: GildenSpire, Thumb Command, Bobby the Breadasaurus, Evil Doom Boy
  - Puzzle & Creative: BooYang City, Funky Town, HeartStack Unicorn Blast, Princess Land Adventures, Unicorn Land Adventures
- `/lifestyle-apps.html` and `/lifestyle-apps/` — Whomly and Sleep Amigo
- `/news.html` — company newsroom with Games, Card Table, Lifestyle Apps, and Company filters
- `/about.html`, `/support.html`, `/privacy.html`, `/security.html`, `/terms.html`, `/contact.html`

Product detail routes are declared in `scripts/studio-product-manifest.mjs`. Evil Doom Boy has one canonical product route at `/games/evil-doom-boy/`; its hero selector changes preview state, not product identity. Palace remains the only playable product preview; its table-name selector appears only in the Palace playing context. Legacy Commander and Evil Doom routes are noindex compatibility redirects. The retired `/people-lens.html` and `/lifestyle-apps/people-lens/` routes redirect to canonical Whomly.

The site is static and generated at repository root for GitHub Pages. `CNAME` remains `4ohi.com`; relative URLs work at the deployment base path.

## Privacy-first editorial update — August 30, 2026

The public information architecture treats privacy and the business model as company-level content: a concise homepage promise, a human-readable privacy explanation, a detailed California operational policy, product-scoped privacy profiles, and grouped Trust links in the global footer. Product privacy status is intentionally not inherited from the website. The custom application service remains a company capability on About.
