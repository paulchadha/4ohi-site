# Website privacy architecture

Principle: collect nothing the website does not need.

The public site is static and uses no analytics, advertising, pixels, third-party fonts, third-party embeds, social widgets, visitor accounts, contact-form backend, cookies, localStorage, sessionStorage, fingerprinting, location collection, or tutorial persistence. Palace name choice and tutorial state exist only in page memory. Facebook and X links render only when a valid approved HTTPS profile is configured.

`privacy.html` is the Privacy Choices center and policy. It reports the actual state instead of displaying a fake consent banner. GPC and DNT do not need to disable optional tracking because no optional tracking loads. Any future nonessential storage must remain off by default, receive applicable affirmative consent before loading, offer equally easy rejection/withdrawal, and trigger policy and QA updates.

GitHub Pages and normal network infrastructure may process request metadata needed to deliver and protect the site. Support email receives only information a sender chooses to provide. California, European, UK, children/family, retention, and applicability questions remain marked for qualified legal review; the site claims no legal certification.
## Language and naming state

Language and table name are URL parameters only. The verified implementation creates no cookie, local-storage entry, session-storage entry, remote translation call, or analytics request. The private alternate name is not inferred from DNS, browser language, identity, or a previous visit.

## Product-name and locale state

The app-parity release keeps locale and product-name state exclusively in the URL. Browser acceptance confirms empty cookies, local storage, and session storage after locale selection, Shed mode, RTL, power-card interaction, and all tutorial flows. The private traditional-name confirmation does not create a stored preference or visitor profile.


## Local website game boundary

Reconstructed game state remains page-memory only. There are no accounts, backend sessions, persistence, cookies, localStorage, sessionStorage, analytics, ads, trackers, third-party fonts, embeds, or post-load game requests.
