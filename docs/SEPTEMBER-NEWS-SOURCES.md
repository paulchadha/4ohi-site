# September news and SOVINTO typography — source notes

Publication date: September 12, 2026. All four new stories are published on that date. Earlier development dates are labeled inside the articles; existing September 3–5 publication dates remain unchanged.

## Evidence reviewed

- BooYang City commit def175e, September 11: animal feeding repair checkpoint. September 12 toy-town README: animal center/zoo/reserve and bakery/restaurant/five-star growth, browser progression checks and bounded Samsung checks; higher stages remain browser-only.
- GildenSpire September 12 rigged-assets/AUDIT_CHECKPOINT.md and eacef40: original dragon/environment work and native campaign verification; visual polish and sustained performance remain unfinished.
- Evil Doom Boy September 12 BATTLE_SPEED.md: implemented 0.5/1/2/4 speed selector and native/browser pause/combat checks.
- SleepAmigo PORTFOLIO_AUDIT.md, included in the September 12 portfolio audit: refresh completion and redundant-write repairs, ten Samsung refresh checks and restart. No universal provider/device claim.
- September 12 portfolio audit: scoped card-game timing/control, Princess photo-readiness, and Unicorn entry/photo repairs. No blanket app release or app-store availability claim.
- Whomly README: optional configured AI public-search and structured-brief workflow. Does not establish a deployed provider or public availability.
- Current authorization: SOVINTO live guidance and Funky Town redesign remain in development. They are not reported as completed releases.

## Typography root cause

The desktop hero title grew with viewport units while its grid column stayed near 480px. `overflow-wrap:anywhere` then split the product name without triggering horizontal-overflow checks. At 1920px this produced SOVINT / O. The fixed-width status card combined viewport-sized type and unrestricted word breaking, producing In / Developmen / t at 1440px and above.

The SOVINTO title now sizes against its own column and stays on one line. Status headings size against their card and wrap only at word boundaries. Tests measure character rectangles, verifying whole words and visible bounds at 20 widths (320–2560px) and 100%, 125%, 150%, 200% text sizing. CSS viewport widths cover effective browser-zoom layout sizes; this is browser automation, not physical-device testing.
