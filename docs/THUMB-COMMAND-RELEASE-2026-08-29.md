# Thumb Command production release

Date: 2026-08-29

## Release scope

- Replaced the retired arcade identity with **Thumb Command** across the company site.
- Added the canonical \`/thumb-command.html\` landing page and five substantive newsroom articles.
- Added the approved app icon unchanged, seven original campaign illustrations, responsive derivatives, and provenance hashes.
- Added a prominent homepage feature and clickable catalog tile.
- Added compatibility documents for the retired game URL and three retired article URLs.
- Removed retired artwork, styles, content modules, drafts, and stale visual-evidence files.

## Production target and rollback

- Repository: \`paulchadha/4ohi-site\`
- Branch: \`main\`
- Host: GitHub Pages with custom domain \`4ohi.com\`
- Pre-release rollback commit: \`e47513ca0a797c2df60b3c55680f210e4304d92f\`

## Deployment record

- Implementation commit: \`ed5bbb47b2e9a9a27e2638152a15003c41e90c73\`
- GitHub Pages workflow: \`33270937191\`
- GitHub Pages deployment: \`6159295320\`

## Required release gate

Run:

    python scripts/process-thumb-command-art.py
    node scripts/build-site.mjs
    node scripts/validate-site.mjs
    node scripts/verify-company-architecture.mjs

The browser verifier must pass locally and against \`https://4ohi.com\` after the Pages deployment completes.
