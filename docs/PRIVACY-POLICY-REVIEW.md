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
- the static website has no analytics, advertising, forms, client script, or first-party cookie code;
- support communications are received by email and may contain details and attachments provided by the sender.

Privacy questions currently route to `support@4ohi.com`. Credentials and private correspondence must not be stored in Git.

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

Do not replace accurate language with “we collect nothing” or another absolute claim. Any new SDK, account feature, durable database, payment, advertising, analytics, social feature, user-generated content, or data transfer requires a new privacy review before release.