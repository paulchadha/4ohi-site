# Accessibility acceptance record

Last local run: 2026-07-25

The site uses semantic landmarks, one H1 per route, ordered headings, a skip link, native links/buttons/details, descriptive image alternatives, color-independent status labels, and a keyboard-operable responsive menu. Primary actions and tutorial controls are at least 44 CSS pixels high.

The Palace tutorial is operable by keyboard, touch, or pointer. Card controls expose action labels; feedback uses a polite live region; a recoverable wrong choice does not remove progress; refreshed chapters receive focus only after a player action; and replay is available. Hearts, Spades, and Euchre lessons use the same native-control pattern.

Automated browser acceptance passed at 320 by 568, 360 by 800, 390 by 844, 412 by 915, 430 by 932, 768 by 1024, 1366 by 768, and 1920 by 1080. Home, Palace, Palace tutorial, and News had no horizontal overflow. At 125-percent text zoom, the 390-pixel layout remained within the viewport. The first Tab focused `Skip to content`; visible primary targets measured at least 44 pixels.

With `prefers-reduced-motion: reduce`, animation and transition durations resolve to effectively zero and Palace art/card drift stops. No interaction depends on hover, color alone, audio, a timer, or animation completion.

Browser automation does not replace screen-reader and physical-device testing. Before a commercial release, complete VoiceOver or NVDA reading order, 200-percent text zoom, forced-colors, and representative iOS/Android touch testing.

## Founder redesign verification

The continuous Palace mini-match uses native buttons, visible focus, live status text, non-color labels, minimum 44-pixel primary controls, keyboard and touch input, and a reduced-motion path. The Palace/Shed control uses `aria-pressed`; the secret sequence does not announce intermediate taps. The first focus target remains Skip to content. Browser acceptance passed 125% text zoom and all required viewports without horizontal overflow.

## App-parity acceptance additions

The global name, locale, Settings, power-card, and tutorial controls use native buttons, selects, details, and dialogs. Name changes announce through an `aria-live` status. Power cards expose one pressed state at a time. Browser QA covers keyboard-operable native controls, RTL, reduced motion, 44-pixel targets, mobile overflow, and tutorial completion; physical screen-reader and device checks remain a separate commercial-release gate.


## Reconstructed gameplay acceptance

Cards and actions remain semantic buttons with visible focus, live status, 44-pixel targets, keyboard activation, and reduced-motion behavior. Automated checks cover routing, Power Card geometry, Palace setup/progression, four-seat tables, RTL, and responsive bounds.
