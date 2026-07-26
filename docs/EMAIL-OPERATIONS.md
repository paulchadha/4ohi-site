# Email operations

## Current state

- Public contact: `support@4ohi.com` — operational. On 2026-07-25 the founder physically confirmed receipt of an inbound message from an unrelated mailbox and successful receipt of the reply sent from `support@4ohi.com`.
- The website routes support, privacy, security, and general inquiries through this address until separate approved addresses are confirmed.
- Public DNS routes mail through Proton Mail: MX 10 `mail.protonmail.ch`, MX 20 `mailsec.protonmail.ch`, SPF `v=spf1 include:_spf.protonmail.ch ~all`, DMARC `v=DMARC1; p=quarantine`, the Proton verification TXT record, and all three Proton DKIM CNAME selectors.
- Authoritative GoDaddy DNS, Google Public DNS, and Cloudflare DNS returned the same mail records after the website-only cutover.
- The website cutover did not replace or remove any Proton Mail record. Outbound TCP port 25 is blocked from the launch-verification environment, so SMTP banner testing here is not evidence of mailbox failure or success.
## Required protection

Website work must never modify MX, SPF, DKIM, DMARC, provider-verification, or unrelated TXT records. Before any mail migration, export the full authenticated zone, record exact provider values, plan one coordinated change, and define a complete rollback. Never create duplicate SPF or DMARC records.

## Validation

For an authorized mail test:

1. Send from an unrelated mailbox to `support@4ohi.com`.
2. Reply from `support@4ohi.com`.
3. Inspect only the authentication headers needed to confirm SPF, DKIM, and DMARC results.
4. Record timestamp, sender/recipient roles, delivery result, and authentication status without storing message bodies or secrets.
5. Confirm the website and unrelated DNS still work.

Current result: pass. No message body, correspondent address, credential, or private header was recorded in the repository.

## Operations and privacy

- Protect the responsible mail account with a unique password, 2FA, current recovery methods, and security notifications.
- Review billing, aliases, forwarding, recovery methods, active sessions, and authorized apps quarterly.
- Treat privacy and security correspondence as sensitive business records with least-privilege access.
- Define and approve retention rules for support messages before public launch.
- Never commit passwords, tokens, recovery material, private messages, or DKIM private keys.

## Recovery

If delivery fails, verify propagation, record syntax, account status, and provider status before changing DNS. Restore mail routing only as a complete, documented configuration; never mix partial provider configurations. Website rollback must not touch mail records.

## Redesign preservation note

No mail or DNS configuration was touched. The founder’s July 25, 2026 physical confirmation of unrelated inbound delivery and a successful reply from support@4ohi.com remains the latest mailbox evidence; website deployment does not replace mailbox testing.

## App-parity release preservation

The app-parity release made no mail or DNS change. The authoritative zone still returns Proton MX priorities 10/20, SPF, verification TXT, DMARC quarantine, and all three DKIM CNAME selectors exactly as documented. The founder's release-thread confirmation that inbound mail and a support reply work remains the mailbox-delivery evidence; DNS alone is not treated as delivery proof.
