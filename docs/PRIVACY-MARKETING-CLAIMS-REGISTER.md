# Privacy Marketing Claims Register

Reviewed: August 30, 2026

| Claim | Scope | Evidence | Test | Status |
|---|---|---|---|---|
| You’re the customer. Not the product. | Company business model | No ad/data-broker revenue path implemented on website; pricing policy documented | Founder/business-model review | APPROVED POSITIONING |
| No ads or behavioral tracking | Public website | Source scan and browser network audit | `verify-privacy-trust.mjs` | VERIFIED |
| No sale of personal information | Public website/current operations | No vendor or mechanism found | Architecture audit | VERIFIED FOR WEBSITE |
| No profiling children for advertising | Public website | No advertising, account, or profiling system | Source/browser audit | VERIFIED FOR WEBSITE |
| Local-first where practical | Design principle, not universal promise | Website previews use page memory; People Lens is explicitly qualified | Manifest privacy profiles | QUALIFIED |
| Palace website preview uses page memory only | Palace web preview | No persistence APIs or request endpoint | Browser storage/network test | VERIFIED |
| People Lens would transmit search requests | Product concept | Necessary product architecture disclosed | Manifest review | QUALIFIED CONCEPT |
| Future app privacy | Unreleased products | SDK/build/vendor review not complete | Release gate | NOT YET VERIFIED |

Claims must be re-reviewed whenever hosting, scripts, forms, vendors, SDKs, authentication, cloud services, multiplayer, analytics, or monetization change.