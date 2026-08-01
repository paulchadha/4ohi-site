# New Layout Physical Review

Date: 2026-08-01
Branch: rebuild/game-first-studio-site

## Rendered review

The generated site was served locally and exercised in Chromium, not reviewed from templates alone. The 35-test second-stage suite passed at 360×800, 390×844, 430×932, 844×390, 768×1024, 1366×768, and 1440×900.

Verified:

- zero horizontal overflow at every acceptance viewport;
- zero broken visible artwork after sequential lazy-load scrolling;
- no console or page errors;
- one H1 and semantic main landmark;
- four full-region editorial game links and seven full-region portfolio links;
- visible keyboard focus, accessible mobile menu, and reduced-motion behavior;
- Bobby and Evil Doom mobile captures, including the approved purple treatment.

Fresh captures are under docs/visual-evidence/second-stage/. canadian-route-flow.gif demonstrates the default homepage, Canadian selection, and mode-preserving game-route journey.

The in-app browser/image viewer was blocked by a Windows ACL sandbox failure, so the physical review used standalone Playwright screenshots, browser geometry, computed styles, image load state, and interaction assertions. Founder visual sign-off remains intentionally pending.
