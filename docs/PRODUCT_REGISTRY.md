# Product Registry

Source of truth: `scripts/studio-product-manifest.mjs`.

## Games

### Card Games
Palace (interactive website preview; app in development), Hearts (internal alpha), Spades (internal alpha), Euchre (internal alpha), Solitaire (in development), and War (in development).

### Arcade, Defense & Adventure
Thumb Command, Bobby the Breadasaurus, and Evil Doom Boy. All are in development.

Evil Doom Boy is one Action Adventure game published by Four of Hearts Interactive, LLC. Its canonical route is `/games/evil-doom-boy/`. Evil Doom Boy is the default playable hero, Evil Doom Girl is the alternate playable hero, and Evil Doom is the antagonist. The product record carries legacy names and routes only for compatibility redirects. No canonical game repository has been verified; the registry marks that mapping `NEEDS CONFIRMATION`.

### Puzzle & Creative
HeartStack Unicorn Blast, Princess Land Adventures, and Unicorn Land Adventures. All are in development.

## Lifestyle Apps
People Lens and Sleep Amigo are early lifestyle application concepts. They are deliberately excluded from `gameCatalog` and have separate pages and navigation.

Every registry item declares a stable key, canonical title, route, product type, status, availability language, artwork, alt text, CTA, grouping, and visual theme. Add future products here first; the homepage, Games page, Lifestyle Apps page, navigation, footer, related-product blocks, structured data, sitemap, and tests consume this data.
