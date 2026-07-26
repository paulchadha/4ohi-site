# Website deployment

## Target

- Owner/repository: `paulchadha/4ohi-site` (public)
- Host: GitHub Pages
- Source: `main`, repository root
- Build: dependency-free static generator (`node scripts/build-site.mjs`); generated files are committed
- Canonical URL: `https://4ohi.com/`
- Alternate hostname: `www.4ohi.com`, intended to redirect to the apex

## Current status

GitHub Pages is configured, the repository `CNAME` contains `4ohi.com`, and authoritative plus public DNS route the apex and `www` to GitHub Pages. The GoDaddy Website Builder placeholder is retired. The certificate is approved for both hostnames, HTTPS enforcement is enabled, canonical redirects pass, and the complete public browser suite passes. Certificate, enforcement, redirect, public-browser, and mail evidence are recorded in `RELEASE-CHECKLIST.md` and `PUBLIC-LAUNCH-VERIFICATION.md`.

## Release workflow

1. Confirm the worktree is clean and synchronized with `origin/main` before editing.
2. Run `node scripts/build-site.mjs`, rerun it to confirm idempotence, preview locally, run `node scripts/validate-site.mjs`, and syntax-check all site and tutorial scripts.
3. Test every page, internal link, email link, image, 404, keyboard focus, text zoom, reduced motion, and requested responsive size locally with `scripts/verify-palace-site.mjs` and publicly with `scripts/verify-public-site.mjs`.
4. Complete the six-chapter Palace preview, its friendly-error branch, and both decisions in the Hearts, Spades, and Euchre lessons; confirm all replay states.
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