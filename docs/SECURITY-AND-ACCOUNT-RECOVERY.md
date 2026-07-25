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

The canonical hostname is `4ohi.com`; `www.4ohi.com` should redirect to it after cutover. Only an authenticated company administrator may change the zone. Capture a complete before-state and after-state. Preserve MX, SPF, DKIM, DMARC, provider-verification, Domain Connect, and unrelated TXT records. Keep GitHub Pages HTTPS enforcement off until DNS resolves to GitHub and certificates match both hostnames.

## Current limitations

2FA state, recovery contacts, authorized sessions, domain auto-renew, billing, and the complete private DNS zone require authenticated review and are not confirmed by this repository. No authenticated account setting was changed in the website release.