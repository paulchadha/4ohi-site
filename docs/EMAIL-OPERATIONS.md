# Email operations

## Current state

- Public contact: `support@4ohi.com` — operational, per company confirmation on 2026-07-25.
- The website routes support, privacy, security, and general inquiries through this address until separate approved addresses are confirmed.
- Public DNS currently routes mail through GoDaddy MX records. Provider account configuration, mailbox aliases, DKIM selectors, and message-level authentication results were not inspected in this website task.
- No email DNS or provider setting was changed during the website release.

## Required protection

Website work must never modify MX, SPF, DKIM, DMARC, provider-verification, or unrelated TXT records. Before any mail migration, export the full authenticated zone, record exact provider values, plan one coordinated change, and define a complete rollback. Never create duplicate SPF or DMARC records.

## Validation

For an authorized mail test:

1. Send from an unrelated mailbox to `support@4ohi.com`.
2. Reply from `support@4ohi.com`.
3. Inspect only the authentication headers needed to confirm SPF, DKIM, and DMARC results.
4. Record timestamp, sender/recipient roles, delivery result, and authentication status without storing message bodies or secrets.
5. Confirm the website and unrelated DNS still work.

## Operations and privacy

- Protect the responsible mail account with a unique password, 2FA, current recovery methods, and security notifications.
- Review billing, aliases, forwarding, recovery methods, active sessions, and authorized apps quarterly.
- Treat privacy and security correspondence as sensitive business records with least-privilege access.
- Define and approve retention rules for support messages before public launch.
- Never commit passwords, tokens, recovery material, private messages, or DKIM private keys.

## Recovery

If delivery fails, verify propagation, record syntax, account status, and provider status before changing DNS. Restore mail routing only as a complete, documented configuration; never mix partial provider configurations. Website rollback must not touch mail records.