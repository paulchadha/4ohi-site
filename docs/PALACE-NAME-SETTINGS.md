# Palace name setting and founder Easter egg

`assets/palace-name.js` provides public Palace and Shed choices on `palace.html`. It updates only elements marked `data-game-name`; canonical metadata stays Palace. State lives only in JavaScript memory and resets on refresh. No cookie, localStorage, sessionStorage, analytics event, or backend call is used.

Founder Easter egg: after choosing Shed, ten activations of the Shed control inside four seconds reveal the alternate table name and one understated acknowledgement. It is absent from navigation, metadata, sitemap, public help, and the visible settings list. The timer resets when the sequence is interrupted or the page reloads. Intermediate taps are not announced to assistive technology.

This is a playful discovery, not a security boundary. The implementation is public source and technically sophisticated visitors may find it.