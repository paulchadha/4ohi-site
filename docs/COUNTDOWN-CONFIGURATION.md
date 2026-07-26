# Palace countdown configuration

The single public launch value is `window.FOUR_HEARTS_CONFIG.launch.target` in `assets/site-config.js`.

Current target: `2026-10-17T00:00:00-05:00` — midnight on October 17, 2026 in America/Chicago while daylight time is in effect. The visible date and accessible timer language must be updated with the value. The countdown has fixed-width numerals, no remote service, no cookie or storage, and a configured expiry phrase, “The gates are opening,” which does not claim App Store availability.

After changing it, rebuild, run static validation, test the live timer and expiry branch, and update launch/release evidence.
## Localized strip

The authoritative target remains `2026-10-17T00:00:00-05:00`. `assets/palace-experience.js` localizes compact release-strip labels and exposes the strip on Palace, Play Palace, history, and News surfaces. Do not fork the timestamp by locale.
