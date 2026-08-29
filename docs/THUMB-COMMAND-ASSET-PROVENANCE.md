# Commander Thum-B asset provenance

## Approved source

`docs/source-assets/thumb-command/thumb-command-approved-app-icon.png` is the approved 1254×1254 app artwork supplied from the local game project on 2026-08-29. It is preserved unchanged and is the definitive branding source.

## Original supplemental artwork

The request described Chicago, San Francisco, New York City, London, Tokyo, Blueguard, alien fleet, mothership, upgrade, and defense artwork, but those files were not attached separately. The following original masters were generated for this production release from the approved written art direction:

- `thumb-command-chicago-gameplay-source.png`
- `thumb-command-city-san-francisco-source.png`
- `thumb-command-city-new-york-source.png`
- `thumb-command-city-london-source.png`
- `thumb-command-city-tokyo-source.png`
- `thumb-command-blueguard-upgrades-source.png`
- `thumb-command-alien-fleet-source.png`

The built-in image-generation tool was used. The common prompt constrained every scene to premium modern 3D animated arcade art; a royal-blue, cyan, white, and gold hero; purple, magenta, violet, coral, and black aliens; recognizable shielded cities; family-friendly action; no text, logos, trademarks, copyrighted characters, gore, UI, borders, or watermarks. City prompts varied only landmark, weather, and light. The Blueguard prompt required four related stages plus eight defense systems. The alien prompt required six readable classes and one central mothership.

## Derivatives

`scripts/process-thumb-command-art.py` produces deterministic WebP, JPEG, PNG, article-header, and social derivatives in `assets/thumb-command/`. `provenance.json` records SHA-256 hashes for every master and the complete public output list. Re-run the processor after any approved source update; never edit the preserved masters in place.
