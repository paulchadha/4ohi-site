# Domain and DNS

Last public audit: 2026-07-25 21:04 UTC

## Ownership and renewal

- Domain: `4ohi.com`
- Company: Four of Hearts Interactive, LLC
- Registrar and authoritative DNS: GoDaddy
- Nameservers: `ns71.domaincontrol.com`, `ns72.domaincontrol.com`
- Registered: 2026-07-25 15:54:36 UTC (public RDAP)
- Registry expiration: 2028-07-25 15:54:36 UTC (public RDAP; confirm in GoDaddy)
- Auto-renew, billing method, registrar 2FA, recovery contacts, and intended lock settings require authenticated confirmation.
- Maintain renewal reminders at 90, 60, and 30 days before expiration.

## Verified public state

Google Public DNS and Cloudflare DNS returned the same website and mail routing on 2026-07-25.

| Name | Type | Current value | Website cutover action |
|---|---|---|---|
| `@` | A | `13.248.243.5` | Remove after authenticated zone export |
| `@` | A | `76.223.105.230` | Remove after authenticated zone export |
| `www` | CNAME | `4ohi.com` | Replace with `paulchadha.github.io` |
| `@` | MX 0 | `smtp.secureserver.net` | Preserve exactly |
| `@` | MX 10 | `mailstore1.secureserver.net` | Preserve exactly |
| `@` | TXT/SPF | `v=spf1 include:spf.em.secureserver.net ?all` | Preserve exactly |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | Preserve exactly |
| `_domainconnect` | CNAME | `_domainconnect.gd.domaincontrol.com` | Preserve unless separately approved |

The apex still serves GoDaddy DPS and sets a `dps_site_id` cookie. `https://4ohi.com/` fails hostname verification. GitHub Pages has `4ohi.com` configured as its custom domain, its build is healthy, and HTTPS enforcement is correctly disabled until cutover.

DKIM selectors cannot be exhaustively discovered through DNS; inspect them only in the authenticated zone and preserve them. No DNS record was modified during the website-polish release.

## Website-only cutover

Before saving any change, export or screenshot the complete authenticated zone and compare it with the table above. Verify GitHub's current custom-domain documentation at change time.

Replace only the two placeholder apex A records and the `www` CNAME with:

| Name | Type | Proposed GitHub Pages value |
|---|---|---|
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153` |
| `@` | AAAA | `2606:50c0:8001::153` |
| `@` | AAAA | `2606:50c0:8002::153` |
| `@` | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `paulchadha.github.io` |

Do not alter MX, SPF, DKIM, DMARC, Proton verification, Domain Connect, or unrelated TXT records. After propagation, verify apex and `www` from multiple resolvers, wait for matching certificates, enable GitHub Pages HTTPS enforcement, then confirm `www` redirects to `https://4ohi.com/`.

## Rollback

If website cutover fails, remove only the GitHub A/AAAA records, restore apex A records `13.248.243.5` and `76.223.105.230`, and restore `www` CNAME to `4ohi.com`. Allow for published TTLs. Mail records must remain unchanged throughout cutover and rollback.