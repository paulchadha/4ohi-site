# Domain and DNS

Last public audit: 2026-07-26 02:24 UTC

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

Authoritative GoDaddy DNS, Google Public DNS, and Cloudflare DNS returned the same website and mail routing on 2026-07-25. GitHub's Pages health API reported both hostnames valid, served by Pages, and HTTPS-eligible with no CAA error.

| Name | Type | Published value | Protection |
|---|---|---|---|
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` | GitHub Pages website routing |
| `@` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` | GitHub Pages website routing |
| `www` | CNAME | `paulchadha.github.io` | GitHub Pages alternate hostname |
| `@` | MX 10 | `mail.protonmail.ch` | Preserve exactly |
| `@` | MX 20 | `mailsec.protonmail.ch` | Preserve exactly |
| `@` | TXT/SPF | `v=spf1 include:_spf.protonmail.ch ~all` | Preserve exactly; keep one SPF record |
| `@` | TXT | `protonmail-verification=3177b2674d74e2c0323866eb7c44510b57a51a87` | Preserve exactly |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine` | Preserve exactly; keep one DMARC record |
| `protonmail._domainkey` | CNAME | `protonmail.domainkey.d5o3wmzkftuiv6rzhi2gzleruxki22trm7laz2x3kwajbp63c35vq.domains.proton.ch` | Preserve exactly |
| `protonmail2._domainkey` | CNAME | `protonmail2.domainkey.d5o3wmzkftuiv6rzhi2gzleruxki22trm7laz2x3kwajbp63c35vq.domains.proton.ch` | Preserve exactly |
| `protonmail3._domainkey` | CNAME | `protonmail3.domainkey.d5o3wmzkftuiv6rzhi2gzleruxki22trm7laz2x3kwajbp63c35vq.domains.proton.ch` | Preserve exactly |
| `_domainconnect` | CNAME | `_domainconnect.gd.domaincontrol.com` | Preserve unless separately approved |

The retired GoDaddy Website Builder addresses `13.248.243.5` and `76.223.105.230` are absent from authoritative and public DNS. Direct checks at every published GitHub IPv4 edge returned the current Four of Hearts site, and ordinary client resolution no longer reaches the GoDaddy placeholder.

## Completed website-only cutover

Only the website records were replaced: the two GoDaddy Website Builder apex A records were removed; the four GitHub Pages A and four AAAA records were added; and `www` was changed to `paulchadha.github.io`. The mail, verification, DKIM, DMARC, Domain Connect, and unrelated records were not part of the website change.

After any future DNS change, verify authoritative DNS plus at least two independent public resolvers. Keep GitHub Pages HTTPS enforcement off until matching certificates are actually presented for both the apex and `www`; then enforce HTTPS and retest redirects, mixed content, and every public page. For this launch, GitHub approved a certificate covering both hostnames through 2026-10-23, HTTPS enforcement was enabled afterward, and the final public HTTPS suite passed.

## GitHub Pages ownership protection

Account-level ownership protection is verified. On 2026-07-25, `_github-pages-challenge-paulchadha.4ohi.com` publicly returned `cb671e54e3d83a6de07c4ed963a882`, and the GitHub Pages API reported `protected_domain_state: verified` with no pending-unverified date. Retain this additive TXT permanently; it does not overlap any Proton record.

Safe verification procedure:

1. Sign in to the `paulchadha` GitHub account and open **Settings → Pages** at the profile level, not the repository Pages page.
2. Choose **Add a domain**, enter `4ohi.com`, and copy GitHub's generated TXT value exactly.
3. In GoDaddy DNS, add a new **TXT** record with host/name `_github-pages-challenge-paulchadha` (the resulting FQDN is `_github-pages-challenge-paulchadha.4ohi.com`), value equal to the exact GitHub-generated token, and TTL `600` seconds or GoDaddy's default.
4. Do not edit or delete the `@` SPF or Proton verification TXT records, `_dmarc`, any `protonmail*._domainkey` CNAME, either MX record, or `_domainconnect`. The GitHub record uses its own unique hostname and safely coexists with Proton Mail.
5. Confirm publication with `Resolve-DnsName -Name _github-pages-challenge-paulchadha.4ohi.com -Type TXT -Server 8.8.8.8`, return to GitHub, and click **Verify**.
6. Leave the GitHub TXT record in DNS permanently so takeover protection remains active.

The TXT value is account-specific and must be copied from GitHub; never invent or reuse a token from another domain.
## Rollback

If website cutover fails, remove only the GitHub A/AAAA records, restore apex A records `13.248.243.5` and `76.223.105.230`, and restore `www` CNAME to `4ohi.com`. Allow for published TTLs. Mail records must remain unchanged throughout cutover and rollback.

## Founder redesign launch preservation

The redesign is website-code only. It does not change apex A/AAAA records, www CNAME, GitHub ownership TXT, CAA, or any Proton Mail MX/SPF/DKIM/DMARC/verification record. Public TLS and redirect verification must be repeated after the exact redesign SHA deploys.

## App-parity deployment recheck

After the July 26 app-parity deployment, authoritative GoDaddy DNS, Cloudflare, and Google still returned the four GitHub Pages A records, four AAAA records, `www` CNAME, and additive ownership TXT. GitHub reported `protected_domain_state: verified` and HTTPS enforcement remained enabled. No DNS record was changed.
