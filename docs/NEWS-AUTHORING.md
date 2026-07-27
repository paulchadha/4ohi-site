# News authoring workflow

Public news records live in `content/news.json`; generated articles, `news.html`, `feed.xml`, and `sitemap.xml` come from `scripts/build-site.mjs`. Each record uses a stable slug, accurate ISO date, category, optional `gameKey`, tags, image, meaningful alt text, featured state, and body sections.

The company newsroom covers Four of Hearts Interactive and all games. Filters currently expose Company, Palace, Commander ThumB, and Development categories. Do not make one game the global editorial identity.

Availability language is factual:

- Palace has an interactive website preview and remains in development.
- Commander ThumB is Coming Soon and is not publicly playable.
- Hearts, Spades, and Euchre have local teaching lessons and remain Internal Alpha.

Never claim a public release, store listing, public multiplayer service, date, partnership, player count, endorsement, review, or certification without verified evidence. A release article may be drafted under `content/drafts/`, but drafts must not enter `content/news.json`, public HTML, sitemap, or RSS. The current Commander release draft is explicitly guarded this way.

After editing content:

```powershell
node scripts/build-site.mjs
node scripts/build-site.mjs
node scripts/validate-site.mjs
node scripts/verify-company-architecture.mjs
```

Confirm the second build changes nothing, direct article routes load, filters work from query parameters, dates and tags are accurate, metadata/JSON-LD are truthful, and all images and links work at phone through desktop widths.
