# Notes from the Workbench: authoring

Create one article → tag products → preview → publish. `content/news.json` is the only article collection. The generator supplies full articles, News, homepage previews, product journals, product archives, RSS and sitemap entries. There is no CMS, database or new runtime dependency.

1. Copy `content/article-template.json` into the array in `content/news.json`. Choose unique, permanent `id` and `slug` values; routes remain `news-SLUG.html`. Do not rename IDs or slugs when a title changes. `archive`, `origins`, and `product-*` slugs are reserved.
2. Keep `status: "draft"` while writing. Use a useful excerpt in `description`, the `The 4OH Workshop` byline, and plain-text `body` sections (`heading` and `paragraphs`). Markup is escaped. Optional `image` must be an approved repository asset with meaningful `imageAlt`; omit both for text-only posts.
3. Set `productIds` to one or several stable IDs from `scripts/studio-product-manifest.mjs`. Leave it empty for a general studio story. Tag only products actually discussed. Use `tags` for collections such as `games`, `card-table`, `lifestyle-apps`, `company` and `development`.
4. Choose `articleType`: `studio-story`, `developer-diary`, `design-diary`, `workbench-brief`, `retrospective`, or `release-notes`. Use design diaries or workbench briefs where implementation evidence is limited. Release notes need evidence of an actual release.
5. Run `node scripts/preview-post.mjs YOUR-SLUG`, then open the printed local URL. It renders the complete article in a disposable private copy, marks it noindex, and leaves your source record as a draft. Press Ctrl+C to remove the preview. Ordinary builds exclude drafts from every public output.
6. To publish, set `status: "published"` and `date` to the actual publication day (`YYYY-MM-DD`, no future dates). Build and run the checks below. Publishing to GitHub Pages remains a separate reviewed action.

## Dates, history and features

- A retrospective published today keeps today's publication `date`. Put the older period in optional `historicalPeriod` (for example, `Early prototypes, 2024–2025`), never fake-backdate it.
- Add optional `revisedDate` only after a genuine editorial revision; never update it automatically on builds. Existing dates, historical titles and body wording stay intact. The article sidebar reports present availability separately.
- Set `featured: true` on one published article and false on the previous feature. Zero selected features falls back to the newest published article. More than one fails the build.
- For a reading series, supply `seriesId` and positive `seriesOrder`. The preserved introductions use `product-origins`; `news-origins.html` starts there and articles link to the next entry. New origin stories can extend that series with the next order.
- Keep RSS GUIDs and article routes permanent. Optional `rssGuid` can retain a specific historical identifier; the default is the existing absolute article URL. `content/publication-history.json` records the original 21 identifiers and dates for regression checks.

## Stable product IDs and names

Use `heartstack` for **Unicorn Blast**, `unicorn-land` for **Unicorn Land Adventures**, `princess-land` for **Princess Land Adventures**, `bobby` for **Bobby the Breadasaurus**, and `evil-doom-boy` for **Evil Doom Boy**. Other IDs follow their catalog names, including `sling-nouveau`, `gin-rummy`, `sovinto`, `whomly` and `sleep-amigo`.

Manifest aliases resolve historical names (HeartStack, People Lens, Commander Thumb) to the same IDs. Legacy `news.html?tag=PRODUCT` links still filter the same feed. Product-journal links use generated `news-product-ID.html` archives and work without JavaScript.

`scripts/workbench-content.mjs` supplies the short workbench summaries. Label goals as goals, and mark current priorities only when verified. Keep availability separate. All 20 products now have a published development entry. The October 4 stories add 24 records to the 21 preserved historical articles.

## Draft privacy and languages

`content`, `scripts` and `docs` are excluded by `_config.yml`. Publishing must honor these exclusions. No raw article JSON is emitted to `assets`. Only explicitly published records enter HTML, RSS or the sitemap. The private generated-output manifest removes a previously generated article route if its record is withdrawn to draft. Working material in `content/drafts` is not read by the generator.

Current posts are English. Their text is marked `lang="en"` and protected from Canadian phrase replacement. Non-English visitors see an English availability notice; language controls and navigation continue working. Do not present English article text as a finished translation or translate product names.

## Checks

```text
node scripts/build-site.mjs
node scripts/validate-site.mjs
node scripts/verify-workbench.mjs
node scripts/verify-workbench-browser.mjs
node scripts/verify-production-portfolio.mjs
node scripts/verify-palace-web-engine.mjs
```

Browser checks use the existing Playwright/Chromium setup (set `NODE_PATH` to the bundled Node packages if needed). Confirm a second build changes no generated bytes; check article/journal routes, product/type/order filters, load more, keyboard, mobile, reduced motion and reading without JavaScript. Do not add tracking, comments, mail forms or pretend subscriptions.
