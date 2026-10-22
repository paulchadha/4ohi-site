# Tile-first homepage restoration

The homepage returns to the earlier tile-first layout, including the familiar GildenSpire, Sling Bling and Press Ahead features, static collections, lifestyle app grid and latest news. All 18 games and 3 apps appear in the opening tile panel. No homepage carousel hides catalog entries.

`assets/home-tile-refinements.css` tightens only homepage spacing, grid gaps, card proportions, alignment and action-button contrast. Tablet/desktop use seven columns; narrow phones use three columns with a natural vertical continuation. All 21 tiles fit the first 900-pixel screen at the tested 768/1280/1440 widths. Phones show the opening rows immediately and retain every item in the same visible grid.

Current money-monster artwork, Press Ahead's page and developer-testing status, the complete catalog/footer, all 48 published articles, Palace's fixed demo and countdown inputs remain intact. Game-page image galleries and the separate Games showcase remain available. Solitaire and War retain their one-image layouts.

The change uses a new commit based on the deployed carousel release, rather than rolling back unrelated content. Checks cover desktop/mobile top-to-bottom rendering at 320/390/768/1280/1440 pixels, all 21 tile links, current artwork, every familiar lower section, full footer, no horizontal overflow, JavaScript-disabled access, and retained gallery/showcase controls. News records, publication dates, queue assignments, automation, private downloads and app projects are unchanged.
