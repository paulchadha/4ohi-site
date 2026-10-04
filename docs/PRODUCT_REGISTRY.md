# Product Registry

Source of truth: `scripts/studio-product-manifest.mjs`.

## Games

### Card Games
Palace (complete local browser game; app in private testing), Hearts (internal alpha), Spades (internal alpha), Euchre (internal alpha), Solitaire, War, and Gin Rummy (in development).

### Arcade, Defense & Adventure
GildenSpire, Thumb Command, Bobby the Breadasaurus, and Evil Doom Boy. All are in development. GildenSpire is the studio's dragon flight adventure: raise a dragon, direct its flight through a large world, and fight in aerial combat while pursuing the Golden Egg. Its canonical route is `/gildenspire.html`, with `/games/gildenspire/` retained as a compatible route.

Evil Doom Boy is one Action Adventure game published by Four of Hearts Interactive, LLC. Its canonical route is `/games/evil-doom-boy/`. Evil Doom Boy is the default playable hero, Evil Doom Girl is the alternate playable hero, and Evil Doom is the antagonist. The product record carries legacy names and routes only for compatibility redirects. No canonical game repository has been verified; the registry marks that mapping `NEEDS CONFIRMATION`.

### Puzzle & Creative
BooYang City, Funky Town, Unicorn Blast, Princess Land Adventures, Unicorn Land Adventures, and Sling Nouveau. All are in development. BooYang City is a connected city of mini-adventures; Funky Town is a creative city builder where progression transforms neighborhoods through art, music, and player expression. Sling Nouveau is a colorful physics playground with a typography-led treatment because approved art is not available in this repository; no public playable build is exposed.

Unicorn Blast retains the stable `heartstack` ID and `/heartstack-unicorn-blast.html` route. Its former names are aliases, and published article wording stays historical. It is distinct from Unicorn Land Adventures. Product journals are matched by stable `id` values in the shared `content/news.json` collection.

## Lifestyle Apps
SOVINTO, Whomly, and Sleep Amigo are lifestyle applications in development. SOVINTO supports negotiation preparation, with practice, tools and live coaching still in development; its canonical page is `/sovinto.html`. Whomly organizes publicly available professional information for user-directed research; Sleep Amigo turns available sleep information into general wellness guidance. They are deliberately excluded from `gameCatalog` and have separate pages and navigation.

Every registry item declares a stable key, canonical title, route, product type, status, availability language, artwork, alt text, CTA, grouping, and visual theme. Add future products here first; the homepage, Games page, Lifestyle Apps page, navigation, footer, related-product blocks, structured data, sitemap, and tests consume this data.
