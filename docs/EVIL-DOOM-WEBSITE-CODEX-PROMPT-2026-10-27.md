# Codex prompt: update the existing Evil Doom Boy website presentation

Use this website section in the combined game-and-website prompt pack. The game owner supplies implementation facts and art; this section changes only the existing 4ohi-site repository. Do not create another website, modify game code, generate competing game artwork, or publish a binary or playable game runtime.

## Starting point and ownership

Work in the isolated website checkout `C:/Users/paulc/AppData/Local/Temp/4ohi-evil-website-20261027-release`. Preparation began at `8b8e9553ce3f5c91b4187526a39617b850fe931b`, after the October 27 SOVINTO article was published. Read repository instructions and reconcile remote main and Pages again before editing or publishing. Daily news may advance while the game assets are being prepared; preserve those later publications when integrating this website change. Keep the original dirty checkout and app projects untouched.

Keep one Evil Doom product, stable ID `evil-doom-boy`, canonical URL `/games/evil-doom-boy/`, and its existing public branding. The current title is **Evil Doom Boy**; referring to its old Adventures names does not authorize a new product record or URL migration. Retain Boy/Girl story relationships and the user-approved Girmat canon unless the owner explicitly changes them. Distinguish story/design canon, implemented behavior, test results and future work.

## Required inputs before the visual implementation is finalized

1. Actual reference pixels have now been inspected from the user's emailed PNG. Local copy: `C:/Users/paulc/AppData/Local/Temp/4ohi-evil-mail-reference-20261027/reference-from-email.png`; dimensions 1536 × 1024; 3,090,036 bytes; SHA-256 `56ce7d7811d4761c4b1c16d2d6e045205e407820e87ed401b341cf252285c99b`. Retrieve it from this verified local path. This was obtained through Gmail's supported attachment read; the failed Library transfer was not bypassed or patched. The reference remains a design guide, not proof of implemented gameplay and not a gameplay screenshot for the website.
2. Obtain the game owner's verified revision, build/version, implemented feature list, planned features and known limits. Do not present pictured or planned UI as shipped behavior. Retain In Development status and truthful availability.
3. Obtain exact local paths and SHA-256 values for the approved catalog tile, detail hero and real development captures. Inspect each image. Record native dimensions, source revision/build/platform, a useful alt description and an accurate caption. A browser development capture is not physical-phone evidence; promotional/concept art is not a screenshot.
4. Use `content/evil-doom-website-handoff.template.json` as a private handoff checklist. Its null fields are pending inputs, not assets to invent. Never publish private Drive links or app packages through this website task.

## Existing source map

- `scripts/evil-doom-page.mjs`: the product page, first extracted verbatim and now prepared with a reference-informed hero, portrait selector, gallery placement and story section. Its local rendering still uses labeled earlier concept art pending verified game-owned assets. `scripts/studio-world-pages.mjs` re-exports it so the generator API stays stable.
- `scripts/evil-doom-story.mjs`: the exact approved story. Preserve its text; change layout around it rather than rewriting canon casually.
- `scripts/studio-product-manifest.mjs`: the single current product record, artwork, hero assets, alt text, route and availability.
- `scripts/production-pages.mjs`: tile-first home grid and lower catalog cards. The shared product artwork also appears on Games cards.
- `scripts/carousel-content.mjs`: Games showcase and product image galleries. An optional `data-gallery-caption` on an image now preserves its verified caption in the generated gallery. Without it, current output is unchanged. Set it on genuine game captures so they do not inherit a generic concept-art label.
- `scripts/build-site.mjs`: generates `/games/evil-doom-boy/index.html` with `<base href="../../">`. Preserve that nested-path behavior.
- `assets/studio-portfolio.js`: existing Boy/Girl preview selection and `hero` query handling. Preserve keyboard focus, selection state and canonical identity.

## Page and catalog implementation

The inspected seven-panel reference combines a bright castle/waterfall landscape and hooded siblings with white eyes, purple cloth/energy, dark armor and warm gold trim. It uses dark translucent panels, gold selected-card outlines, cream/white type and prominent purple pill buttons. Its panels depict a title screen, sibling selection, campaign map, mission preparation, battle, upgrades/spells and victory. Those are observations about the supplied design reference only; each corresponding feature or capture still needs game-owner evidence before it becomes a website claim.

The prepared website follows the material palette, strong game-led title/art pairing, purple actions, gold selection treatment and clear screen framing. The original Girmat story is retained below the previews. No reference-screen names, combat roles, rewards, level counts or ability implementations are asserted as verified game features. Replace the visibly labeled older silhouettes/concepts with the verified new media before publishing. The website button says Meet both heroes rather than offering a new playable runtime.

