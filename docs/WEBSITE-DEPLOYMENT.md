# Website deployment

## Target

- Owner/repository: `paulchadha/4ohi-site` (public)
- Host: GitHub Pages
- Source: `main`, repository root
- Build: none
- Canonical URL: `https://4ohi.com/`
- Alternate hostname: `www.4ohi.com`, intended to redirect to the apex

## Current status

GitHub Pages is configured and the last published release is healthy. The repository `CNAME` contains `4ohi.com`. Website DNS still serves the GoDaddy placeholder, so the custom-domain certificate is not provisioned and HTTPS enforcement remains off. `support@4ohi.com` is operational; no mail or DNS record was changed by the interactive-site release.

## Release workflow

1. Confirm the worktree is clean and synchronized with `origin/main` before editing.
2. Preview locally and run `node scripts/validate-site.mjs` plus `node --check assets/play.js`.
3. Test every page, internal link, email link, image, 404, keyboard focus, reduced motion, and requested responsive size.
4. Complete all four Quick Play lessons, including one friendly error path, tab arrow-key navigation, heart progress, reset, and final completion state.
5. Run `git diff --check`, review the complete diff, and scan for secrets.
6. Commit reviewed files and push `main` without force.
7. Wait for `pages-build-deployment` to complete and confirm its head SHA matches the pushed commit.
8. Verify the published deployment object and record the result.

## Custom-domain and HTTPS procedure

Follow `DOMAIN-AND-DNS.md`. Export the authenticated zone, change website-only records, preserve every mail record, verify apex and `www` propagation, wait for certificates, then enable HTTPS enforcement in GitHub Pages. Confirm canonical redirects and rerun browser checks at the custom domain.

## Rollback

- Content: revert the release commit with a new commit and push; do not rewrite published history.
- Deployment: verify the rollback Pages workflow reaches the revert commit.
- DNS: restore only the documented pre-cutover website A and `www` records.
- Never alter MX, SPF, DKIM, DMARC, or provider-verification records during website rollback.

## Review evidence

Responsive screenshots and machine-readable interaction results are stored in `docs/visual-evidence/`. The release checklist records what was validated and what remains blocked by domain cutover or legal review.