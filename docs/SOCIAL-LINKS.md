# Social-link release control

Approved social profile URLs belong only in `assets/site-config.js`. The current Facebook and X values are deliberately blank, so no social links or widgets render publicly.

A profile may be added only after a company owner confirms the exact HTTPS URL and ownership of the destination account. The renderer accepts only `facebook.com` or `x.com` HTTPS hosts. Add ordinary outbound links with `rel="noopener noreferrer"`; never embed timelines, pixels, SDKs, login buttons, or share widgets.

After changing the configuration, verify keyboard labels, destination host, responsive footer layout, zero third-party requests before activation, and the privacy-policy statement. Social links must never introduce cookies, tracking, remote scripts, or an implied account requirement.
