# Thumb Command website

Thumb Command is a Four of Hearts Interactive arcade-defense game in development. Its public promise is **Save Planet Earth**. No public build, platform launch, store listing, or release date is announced.

## Product identity

- Canonical clean route: `/games/thumb-command/`
- Static compatibility implementation: `/thumb-command.html`
- Homepage, navigation, catalog, newsroom, RSS, sitemap, metadata, and structured data derive from the shared catalog and content system.
- The Blueguard interceptor uses royal blue, cyan, white, and gold. Alien ships use purple, magenta, violet, coral, and black.
- Chicago is the flagship environment. San Francisco, New York City, London, and Tokyo complete the current world-tour presentation.

## Approved artwork and derivatives

The four founder-approved PNG source boards are preserved in `assets/thumb-command/source/`. `scripts/process-thumb-command-art.py` creates responsive WebP crops for the app icon, Chicago gameplay, each campaign city, Blueguard, alien fleet, Mothership, and defense systems, plus a 1200×630 social image.

## News

The newsroom publishes five substantive Thumb Command stories:

- Introducing Thumb Command: Save Planet Earth
- The City Is the Base: Building Thumb Command’s New Battlefields
- Meet the Blueguard: Earth’s Last Interceptor
- Designing the Alien Invasion of Thumb Command
- From Chicago to Tokyo: The Thumb Command World Tour

All stories report an in-development product and make no unsupported availability claim.

## Compatibility routes

The retired public game and article URLs remain only as noindex compatibility pages. They immediately replace their location with the closest new Thumb Command destination and preserve query strings and fragments. GitHub Pages cannot emit custom origin-level 301 status codes; these static redirects are the safest available mechanism on the existing host.

## Validation

Run the generator, static validator, architecture suite, and `scripts/verify-thumb-command.mjs`. The rendered suite covers Android phone, iPhone, tablet, laptop, and large desktop widths; navigation, overflow, images, required content, gallery keyboard behavior, old-route forwarding, metadata, newsroom inclusion, console errors, and legacy-name absence.
