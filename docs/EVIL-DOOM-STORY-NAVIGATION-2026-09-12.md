# Evil Doom story and navigation — September 12, 2026

Paul supplied and approved the exact story in `scripts/evil-doom-story.mjs`. It names Girmat, Dr. Girm, Mr. Girmywormy, and the siblings Boy and Girl; darkness took their parents and stole their memories. The village-gate defense, towers, upgrades, abilities, and increasingly fierce attacks are official canon. The text is retained verbatim in both English and Canadian modes. The existing Evil Doom Boy product identity, canonical route, and legacy redirects remain stable; current gameplay metadata now says tower defense. Existing character/environment art is labeled as concept material.

## Reproduced navigation failure

On the live `/games/evil-doom-boy/` page, clicking News resolved to `/games/evil-doom-boy/news.html?lang=en` and returned the branded 404. Home resolved to `/games/evil-doom-boy/index.html?lang=en`, keeping the visitor in the game. Meet both heroes incorrectly resolved to the site's homepage fragment.

The locale-link pass used `location.href` instead of the nested page's declared base. `assets/product-authority.js` now resolves navigation through `document.baseURI` and binds fragment links to the current document. This also repairs the shared issue on nested Thumb Command pages.

Validation covers entering from Games, leaving through News, Games, and home, switching sibling, using the hero anchor, retaining locale, and navigating again after browser Back. Twelve journeys cover 390, 768, and 1440 pixel widths, English and Canadian, and both nested products. A separate crawl loads every tracked public HTML page in Chromium and checks the resulting internal URLs, fragments, and assets. The existing Evil Doom identity/selection/responsive suite now asserts the approved story.

The live crawl also reproduced a legacy-only redirect failure at `/games/commander-thum-b/index.html`. `assets/route-redirect.js` independently resolved its destination against `location.href`; it now honors `document.baseURI`. The crawl now requests the final browser URL after redirects, so a 200 response from a redirect page cannot conceal a failed destination. Navigation coverage includes the old Commander address with locale preservation.
