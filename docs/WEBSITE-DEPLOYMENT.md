# Website deployment

## Target

- Owner/repository: `paulchadha/4ohi-site` (public)
- Host: GitHub Pages
- Source: `main`, repository root
- Build: none
- Canonical URL: `https://4ohi.com/`
- Alternate hostname: `www.4ohi.com`, intended to redirect to the apex

## Current status

GitHub Pages is configured. Release workflow `30175139178` successfully built and deployed commit `874e28deb1a917bc050854cbc1c3b0a6de754e20` on 2026-07-25. The repository `CNAME` contains `4ohi.com`. Website DNS still serves the GoDaddy placeholder, so the custom-domain certificate is not provisioned and HTTPS enforcement remains off. `support@4ohi.com` is operational; no mail record was changed by this release.

## Release workflow

1. Confirm the worktree is clean and synchronized with `origin/main` before editing.
2. Preview locally and run `node scripts/validate-site.mjs`.
3. Test every page, internal link, email link, image, 404, keyboard focus, reduced motion, and requested responsive size.
4. Run `git diff --check`, review the complete diff, and scan for secrets.
5. Commit reviewed files and push `main` without force.
6. Wait for `pages-build-deployment` to complete and confirm its head SHA matches the pushed commit.
7. Verify the published pages and resources. Before DNS cutover, use the GitHub Pages deployment status as the source of truth because the configured `github.io` URL redirects to the custom domain.
8. Record the commit, workflow URL, result, and remaining domain work.

## Custom-domain and HTTPS procedure

Follow `DOMAIN-AND-DNS.md`. Export the authenticated zone, change website-only records, preserve every mail record, verify apex and `www` propagation, wait for certificates, then enable HTTPS enforcement in GitHub Pages. Confirm canonical redirects and rerun browser checks at the custom domain.

## Rollback

- Content: revert the release commit with a new commit and push; do not rewrite published history.
- Deployment: verify the rollback Pages workflow reaches the revert commit.
- DNS: restore only the documented pre-cutover website A and `www` records.
- Never alter MX, SPF, DKIM, DMARC, or provider-verification records during website rollback.

## Review evidence

Responsive browser evidence and machine-readable results are stored in `docs/visual-evidence/`. The release checklist records what was validated and what remains blocked by domain cutover or legal review.