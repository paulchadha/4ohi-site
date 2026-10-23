# Workbench visual and timeline refresh — October 23, 2026

This revision updates the 48 existing published entries. It adds no article and does not publish, edit, or reschedule any of the 18 prepared drafts. Article IDs, slugs, titles, descriptions, bodies, authors, original publication dates and RSS identifiers are preserved. The genuine visual/context revision is recorded as October 23, 2026. The tile-first homepage, complete catalog, Funkey Town rebrand, current Sling Bling artwork and Palace demo remain in place.

## Visual coverage

All 48 entries now have an image on their article, Workbench cards and relevant journal previews. Twenty-six entries previously lacked an image. Eight entries use authentic recorded development captures; 40 use current product or studio artwork. Images fit within their frames without cropping and have descriptive alternative text. Promotional art is explicitly labeled artwork, never a gameplay screenshot.

- Palace: `assets/card-apps/palace.webp`, the recorded Samsung app capture documented in `assets/card-apps/provenance.json`.
- Hearts, Spades and Euchre: the existing recorded app web renders in `assets/card-apps/`, labeled development browser captures rather than physical-phone screenshots.
- Gin Rummy: `assets/gin-rummy/development-phone.webp`, the game-owner-supplied development capture already integrated in the product page, labeled development-build capture without a platform/device claim.
- Other entries: existing current catalog artwork, including the approved Sling money monsters and the corrected Funkey Town title art. General studio entries use relevant studio/product art.

Captures are reference visuals: a later build may differ, and the image does not establish when the article's work happened. Artwork is also current reference material, not retrospective photographic evidence. Per-entry source, dimensions, kind and caption are recorded in `content/news.json`; the audit is `content/workbench-date-evidence.json`.

## Work dates versus publication dates

Four articles have separate source-backed work dates. Forty-four lack a verified date for the underlying work and are explicitly grouped as undated retrospectives. Their known publication dates remain visible and unchanged. A batch publication date does not date every underlying project milestone. The new `news-timeline.html` is a reading index of existing articles, not a new news publication or RSS item.

| Existing article | Work/context date | Evidence and limit |
| --- | --- | --- |
| BooYang City: a town that grows with play | September 11–12, 2026 | The original article and `docs/SEPTEMBER-NEWS-SOURCES.md` distinguish the September 11 feeding repair (`def175e`) from the September 12 development build. Partial phone checks and unfinished higher stages remain stated. |
| GildenSpire: a dragon built to move | September 12, 2026 | `docs/SEPTEMBER-NEWS-SOURCES.md` records the rigged-dragon development checkpoint, including `eacef40`; it does not establish a finished public launch. |
| Small fixes that change the feel | September 12, 2026 | The same dated source notes record scoped behavior checks. They do not establish complete QA or a release of every app. |
| Gravity is getting a more expensive-looking wardrobe. | October 20, 2026 | `docs/SLING-BLING-RELEASE-2026-10-20.md` and `77c164781ba422c636832b78d03816c6aab4ca5c` establish website artwork and article publication. The game overhaul remained in development. |

## Dated website records

The timeline separately labels repository-backed website changes. Git committer dates establish these site records, not app launch dates, company founding or the original creation date of imported article prose.

| Date | Website record / source |
| --- | --- |
| July 25, 2026 | Initial website foundation, `9b4a3d74ec8f58f9b3661b4acaec7ca898d5eb7c`. |
| August 29, 2026 | Thumb Command website presentation, `e8d01a64b43779106b160132d190e840cb701c9f`. |
| August 30, 2026 | Broader portfolio rebuild, `308d670931bb0ab84b9a43c9ca5f23ab5cd8b01a`. |
| September 5, 2026 | GildenSpire and September portfolio presentation, `9f0efb741998fd24eb3d9d4486f29adabce90f8e`. |
| October 4, 2026 | Shared Workbench journals and fixed Palace demo repair, `0410b456d6e5c67324ce8faeb3688fa705e9bd22`. The articles were published together; their underlying work is not all dated October 4. |
| October 20, 2026 | Sling artwork and developer update, `77c164781ba422c636832b78d03816c6aab4ca5c`. |

These six website records and the two September development checkpoints form eight dated timeline milestones. `content/workbench-timeline.json` contains their precise sources and qualified summaries. Unknown work dates are not inferred from Git imports, image timestamps, publication batching, or current release targets.

## Verification

Release checks compare the 48 published records against `52f0db76ff27cde8bbdfdd8530865648c148cbc3`, permitting only visual/context metadata and the genuine revision date. All 18 draft objects, publisher/queue code, publication history and feed bytes are protected. Browser checks cover cards, article heroes, source labels, original dates/body text, responsive image fit, no-JavaScript archives, product journals, homepage previews and timeline grouping. Deployment evidence is retained separately with the exact resulting commit and live rendering captures.
