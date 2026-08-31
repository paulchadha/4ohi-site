# Site Information Architecture

The public hierarchy is company-first:

- `/` — Four of Hearts Interactive company homepage
- `/games.html` and `/games/` — complete game catalogue
  - Card Games: Palace, Hearts, Spades, Euchre, Solitaire, War
  - Arcade, Defense & Adventure: Thumb Command, Bobby the Breadasaurus, Evil Doom Adventures: Shadow Run
  - Puzzle & Creative: HeartStack Unicorn Blast, Princess Land Adventures, Unicorn Land Adventures
- `/lifestyle-apps.html` and `/lifestyle-apps/` — People Lens and Sleep Amigo
- `/news.html` — company newsroom with Games, Card Table, Lifestyle Apps, and Company filters
- `/about.html`, `/support.html`, `/privacy.html`, `/security.html`, `/terms.html`, `/contact.html`

Product detail routes are declared in `scripts/studio-product-manifest.mjs`. Palace remains the only playable product preview; its table-name selector appears only in the Palace playing context. Legacy Commander and separate Evil Doom hero routes are noindex compatibility redirects.

The site is static and generated at repository root for GitHub Pages. `CNAME` remains `4ohi.com`; relative URLs work at the deployment base path.