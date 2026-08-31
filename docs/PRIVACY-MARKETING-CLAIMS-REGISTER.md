# Privacy Marketing Claims Register

Reviewed: August 30, 2026

| Claim | Classification | Scope | Evidence | Test | Status |
|---|---|---|---|---|---|
| Personal information should remain personal. | Brand principle | Company positioning | Business-model and architecture review | Founder review | APPROVED POSITIONING |
| You’re the customer. Not the product. | Brand principle | Company business model | No ad/data-broker revenue path implemented on website; pricing policy documented | Founder/business-model review | APPROVED POSITIONING |
| No behavioral advertising | Verifiable claim | Public website | Source scan and browser network audit | `verify-privacy-trust.mjs` | VERIFIED FOR WEBSITE |
| No third-party marketing tracking | Verifiable claim | Public website | No marketing scripts, pixels, or social widgets | Source and browser request audit | VERIFIED FOR WEBSITE |
| No sale of personal information | Verifiable claim | Public website/current operations | No vendor or mechanism found | Architecture audit | VERIFIED FOR WEBSITE |
| No profiling children for advertising | Verifiable claim | Public website | No advertising, account, or profiling system | Source/browser audit | VERIFIED FOR WEBSITE |
| We collect as little as possible | Qualified principle | Product design | Data-minimization policy; product architectures vary | Product release gate | QUALIFIED DESIGN PRINCIPLE |
| Local-first where practical | Qualified principle | Product design | Website previews use page memory; People Lens is explicitly qualified | Manifest privacy profiles | QUALIFIED |
| We make apps, not dossiers. | Brand positioning | Company | Must not be read as zero processing; website logs and necessary product processing are disclosed | Copy and policy review | APPROVED WITH DISCLOSURES |
| No surveillance | Do not use as absolute claim | Company/products | Too broad for unverified future SDKs, cloud services, and providers | Release gate | DO NOT PUBLISH AS ABSOLUTE |
| 100% no data collection | Prohibited claim | Company/products | Contradicted by ordinary hosting logs, support messages, and possible product processing | Architecture review | DO NOT PUBLISH |
| Palace website preview uses page memory only | Verifiable claim | Palace web preview | No persistence API or request endpoint | Browser storage/network test | VERIFIED |
| People Lens would transmit search requests | Required qualification | Product concept | Necessary product architecture disclosed | Manifest review | QUALIFIED CONCEPT |
| Future app privacy | Unverified | Unreleased products | SDK/build/vendor review not complete | Product release gate | NOT YET VERIFIED |

Re-review these claims whenever hosting, scripts, forms, vendors, SDKs, authentication, cloud services, multiplayer, analytics, or monetization change.
