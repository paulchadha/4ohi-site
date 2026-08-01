# Mobile Layout Acceptance

Date: 2026-08-01

## Required compositions

Passed in rendered Chromium:

- 360×800
- 390×844
- 430×932
- 844×390 landscape
- 768×1024 tablet portrait
- 1366×768 laptop
- 1440×900 desktop

## Acceptance results

All sizes returned one H1, zero horizontal overflow, zero broken loaded artwork, and zero browser errors. The mobile navigation opened with synchronized aria-expanded and navigation state. Major game regions remained full-width touch targets. The Bobby feature retained its character-led crop. The Evil Doom feature switched to contained artwork so both heroes and the purple framing remain available instead of being sliced by a desktop crop.

Evidence: docs/visual-evidence/second-stage/second-stage-results.json and the default/Canadian PNG captures in the same directory.
