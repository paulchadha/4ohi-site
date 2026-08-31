# Website Privacy Implementation Audit

Reviewed: August 30, 2026

Scope: the generated static website at 4ohi.com, not unreleased native products. The site is hosted by GitHub Pages; ordinary hosting, security, and request logs may be processed by the host even though Four of Hearts does not install analytics.

| Practice | Finding | Classification / evidence |
|---|---|---|
| Analytics or visitor measurement | NO | No analytics libraries, beacons, or measurement endpoints in production source. |
| Advertising or retargeting pixels | NO | No ad SDK, Meta Pixel, Google Ads, or equivalent. |
| Sale or cross-context sharing | NO | No website mechanism or vendor performing it. |
| Third-party marketing scripts | NO | Production scripts and fonts are first-party local assets. |
| Remote embeds | NO | No video, map, social, or advertising iframe. |
| Forms or newsletter backend | NO | Support/contact use deliberate `mailto:` links only. |
| Local/session storage or IndexedDB | NO | No production use found during source and rendered-browser audit. |
| First-party cookie | YES | `4oh_privacy_choice=optional_off`, written only when a visitor asks the site to remember rejection; Secure, SameSite=Lax, 180 days. STRICTLY NECESSARY preference. |
| Global Privacy Control | YES | Recognized as an opt-out request; no optional trackers are loaded either way. |
| Query string | YES | Language and Palace table-name choices may appear in the URL; not transmitted to a 4OH analytics service. |
| Page-memory interaction state | YES | Tutorial/play previews reset on refresh and are not persisted. |
| Hosting/security logs | UNKNOWN TO 4OH / EXPECTED INFRASTRUCTURE | GitHub and network providers can process ordinary request and security logs under their own operations. |
| Support email | YES, USER-INITIATED | The sender chooses the content; email providers necessarily process delivery data and message content. |
| Unreleased product SDKs/vendors | NOT YET VERIFIED | Product-specific claims remain qualified until the distributed build, SDK inventory, vendor contracts, and store disclosures are reviewed. |

## Conclusion

The public website is privacy-minimal by construction. Claims on the site are scoped to the website or carry a product-specific verification status. No claim treats the absence of site analytics as proof about an unreleased app.