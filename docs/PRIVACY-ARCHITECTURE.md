# Website privacy architecture

Principle: collect nothing the website does not need.

The public site is static and uses no analytics, advertising, pixels, third-party fonts, third-party embeds, social widgets, visitor accounts, contact-form backend, cookies, localStorage, sessionStorage, fingerprinting, location collection, or tutorial persistence. Palace name choice and tutorial state exist only in page memory. Facebook and X links render only when a valid approved HTTPS profile is configured.

`privacy.html` is the Privacy Choices center and policy. It reports the actual state instead of displaying a fake consent banner. GPC and DNT do not need to disable optional tracking because no optional tracking loads. Any future nonessential storage must remain off by default, receive applicable affirmative consent before loading, offer equally easy rejection/withdrawal, and trigger policy and QA updates.

GitHub Pages and normal network infrastructure may process request metadata needed to deliver and protect the site. Support email receives only information a sender chooses to provide. California, European, UK, children/family, retention, and applicability questions remain marked for qualified legal review; the site claims no legal certification.