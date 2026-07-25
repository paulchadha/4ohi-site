# Domain and DNS

Last audited: 2026-07-25 (public DNS only)

## Ownership and renewal

- Domain: `4ohi.com`
- Company: Four of Hearts Interactive, LLC
- Registrar: GoDaddy (confirmed by company records; authenticated account confirmation pending)
- Registration expiration: pending authenticated GoDaddy audit
- Auto-renew: pending authenticated GoDaddy audit
- Domain lock: pending authenticated GoDaddy audit
- Registrar 2FA: pending authenticated GoDaddy audit
- Responsible account: company GoDaddy account; credentials and recovery material are not stored here
- Renewal dependency: active GoDaddy billing method, account access, and renewal reminders at 90/60/30 days

## Nameservers and DNS host

GoDaddy hosts authoritative DNS:

- `ns71.domaincontrol.com`
- `ns72.domaincontrol.com`

SOA observed on 2026-07-25: `ns71.domaincontrol.com`, serial `2026072508`.

## Current public records before changes

| Name | Type | Value / target | TTL | Purpose |
|---|---|---|---:|---|
| `@` | A | `13.248.243.5` | 3600 | GoDaddy Websites + Marketing placeholder |
| `@` | A | `76.223.105.230` | 3600 | GoDaddy Websites + Marketing placeholder |
| `www` | CNAME | `4ohi.com` | resolver-dependent | Redirect/alias to apex placeholder |
| `@` | MX 0 | `smtp.secureserver.net` | 3600 | Existing GoDaddy mail routing |
| `@` | MX 10 | `mailstore1.secureserver.net` | 3600 | Existing GoDaddy mail routing |
| `@` | TXT | `v=spf1 include:spf.em.secureserver.net ?all` | 600 | Existing GoDaddy email SPF |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | 3600 | Existing GoDaddy DMARC |
| `_domainconnect` | CNAME | `_domainconnect.gd.domaincontrol.com` | resolver-dependent | GoDaddy Domain Connect |

No apex AAAA record was observed. CAA was not confirmed by the Windows resolver used for this audit. DKIM selector names cannot be exhaustively discovered through DNS and must be checked in the GoDaddy zone editor.

The existing endpoint identifies itself as GoDaddy `DPS/2.0.0`, sets a `dps_site_id` cookie, and uses the two GoDaddy A records above. `www` redirects to the apex. HTTPS currently fails hostname verification from the audit client, so the placeholder is not production-ready.

## Planned DNS changes

No DNS records have been changed yet. Before mutation:

1. Export or screenshot the complete GoDaddy zone.
2. Confirm domain expiration, auto-renew, lock, and 2FA.
3. Obtain exact Proton verification, MX, SPF, DKIM, and DMARC guidance from the authenticated Proton domain wizard.
4. Verify the new site at its temporary host URL.
5. Change only records whose purpose is understood.

For GitHub Pages apex hosting, GitHub's then-current documented A/AAAA targets must be copied exactly. `www` should be a CNAME to the repository's `github.io` hostname. Never copy addresses from an old runbook without checking GitHub's current documentation.

## Verification

After each change:

- query authoritative and public resolvers for A, AAAA, CNAME, MX, TXT, DKIM, and DMARC;
- verify no duplicate SPF or DMARC records;
- check temporary host, apex, `www`, redirects, TLS, mail delivery, and authentication;
- compare the live zone with the change record.

## Rollback

- Restore the exact pre-change records in the table and zone export.
- For website rollback, restore the two original GoDaddy A records and `www → 4ohi.com` only if intentionally returning to the placeholder.
- For email rollback, restore prior MX/SPF/DMARC records only as a coordinated incident response; never partially mix Proton and GoDaddy mail routing.
- Expect cached answers to persist until their TTLs expire.

## Known limitations

Authenticated account settings and the complete private zone view are pending because browser access was unavailable during the public audit.
