# News authoring workflow

Public records live in content/news.json. Generated articles, news.html, feed.xml, and sitemap.xml come from scripts/build-site.mjs.

Each record needs a stable slug, accurate ISO date, category, optional gameKey, tags, image, meaningful alt text, featured state, and body sections. The company newsroom covers all ten games. Filters expose Company, Palace, Bobby, Evil Doom, Thumb Command, and Development views.

Availability language is factual:

- Palace has an interactive website preview and remains in development.
- Bobby the Breadasaurus is in concept development and is not publicly playable.
- Evil Doom Adventures: Shadow Run is in concept development and is not publicly playable.
- Thumb Command is in development and is not publicly playable.
- Hearts, Spades, and Euchre have website teaching lessons and remain in internal testing.

Never claim a public release, store listing, platform, date, partnership, player count, endorsement, review, rating, or certification without verified evidence. Release drafts remain under content/drafts and must not enter public HTML, sitemap, or RSS.

After editing:

    node scripts/build-site.mjs
    node scripts/validate-site.mjs
    node scripts/verify-company-architecture.mjs
    node scripts/verify-portfolio-expansion.mjs

Confirm a second generator run changes nothing, direct article routes load, filters work, dates and tags are accurate, metadata and JSON-LD are truthful, and images and links work from phone through desktop.

## Editorial presentation update — 2026-08-29

The News index renders the designated feature first, followed by the remaining honest-status stories in editorial sequence. Preserve canonical dates, categories, and destinations; never imply a public build or release that does not exist.