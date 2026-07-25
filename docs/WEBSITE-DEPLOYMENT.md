# Website deployment

## Target

- Repository: `4ohi-site`
- Host: GitHub Pages
- Canonical URL: `https://4ohi.com/`
- Alternate hostname: `www.4ohi.com`, redirected to the apex
- Source: default branch, repository root
- Build: none

## Current deployment status

- GitHub repository: `https://github.com/paulchadha/4ohi-site`
- Visibility: public
- Default branch: `main`
- GitHub Pages: live at `https://paulchadha.github.io/4ohi-site/`
- Initial successful Pages build: commit `1680887f9ee268e8e04e37996576167e4ab8689a` at 2026-07-25 16:44:49 UTC`r`n- Temporary URL verification: required HTML pages, stylesheet, favicon, and Palace icon returned HTTP 200; an unknown route returned HTTP 404`r`n- Custom domain: intentionally deferred until authenticated GoDaddy access is available

## First deployment

1. Create a private or public GitHub repository as appropriate for Pages plan eligibility.
2. Push the complete, clean source tree.
3. Enable GitHub Pages from the default branch and repository root.
4. Verify the temporary `github.io` URL before changing DNS.
5. Configure the custom domain `4ohi.com`; GitHub will create or update the repository `CNAME` declaration.
6. Copy GitHub's current DNS targets exactly into GoDaddy after saving the old website records.
7. Configure `www` using GitHub's current CNAME instruction.
8. Wait for GitHub's DNS check, then enforce HTTPS.
9. Verify apex and `www`; use the platform's domain behavior to keep the apex canonical.

## Validation

Run the release checklist. At minimum test every page, internal and email links, 404 behavior, responsive widths, keyboard access, metadata, no mixed content, no unexpected cookies or tracking requests, TLS, and canonical redirects.

## Rollback

- Content rollback: revert the relevant website commit and push.
- Deployment rollback: select the previously known-good commit/branch in Pages.
- DNS rollback: restore the pre-change GoDaddy website A records and `www` CNAME documented in `DOMAIN-AND-DNS.md`.
- Do not alter MX, SPF, DKIM, DMARC, or Proton verification during a website rollback.

## Dependencies and limitations

The site depends on GitHub account access, repository availability, GitHub Pages, GoDaddy DNS, annual domain renewal, and valid HTTPS provisioning. GitHub authorization and the authenticated GoDaddy change remain pending.
