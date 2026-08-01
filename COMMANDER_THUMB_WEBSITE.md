# Commander Thum-B Website

## Identity and status

- The only approved title is **Commander Thum-B**. The capital `B` is intentional.
- Route: `/commander-thumb.html`.
- Browser title: `Commander Thum-B | Four of Hearts Interactive`.
- Parent company: Four of Hearts Interactive; compact mark: 4OH.
- Status: **Coming Soon**. The page has no play or download link, no invented release date, and no released claim.
- Commander Thum-B is one of seven peer game properties beside Palace, Bobby the Breadasaurus, Evil Doom Adventures: Shadow Run, Hearts, Spades, and Euchre. It is not a company or sub-brand.

## Page treatment

The July 2026 founder revision replaces the long planet-diagram presentation with a shorter, original 1970s-inspired promotional story:

1. One hero title treatment over original text-free retro-futurist artwork.
2. A three-panel story reel: Thum A invades, Thum B defends, Thum C watches.
3. A compact gameplay mission: one-thumb movement, automatic fire, power-ups, Wing ThumBs, ship/base progression, and a planned 1,000-level campaign.
4. A ten-boss milestone reel.
5. Three truthful development-news links and a final Coming Soon lockup.

The visual language uses warm print-paper colors, orange/plum/avocado accents, bold period-inspired typography, offset shadows, panel borders, and cinematic illustration. It is an original treatment and does not reproduce a third-party layout, logo, character, or campaign.

## Artwork protocol

The page uses an original generated, text-free 1970s retro-futurist space illustration. Approved source and deployment derivatives are separate:

- `docs/source-assets/commander-thumb-70s-promo-source.png` — source record.
- `assets/commander-thumb-70s-hero-1600.webp` — desktop hero.
- `assets/commander-thumb-70s-hero-960.webp` — phone/tablet hero and catalog/news art.
- `assets/og-commander-thumb-70s.jpg` — social preview.

Never overwrite the source. Optimize derivatives, preserve explicit dimensions, use descriptive alt text, and keep text in HTML rather than baking it into the image. Older approved Commander character and boss assets remain below the fold where they are readable and useful.

## News

Published records:

- `Commander Thum-B Is Coming to Four of Hearts Interactive`
- `Welcome to the Thum System`
- `Building Commander Thum-B: One Thumb, One Ship, One Big Defense`

All are dated July 26, 2026, tagged to Commander Thum-B, and state that the game is in development. `content/drafts/commander-thumb-has-arrived.json` is intentionally unpublished until a working public version exists.

## Accessibility and responsive behavior

- One H1 and one visual title treatment.
- Studio header plus Commander-local navigation.
- Native keyboard Games disclosure, mobile menu, visible focus, and 40–44 pixel actions.
- Responsive hero crop and stacked story/mission/news layouts at phone sizes.
- No horizontal overflow at 320, 375, 430, 768, 1024, 1366, or 1920 pixels.
- Meaningful alt text; story relationships never depend on color alone.
- Reduced-motion rules remove decorative transforms/transitions.
- No autoplay, flashing, remote font, account, cookie, storage, analytics, advertising, or tracking dependency.

## Metadata and validation

`VideoGame` JSON-LD identifies Four of Hearts Interactive as publisher and does not claim release availability. Canonical, Open Graph, Twitter, CSP, alternate-language, sitemap, and RSS data come from the shared generator.

Run:

```powershell
node scripts/build-site.mjs
node scripts/validate-site.mjs
node scripts/verify-company-architecture.mjs
```

## August 1, 2026 status and scope correction

The approved public title is **Commander Thum-B**. Its website status is **In Development**. It is a distinct Four of Hearts Interactive game and is never presented as the company. The overview uses a single title treatment, links to Commander news, and describes one-thumb arcade defense through escalating waves.

The public page no longer frames the concept art as a completed fixed 1,000-level product. Boss artwork is labeled as threat concepts rather than shipped level milestones. No public-play action is shown because no working public version exists.

Canonical clean route: `/games/commander-thum-b`. Backward-compatible static route: `/commander-thumb.html`.