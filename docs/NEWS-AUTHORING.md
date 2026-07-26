# News authoring workflow

News records live in `content/news.json`; generated article pages, `news.html`, `feed.xml`, and `sitemap.xml` come from `scripts/build-site.mjs`. Edit the source record, run the generator, then validate the generated output. Do not hand-edit a generated article.

Each record needs a stable slug, title, description, ISO date, category, image, image alt text, featured state, and paragraph content. Use only verified milestones and Internal Alpha language. Do not imply a store listing, public multiplayer service, release date, partnership, player count, or certification that does not exist.

Use one featured lead on the newsroom page, followed by recent stories in reverse chronological order. Headlines should be specific and calm; body copy should identify what changed, why it matters, and what remains in testing. Palace leads the editorial hierarchy, while Hearts, Spades, Euchre, company, accessibility, privacy, and safety updates support the broader family.

After authoring, run the generator twice and confirm no second-run diff, run `scripts/validate-site.mjs`, then exercise `news.html`, the article, RSS, sitemap, metadata, mobile layout, and internal links in browser QA.

## Founder-era editorial standard

Palace must lead the newsroom. Every product statement distinguishes Internal Alpha/testing from public availability. Articles may use obvious campaign hyperbole, but user counts, rankings, endorsements, reviews, partnerships, and release success require evidence. Product rules are the Four of Hearts rules; broader Palace history must preserve the sourced/tradition/folklore boundary.

## Compact newsroom and dynamic visible identity

The newsroom now opens with a compact heading plus featured story in the first desktop viewport. Visible editorial product references use the shared generator `productCopy` helper so Shed mode does not leave a stale Palace headline. Metadata and NewsArticle structured data remain canonical Palace. Do not restore a full-screen title card.


## July 2026 staggered calendar

The initial five stories now publish on July 14, 17, 20, 23, and 26. Continue with real approved updates every two or three days when possible. See NEWS-EDITORIAL-CALENDAR.md.