The hero accepts `referenceHeroArtwork`, `referenceHeroAlt`, `referenceHeroWidth`, `referenceHeroHeight` and `referenceHeroCaption` on the existing product record. Populate these only from verified game-owned media; retain truthful explicit fallback labels while preparing locally. Boy/Girl portraits remain the existing `heroArtwork`/`alternateHeroArtwork` inputs. Final captions for genuine captures must replace the provisional concept captions. Never use the emailed collage as a substitute for actual build evidence.

Use the inspected reference and verified game media to update the visual hierarchy of the current page. Aim for a clear game-led first impression, relevant labeled build previews, readable status and a concise path into the existing story and hero selection. This is a proposal for structure, not a claim that the uninspected reference has a particular palette, layout or screen set.

Preserve one H1, the established canonical link, metadata and VideoGame identity. Use a coherent approved game-owned tile in the homepage's first grid, its lower game card, Games catalog/showcase and any relevant related-product card. Do not change other products' artwork or disturb the complete 21-product home grid. Keep stable art filenames available for historical articles; use new content-specific filenames for replacements rather than overwriting old article images.

Keep media sharp and its meaning intact: native width/height attributes, responsive sizes, reserved frame dimensions and `object-fit: contain` for screens or artwork whose UI/characters must remain visible. Request an intentional square tile export from the game owner if a landscape screenshot would require an awkward crop. Do not manufacture duplicate images to fill a gallery. Use genuine distinct captures or an honest single-image presentation.

Keep concept/reference material visibly separate from actual captures. Give every image meaningful alt text and an accurate caption. Use `data-gallery-caption` on page images that become carousel slides. Keep current hero selection only to the extent supported by verified implementation; if a sibling is still a concept, label that preview honestly instead of claiming a playable implementation.

Scope new CSS to this product/page and its intentional current catalog media. Reuse the existing accessible gallery behavior: touch swipe and pointer drag, keyboard arrows, visible controls/index, pause control, 15-second advance, pause on hover/focus/interaction/hidden document, and reduced-motion handling. Keep vertical page scrolling natural. Preserve readable 320px layouts and clear focus states. Do not broadly redesign the homepage.

## Routes, availability and protected content

Retain `/games/evil-doom-boy/` and the working legacy redirects, including `/evil-doom-adventures.html`, `/evil-doom-boy-adventures.html`, `/evil-doom-girl-adventures.html`, `/games/evil-doom-girl/`, `/games/evil-doom-boy-adventures/`, `/games/evil-doom-girl-adventures/`, `/games/evil-doom-adventures/` and `/games/evil-doom-adventures-shadow-run/`.

Resolve internal links against `document.baseURI` and bind same-page fragments to the current nested document. Test News, Games, home, hero anchors, locale selection and browser Back from the nested product page. Preserve valid existing download destinations; the current audited page has no public APK/private Drive download. Do not add one or a Play Now button under this request.

Leave `content/news.json`, all historical article wording/dates/slugs/images/GUIDs, RSS and daily queue/publisher settings untouched. Today already has its queued publication. This artwork/page update authorizes no additional queued post, new article, fake date, launch promise, credential, grant, payment, security change or new service. Preserve Palace's engine, controller, assets, fixed deal and replay behavior, plus countdown and all unrelated app pages.

## Validation and publishing

Build with `node scripts/build-site.mjs`, run `node scripts/validate-site.mjs`, and verify deterministic output. Run the relevant Evil Doom identity/navigation/responsive checks, adapting assertions only for approved final behavior. Check 320, 390, 768 and 1440px, desktop and touch input, reduced motion, keyboard, meaningful image captions/alt text, complete home/catalog placement and all legacy URLs. Visually inspect full-page and game-media screenshots; source hashes alone do not establish correct rendering.

Compare the final news collection and RSS to the reconciled baseline byte-for-byte. Verify all other product records and protected Palace/countdown files. Confirm remaining draft routes stay absent. Check the public Palace demo still deals, accepts a move and restarts correctly. Keep source/game work read-only.

Run `node scripts/verify-evil-doom-release-ready.mjs --base RECONCILED_MAIN_SHA` with the actual reconciled main commit. It requires a verified `content/evil-doom-website-handoff.json`, complete media hashes/provenance, registry paths that actually use the verified tile and hero, removal of provisional hero copy, and unchanged news/Palace inputs. This gate currently remains blocked pending the game handoff; a successful local shell render does not satisfy it.

Standing authorization covers publishing this finished website change after verified game facts/media are received and these checks pass; no additional user acceptance is required by this prompt. Reconcile remote main immediately before the non-force push, then verify exact remote SHA, successful Pages workflow/deployment, direct live page/home/catalog URLs, live asset hashes and rendered screenshots. An uncertain push must be reconciled before retrying. Report any denied, pending or uncertain action precisely, without changing credentials or routing around a denial.

Return the exact commit and Pages evidence, direct live URLs, changed surfaces, verification results and remaining limits. If reference pixels or verified assets/facts are still unavailable, finish independent preparation, state that concrete dependency, and make no claim that the refreshed site is published.
