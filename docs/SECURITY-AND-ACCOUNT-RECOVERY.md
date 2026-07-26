# Security and account recovery

## Ownership and protections

| Service | Responsible account | Required protection | Recovery dependency |
|---|---|---|---|
| GitHub / `paulchadha/4ohi-site` | company source administrator | unique password, 2FA, protected recovery codes, reviewed collaborators | GitHub recovery and company ownership records |
| GoDaddy / `4ohi.com` | company domain administrator | unique password, 2FA, domain lock, current recovery email and phone | registrar recovery and company ownership records |
| Company email | company mail administrator | unique password, 2FA, current recovery method, reviewed forwarding and aliases | mail-provider recovery and company ownership records |

Do not store passwords, session cookies, tokens, recovery codes, recovery phrases, DKIM private keys, or private account exports in this repository.

## Baseline controls

- Require 2FA on every administrator account.
- Use an organization-controlled recovery route, not a disposable or former-employee address.
- Keep at least two authorized recovery custodians when operationally possible.
- Review active sessions, authorized apps, forwarding, aliases, repository collaborators, Pages settings, and registrar delegates quarterly.
- Keep the domain locked except during a planned transfer and enable provider security notifications.
- Protect `main` and require review when the team grows beyond one maintainer.

## Recovery runbook

1. Use a known-clean device and navigate directly to the provider.
2. Confirm the incident scope before changing unrelated settings.
3. Recover the primary account through the provider's official flow.
4. Rotate the password and invalidate other sessions.
5. Reissue 2FA and offline recovery material.
6. Review DNS, forwarding, filters, aliases, API access, Git remotes, collaborators, Pages configuration, and billing.
7. Record non-secret evidence, timestamps, changes, and verification.
8. Notify affected users or authorities when legally or operationally required.

## Domain loss prevention

Confirm the public registry expiration of 2028-07-25 in GoDaddy, verify auto-renew and the payment method quarterly, and maintain reminders at 90, 60, and 30 days before expiration. Confirm the intended registry lock status in the authenticated account.

## Website and DNS controls

The canonical hostname is `4ohi.com`; `www.4ohi.com` redirects to it. Only an authenticated company administrator may change the zone. Capture a complete before-state and after-state. Preserve MX, SPF, DKIM, DMARC, provider-verification, Domain Connect, and unrelated TXT records. Enable GitHub Pages HTTPS enforcement only after DNS resolves exclusively to GitHub and matching certificates are presented for both hostnames.

GitHub Pages account-level domain verification is active: the unique `_github-pages-challenge-paulchadha.4ohi.com` TXT is publicly published and the Pages API reports `protected_domain_state: verified`. Retain the TXT permanently. Follow the non-destructive procedure in `DOMAIN-AND-DNS.md` for future re-verification; never replace an existing Proton record.

## Current limitations

2FA state, recovery contacts, authorized sessions, domain auto-renew, billing, and the complete private DNS zone require authenticated review and are not confirmed by this repository. No authenticated account setting was changed in the website release.## Static-site browser security

Generated pages include a CSP meta policy limiting content, scripts, images, styles, connections, fonts, media, form actions, base URLs, and insecure upgrades to the same origin. Each inline JSON-LD block receives a page-specific SHA-256 script hash. Inline styles remain allowed because the trusted site script updates pointer-position CSS variables and acceptance testing applies text zoom; no visitor value becomes CSS.

The public JavaScript uses no `eval`, dynamic function construction, visitor-controlled HTML, remote API, cookie, local storage, session storage, form backend, third-party widget, analytics, ad technology, or remote font. Tutorial template HTML and status messages are fixed application constants.

GitHub Pages does not provide repository-configurable response headers. A meta CSP cannot supply controls such as `frame-ancestors`, HSTS, Permissions-Policy, or cross-origin isolation. HTTPS enforcement supplies transport redirection once certificates are valid, but stronger response-header controls would require a supported edge or hosting layer and a separate reviewed migration.

## Founder redesign security boundary

New interaction remains static and same-origin. The tutorial and naming setting perform no backend request, accept no arbitrary HTML, persist no visitor state, and add no dependency. The Easter egg is explicitly not a security boundary. CSP remains self-only for scripts, styles, images, fonts, and connections within GitHub Pages limitations.
