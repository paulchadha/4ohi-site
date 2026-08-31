# News authoring workflow

Public records live in `content/news.json`. Generated articles, `news.html`, `feed.xml`, and `sitemap.xml` come from `scripts/build-site.mjs`.

Each record needs a stable slug, accurate ISO date, category, optional `gameKey`, tags, image, meaningful alt text, featured state, and body sections. The company newsroom covers all current games. Filters expose Company, Palace, Bobby, Evil Doom Boy, Thumb Command, and Development views.

Availability language is factual:

- Palace has an interactive website preview and remains in development.
- Bobby the Breadasaurus is in development and is not publicly playable.
- Evil Doom Boy is one Action Adventure game in development and is not publicly playable. Evil Doom Boy and Evil Doom Girl are selectable heroes in that one game; Evil Doom is the antagonist.
- Thumb Command is in development and is not publicly playable.
- Hearts, Spades, and Euchre have website teaching lessons and remain in internal testing.

Never claim a public release, store listing, platform, date, partnership, player count, endorsement, review, rating, or certification without verified evidence. Release drafts remain under `content/drafts` and must not enter public HTML, sitemap, or RSS.

After editing:

    node scripts/build-site.mjs
    node scripts/validate-site.mjs
    node scripts/verify-production-portfolio.mjs
    node scripts/verify-evil-doom-origin.mjs

Confirm a second generator run changes nothing, direct article routes load, filters work, dates and tags are accurate, metadata and JSON-LD are truthful, and images and links work from phone through desktop.
