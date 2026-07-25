# Security and account recovery

## Account ownership

| Service | Responsible account | Required protections | Recovery dependency |
|---|---|---|---|
| GoDaddy | Company domain administrator | unique password, 2FA, domain lock, current recovery email/phone | registrar recovery and company ownership records |
| Proton Mail | Company mail administrator | unique password, 2FA, recovery method, recovery phrase/file held offline if enabled | Proton recovery process and company ownership records |
| GitHub | Company source administrator | unique password, 2FA, protected recovery codes held offline | GitHub recovery and repository ownership |

Do not store passwords, session cookies, tokens, recovery codes, recovery phrases, DKIM private keys, or private account exports in this repository.

## Baseline

- Require 2FA on all three services.
- Use an organization-owned recovery route rather than a disposable or former-employee address.
- Keep at least two authorized recovery custodians when the company is ready to support that separation.
- Review active sessions, authorized apps, forwarding, aliases, repository collaborators, Pages settings, and registrar delegates quarterly.
- Keep the GoDaddy domain locked except during a planned transfer.
- Enable provider security notifications.

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

- Confirm expiration and auto-renew in GoDaddy.
- Maintain a renewal calendar at 90, 60, and 30 days before expiration.
- Verify the payment method at least quarterly and after any card/account change.
- Keep registry lock status in the quarterly review.

## Incident rollback

DNS restoration must use the last verified zone export and the current documentation. Repository restoration must use a signed-in authorized GitHub account and a known-good commit. Mail recovery must prioritize stopping unauthorized forwarding and access before changing public DNS.

## Current limitations

2FA, recovery contacts, domain lock, and authorized sessions require authenticated account inspection and are not yet confirmed.
