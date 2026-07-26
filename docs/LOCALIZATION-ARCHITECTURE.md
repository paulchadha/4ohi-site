# Localization architecture

## Runtime model

The public site is static. Language and displayed Palace-family name are URL state:

- `?lang=en|fr|es|hi|zh-Hans|he|ar|en-CA-fun`
- `?game=palace|shed|shithead`

No cookie, local storage, session storage, account, translation API, analytics service, or remote content request is used. Internal links are rewritten locally so the current language and table name travel between pages. A fresh URL without `game` returns to canonical Palace.

`assets/palace-experience.js` is the structured runtime source for locale metadata, interface copy, page identity, navigation, countdown labels, naming controls, the Canadian-fun variant, and RTL direction. English metadata remains canonical Palace metadata. Every public document includes `hreflang` alternates for all eight variants and `x-default`.

## Authoring rules

1. Add or change English source copy first.
2. Preserve `{game}` conceptually through `[data-game-name]`; never hard-code the private alternate name into metadata, sitemap, RSS, help, or visible default copy.
3. Update every locale in the same change.
4. Test name and language in both navigation directions.
5. Hebrew and Arabic must render with `dir="rtl"` while playing cards retain readable rank/suit geometry.
6. Do not use browser or server translation services.
7. Keep Canadian-fun affectionate and self-directed. Do not joke about race, Indigenous peoples, Quebec, immigration, disability, religion, or politics.

## Translation status

| Locale | Status | Notes |
|---|---|---|
| `en` | Founder approved | Canonical source |
| `en-CA-fun` | Founder approved playful variant | “Sorry, eh?”, “Give ’er”, and similarly light table language |
| `fr` | Machine-assisted; human review required | Interface and core page identity |
| `es` | Machine-assisted; human review required | Interface and core page identity |
| `hi` | Machine-assisted; human review required | Interface and core page identity |
| `zh-Hans` | Machine-assisted; human review required | Interface and core page identity |
| `he` | Machine-assisted; human and RTL review required | True RTL |
| `ar` | Machine-assisted; human and RTL review required | True RTL |

Legal, privacy, terms, history, and founder-biography translations require qualified review before commercial reliance. The selector shows the active review status.

