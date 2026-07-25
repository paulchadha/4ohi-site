# News authoring workflow

News records live in `content/news.json`; generated article pages, `news.html`, `feed.xml`, and `sitemap.xml` come from `scripts/build-site.mjs`. Edit the source record, run the generator, then validate the generated output. Do not hand-edit a generated article.

Each record needs a stable slug, title, description, ISO date, category, image, image alt text, featured state, and paragraph content. Use only verified milestones and Internal Alpha language. Do not imply a store listing, public multiplayer service, release date, partnership, player count, or certification that does not exist.

Use one featured lead on the newsroom page, followed by recent stories in reverse chronological order. Headlines should be specific and calm; body copy should identify what changed, why it matters, and what remains in testing. Palace leads the editorial hierarchy, while Hearts, Spades, Euchre, company, accessibility, privacy, and safety updates support the broader family.

After authoring, run the generator twice and confirm no second-run diff, run `scripts/validate-site.mjs`, then exercise `news.html`, the article, RSS, sitemap, metadata, mobile layout, and internal links in browser QA.
