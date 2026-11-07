# Editorial news page - November 7, 2026

The owner requested a real studio journal with the newest published story visible immediately. This layout starts from verified Palace-correction commit c574e58f6a4218e46d826739d21202d7e37e4a41. Article source content/news.json is frozen at SHA256 92a25def051225442e1258800bbed57490a897ccf69ac83f8def683b8d33fd9a. All 68 published records, two drafts, original queue constraints, the revised Palace history and today's Euchre spotlight remain unchanged. No new publication is created.

## Editorial design and reading

A compact paper-and-ink masthead leads directly into the latest story, with a serif headline, publication date, existing excerpt, read link and a restrained authentic visual. Latest is selected by actual publication date/time, independently of manual feature flags or revision dates. A separate strip labels an older featured story or revised diary and shows its original publication date; the current revised Palace diary is discoverable there without being passed off as newly published.

A chronological feed, topic links, compact filter disclosure, reading paths and genuine existing diary headlines follow. The long timeline remains on its existing dedicated route. The former giant Press Ahead promotion no longer precedes the story; Press Ahead's real articles and product-filter destination remain accessible. No article wording or factual accomplishment is invented for this design.

The article-first hierarchy and topic navigation were informed by the publicly inspected [Linear Now](https://linear.app/now) page. The dated process, problems and iteration visible in the [Factorio blog](https://www.factorio.com/blog/) informed the development-journal emphasis. No branding, artwork or article prose was copied from either site.

## Implementation scope

scripts/editorial-news.mjs renders the canonical news home. scripts/workbench-content.mjs delegates only the ordinary news home to it; archive, origins and product archives retain their existing markup. scripts/build-site.mjs includes the new CSS and script only for the canonical, non-noindex news page. Legacy redirects retain their original assets and behavior. assets/news-editorial-20261107.css is page-scoped; assets/news-editorial-20261107.js preserves progressive filtering/history/load-more behavior and adds reset, active topics and precise publication-time ordering. The original assets/workbench.js and existing style files remain byte-equivalent.

Adding two new page assets updates assets/asset-manifest.js and its cache-version reference in generated headers. Preservation checks normalize only that one reference, then compare every other public HTML/XML document against the prior commit. All other article bodies, product pages, footer/navigation, tile-first home, Palace demo, RSS, sitemap, origins and archive remain identical. The 90 existing fingerprint mappings are unchanged; only two new mappings are added.

## Validation

Build and 158-page static validation pass. The daily-queue/draft-isolation checks and Palace fixed fixture, exact replay, alternate strategy, save validation and 52-card conservation pass. Twelve focused local browser checks cover 360x640, 390x844, 768x1024 and 1440x900, newest headline/read-link visibility, native artwork/alt text, overflow, labeled controls, filter combinations, empty results, reset, keyboard, load-more focus, back/forward history, legacy Palace query alias, no-JavaScript access to all 68 notes, archive/origin/product reading routes, preserved Palace revision, RSS uniqueness and unpublished-route 404s.

Regression fixtures verify that an older manual feature cannot displace the newest publication, a later same-day publication wins by timestamp, a revision does not become a new publication, and drafts never enter the editorial renderer. A second build is deterministic. Screenshots were visually inspected on phone and desktop. Full legacy suites with older catalog/layout assumptions and native/production account/device acceptance are not claimed; focused website checks are recorded in the evidence.

Evidence: docs/visual-evidence/news-editorial-2026-11-07/. No credentials, grants, security settings, services, app source or schedules are changed.
