# Privacy policy review

Last technical review: 2026-07-25

## Current publication basis

The policy describes the present Internal Alpha state documented before this website sprint:

- chosen player name, avatar, optional profile-photo reference, ratings, reconnect credential, preferences, and a generated identifier may be stored locally;
- online or ranked play sends display, session, table, action, game-state, result, reconnect, and rating information needed to operate a match;
- multiplayer tables, sessions, and rankings are currently in memory rather than a durable production database;
- no production account or authentication system currently exists;
- no dedicated advertising or behavioral-analytics SDK is represented as present;
- operational logging is described conservatively and hosting/platform providers may process standard request or diagnostic data;
- the static website has no analytics, advertising, forms, first-party cookies, or third-party requests;
- Quick Play uses dependency-free client JavaScript and keeps tutorial progress only in page memory; it does not use local storage, session storage, an account, or a backend;
- support communications are received by email and may contain details and attachments provided by the sender.

Privacy questions currently route to `support@4ohi.com`. Credentials and private correspondence must not be stored in Git.

Facebook and X configuration values remain blank, so no social link, widget, pixel, SDK, remote script, or profile request is emitted. Future approved profiles may be ordinary outbound links only and must not change this data posture.


## Required review before launch changes

- [ ] Confirm every shipping app version and server revision covered by the policy.
- [ ] Confirm production hosting request logs and retention.
- [ ] Confirm Apple, Google, update-provider, and distribution-provider data flows.
- [ ] Confirm platform crash-report behavior and company access.
- [ ] Confirm whether profile photos are uploaded, transformed, cached, or retained server-side.
- [ ] Confirm production database, identity, account, moderation, ranking, and abuse-control plans.
- [ ] Define retention periods for support email and durable production data.
- [ ] Confirm children/family positioning, age gates, COPPA strategy, and store age ratings with counsel.
- [ ] Identify applicable laws based on actual users and launch regions.
- [ ] Establish and test a privacy-request workflow.
- [ ] Complete legal review and record approval date and owner.

## Change rule

Any new SDK, account feature, storage, durable database, payment, advertising, analytics, social feature, user-generated content, or data transfer requires a new privacy review before release.

## Founder redesign privacy review

The new Privacy Choices center accurately reports eight categories: infrastructure-only strictly necessary behavior; no analytics; no advertising; no personalization tracking; no cross-site tracking; no sale/sharing for advertising; no stored tutorial progress; and no persisted Palace name. GPC/DNT behavior, rights contact, normal GitHub Pages metadata handling, and future opt-in requirements are documented. California/EU/UK applicability and final legal language remain open for qualified counsel; no certification is claimed.
