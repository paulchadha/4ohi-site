# Privacy policy review

Last technical review: 2026-07-25

## Evidence used

The initial policy reflects the current PalaceApp code and security documentation:

- player name, avatar, optional photo reference, ratings, reconnect credentials, and a generated identifier are stored locally;
- online/ranked play sends identity, display profile, session/table, actions, game state, results, and rating information needed for play;
- multiplayer state, sessions, and rankings are currently in memory;
- no production account/authentication system exists;
- no dedicated advertising, behavioral analytics, or crash-reporting SDK appears in current dependencies;
- server health logging is designed to exclude player identity, profile data, reconnect credentials, and table contents;
- the static website contains no analytics, trackers, forms, or first-party cookie code.

## Required review before launch changes

- [ ] Confirm every shipping app version and server commit covered by the policy.
- [ ] Confirm actual production hosting request logs and retention.
- [ ] Confirm Expo Updates, Apple, Google, and distribution-provider data flows.
- [ ] Confirm whether platform crash reports are enabled and accessible to the company.
- [ ] Confirm whether profile photos are ever uploaded, transformed, cached, or retained server-side.
- [ ] Confirm production database, identity, account, moderation, ranking, and abuse-control plans.
- [ ] Define retention periods for support email and any durable production data.
- [ ] Confirm children/family positioning, age gates, COPPA strategy, and store age ratings with counsel.
- [ ] Identify applicable state, national, and international privacy laws based on users and launch regions.
- [ ] Establish a verified privacy-request workflow.
- [ ] Complete legal review and record approval date/owner.

## Publication rule

Do not replace accurate language with “we collect nothing” or similarly absolute claims. Any new SDK, account feature, durable database, payment, advertising, analytics, social feature, or user-generated content requires policy review before release.

## Responsible account

Privacy inquiries route to `privacy@4ohi.com`. Credentials and private correspondence must not be stored in Git.
