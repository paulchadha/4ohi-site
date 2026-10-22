# Swipeable showcases and game galleries

The homepage and Games page share a native-scroll game showcase containing all 18 verified games. Palace, Press Ahead, Sling Bling and GildenSpire lead. The homepage has a separate lower lifestyle showcase, led by Sleep Amigo, followed by SOVINTO and Whomly. The static catalog, complete shared navigation and 21-product footer remain available.

`scripts/carousel-content.mjs` generates semantic slide markup and galleries from approved images already in the repository. Related-product cards are excluded from each game's gallery. Existing actual-capture provenance is preserved in captions; concept artwork is not described as gameplay. Press Ahead retains its 0.2.0 developer-testing status, browser-capture labels and incomplete phone/cloud gates. Sling uses the current approved money-monster artwork.

Sixteen games have two or more distinct gallery images. Solitaire and War have one verified presentation image each, so their existing honest single-image layouts are retained without duplicate filler. No new images, game runtime, app binary or private download link is published.

`assets/swipe-carousel.js` adds arrows, selectable dots/current index, keyboard Left/Right/Home/End, mouse/pen drag and touch swipe. It advances forward every 15 seconds and offers an explicit pause control. Rotation pauses during hover, focus, gestures, document hiding or offscreen presentation. Reduced-motion preference disables automatic rotation and smooth movement. Vertical touch scrolling remains native. Without JavaScript, all slides and links remain in a native horizontal scrolling strip; the full catalog remains below.

Run `node scripts/build-site.mjs`, `node scripts/validate-site.mjs`, `node scripts/verify-news-schedule.mjs`, `node scripts/verify-workbench.mjs`, and `node scripts/verify-swipe-showcase.cjs`. Browser checks cover real elapsed 15-second rotation, controlled-clock pause scenarios, pointer drag, real CDP touch swipes and vertical scrolling, arrows/dots/keyboard/wrap, stable layout at 320–1440 pixels, all genuine galleries, caption/image/link checks, and JavaScript-disabled access. `SITE_URL` and `CAROUSEL_QA_OUT` select live targets/evidence output. The visibility transition is simulated through the standard `visibilitychange` handler during the timer test; that scope is explicit in its report.

No news records, publication dates, queue assignments, scheduler, credentials, security settings or app projects change in this release. Palace's engine, fixed-deal interface and countdown inputs remain unchanged.
