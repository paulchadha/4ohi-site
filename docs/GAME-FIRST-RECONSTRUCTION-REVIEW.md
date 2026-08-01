# Game-First Reconstruction Review

## Founder review order

1. Homepage initial state: Palace.
2. Homepage feature selector: Bobby the Breadasaurus.
3. Homepage feature selector: Evil Doom Adventures: Shadow Run.
4. Homepage feature selector: Commander Thum-B.
5. Games mega menu and View All Games.
6. Full Games index and all seven destinations.
7. Palace overview and interactive mini-match.
8. Bobby, Shadow Run, and Commander Thum-B overview pages.
9. Hearts, Spades, and Euchre Quick Play pages.
10. News and About.
11. Phone navigation and feature selector at 375px.

## Architecture

`scripts/game-catalog.mjs` is the sole game manifest. It owns canonical title, slug, short description, status, availability, genre, actions, theme, artwork, focal point, featured priority, and playable state. `scripts/build-site.mjs` consumes it for the mega menu, homepage feature stage, all-games section, catalog, and metadata.

The global hierarchy is Four of Hearts Interactive → Games → individual titles. Palace-specific table naming remains only in Palace context. The extensionless compatibility routes under `/games/...`, `/play`, `/news`, `/about`, `/support`, and `/privacy` redirect to the existing static pages; older `.html` URLs remain valid.

## Interaction model

- Four manual homepage tabs; no autoplay.
- Click, keyboard arrows, Home, and End select a feature.
- Desktop Games disclosure closes with Escape and outside interaction.
- Mobile menu and nested Games accordion expose the same seven destinations.
- Current page and focus are visible.
- Reduced-motion preferences suppress nonessential transitions.
- No cookies, tracking, local storage, or session storage are introduced.

## Status truth

- Palace: Interactive Preview.
- Bobby the Breadasaurus: In Development.
- Evil Doom Adventures: Shadow Run: In Development.
- Commander Thum-B: In Development.
- Hearts, Spades, Euchre: Internal Alpha teaching previews.

Commander Thum-B page language describes concept threats and escalating waves; it does not claim a completed 1,000-level product. Evil Doom Girl uses approved purple `#4E2A84`.

## Evidence

Browser artifacts and `reconstruction-results.json` are under `docs/visual-evidence/reconstruction/`. The automated matrix covers 320×568, 375×812, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080, and 844×390.

## Founder acceptance checklist

- [ ] Approve visual hierarchy and overall feeling.
- [ ] Approve all four feature-panel crops.
- [ ] Approve mega-menu density and mobile presentation.
- [ ] Approve seven-game catalog order and status labels.
- [ ] Approve individual game page identities.
- [ ] Approve news and About presentation.
- [ ] Grant permission to merge.

No push, merge, or deployment is part of this isolated reconstruction.