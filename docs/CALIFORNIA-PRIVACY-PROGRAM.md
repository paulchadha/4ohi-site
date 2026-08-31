# California website privacy program

Last technical review: 2026-08-30
Owner: Four of Hearts Interactive, LLC
Rights channel: support@4ohi.com

## Status and legal-review boundary

The website implementation is California-focused and privacy protective, but the company has not represented that the CCPA necessarily applies or that counsel approved the policy. The public policy is a lawyer-ready operational draft, not legal advice. Qualified California privacy counsel must confirm applicability, business facts, retention operations, vendor contracts, and final language before any “attorney approved” claim.

The California Attorney General describes CCPA rights to know, delete, correct, opt out of sale/sharing, limit certain sensitive-information uses, and receive nondiscriminatory treatment. It also states that covered businesses must provide collection notices and honor Global Privacy Control as an opt-out signal. Current CPPA regulations effective January 1, 2026 are the implementation baseline.

Official sources:

- https://cppa.ca.gov/regulations/
- https://oag.ca.gov/privacy/ccpa
- https://oag.ca.gov/privacy/ccpa/gpc

## Current data map

| Surface | Data | Purpose | Storage/control |
| --- | --- | --- | --- |
| Static website delivery | Provider-level IP, browser/device, requested URL, time, referrer, and security metadata | Deliver and protect 4ohi.com | GitHub Pages/network provider practices; no 4OH analytics database |
| Support/privacy/security email | Sender address, message, and voluntary attachments/details | Respond, investigate, verify appropriate requests, defend claims | Email provider and company mailbox; retain only as necessary under documented operations |
| Privacy choice | `4oh_privacy_choice=optional_off` | Remember rejection of optional cookies | First-party Secure, SameSite=Lax cookie; 180-day maximum |
| Website tutorials/settings | Current page state and URL parameters | Provide interaction and localization | Page memory/URL only; no cookie or browser storage |

No analytics, advertising, pixels, cross-context behavioral advertising, fingerprinting, third-party embeds, account system, payment flow, or form backend is installed.

## Consent and opt-out behavior

1. On a first visit, optional cookies remain blocked and the privacy banner appears.
2. “Reject optional cookies” writes only the necessary opt-out preference cookie.
3. “Continue without saving” creates no cookie and dismisses the banner only for the current page view.
4. “Review choices” opens a keyboard-accessible dialog showing all optional categories off.
5. “Your Privacy Choices” remains available in every footer.
6. “Clear saved privacy choice” deletes the preference cookie.
7. A Global Privacy Control signal suppresses the banner, leaves optional categories off, and creates no cookie.
8. There is no “accept all” control because no optional technology is installed. The interface must never imply that unavailable tracking can be enabled.

## Consumer request procedure

1. Receive a request at support@4ohi.com with the subject “California Privacy Rights Request.”
2. Record date, right requested, requester contact, verification steps, response date, disposition, and any applicable exception. If CCPA applies, retain the request/response record for at least 24 months. Do not copy unrelated message content into the log.
3. Confirm receipt and respond within the periods required by applicable law.
4. Verify proportionately. Prefer a reply from the email address already involved. Do not collect government ID unless counsel determines it is necessary and lawful.
5. Do not verify opt-out requests unless limited information is needed to apply the request.
6. For an authorized agent, request signed authorization and direct confirmation only when permitted.
7. Search support/privacy/security correspondence and any applicable provider-controlled system to which 4OH has access.
8. Apply deletion/correction to service providers when required and technically available.
9. Explain denials and exceptions without disclosing sensitive security information.
10. Never discriminate, charge, degrade service, or retaliate because a person exercised a privacy right.

## Change-control gate

Before adding an SDK, analytics, advertising, personalization cookie, social embed, account, payment flow, form backend, durable game state, or new vendor:

- complete a data inventory and purpose/necessity review;
- determine whether the technology creates sale, sharing, targeted advertising, sensitive-information, or profiling obligations;
- update the Notice at Collection before collection starts;
- block nonessential technology until the required choice is made;
- honor GPC at the browser/device level;
- provide an equally easy withdrawal path;
- update retention, vendor terms, policy categories, and consumer-request search locations;
- rerun `node scripts/verify-california-privacy.mjs` and full site QA;
- obtain counsel approval for material legal changes.

## Required management decisions before counsel sign-off

- Confirm whether 4OH meets any current CCPA applicability threshold.
- Approve a defensible mailbox retention schedule and operational deletion process.
- Confirm GitHub Pages and email-provider contract/data-flow details.
- Confirm whether the website or future games are directed to children and complete COPPA/app-store analysis.
- Designate a named privacy owner and backup.
- Approve the consumer-request record system and access controls.
- Record counsel name, approval date, approved policy revision, and next annual review date.

## Verification

Focused browser QA covers: zero storage before choice; no storage when continuing without saving; one correctly scoped opt-out cookie after rejection; 180-day expiry; choice clearing; GPC recognition without storage; dialog operation; runtime errors; and 320, 375, and 430 pixel layouts.