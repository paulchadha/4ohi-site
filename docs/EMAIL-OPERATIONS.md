# Email operations

## Intended service

- Provider: Proton Mail paid subscription
- Custom domain: `4ohi.com`
- Responsible account: company Proton account; no credentials are stored here
- Required addresses:
  - `support@4ohi.com` — Four of Hearts Support
  - `paul@4ohi.com` — Paul Chadha | Four of Hearts Interactive
  - `privacy@4ohi.com` — Four of Hearts Privacy
  - `security@4ohi.com` — Four of Hearts Security
- Preferred model: aliases into the existing protected inbox, unless the Proton plan or operational separation requires addresses/mailboxes
- Catch-all: disabled

## Current status

Proton plan eligibility, domain verification, addresses, MX, SPF, DKIM, and DMARC are pending authenticated Proton audit. Existing public DNS still routes mail to GoDaddy and must remain intact until exact Proton values are obtained and the migration is ready.

## Migration procedure

1. In Proton, confirm the subscription supports custom domains and enough addresses/aliases.
2. Add `4ohi.com`.
3. Record Proton's exact verification TXT record.
4. Record both exact MX targets and priorities.
5. Record the exact SPF value.
6. Record every exact DKIM selector and public-key TXT value. Never store a private key.
7. Record Proton's current DMARC recommendation.
8. Export the GoDaddy zone and add only the verification record.
9. Wait for Proton to verify ownership.
10. Create the four addresses with the display names above.
11. Replace GoDaddy MX records with Proton MX records.
12. Replace the single GoDaddy SPF TXT record with Proton's exact SPF value. Ensure the root has exactly one SPF record.
13. Add all Proton DKIM public records.
14. Replace the current GoDaddy DMARC record with Proton's recommendation. Unless current guidance supports enforcement immediately, start with `v=DMARC1; p=none; rua=mailto:security@4ohi.com`.
15. Recheck the entire DNS zone. Website changes must not touch mail records.

## Validation

- Send from an unrelated external mailbox to `support@4ohi.com`, `privacy@4ohi.com`, and `security@4ohi.com`.
- Reply from `support@4ohi.com` to the external sender.
- Send from `paul@4ohi.com` to an external mailbox.
- Inspect only authentication headers needed to confirm `spf=pass`, `dkim=pass`, and `dmarc=pass`; do not commit private message content.
- Confirm one root SPF record and one `_dmarc` record.
- Test website and unrelated DNS after the mail migration.

Record timestamps, sender/recipient roles, result, and authentication status without message bodies or secrets.

## Routine operations

- Review Proton billing and domain status monthly.
- Review aliases, recovery methods, active sessions, and 2FA quarterly.
- Investigate rejected mail from provider logs without exporting private messages.
- Treat security and privacy mail as sensitive business records with least-privilege access.

## Rollback and recovery

If Proton delivery fails, first verify propagation, record syntax, and provider status. Do not create split or duplicate SPF records. A return to GoDaddy mail requires restoring both original MX records and the original SPF/DMARC configuration as one documented incident change. Coordinate recovery through the company Proton and GoDaddy account owners.
