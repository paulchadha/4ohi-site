# Localization

The public language selector is driven by `assets/product-authority.js`. Supported query values are `en`, `fr`, `es`, `hi`, `zh-Hans`, `he`, `ar`, and `en-CA`.

Canadian mode is visibly labeled **Canadian 🇨🇦** and uses `?lang=en-CA`. Core English/Canadian product copy is co-located in `scripts/production-pages.mjs`; persistent interface, dialog, privacy, newsroom, footer, and error copy is centralized in `assets/production-locales.js`. The older Palace-specific language dictionaries remain available for the interactive card-table context.

Language selection is preserved in internal URLs. It is not stored in a cookie or local storage. This avoids tracking and keeps the preference transparent. The one optional privacy preference cookie is unrelated and appears only when a visitor explicitly asks the site to remember that optional cookies stay off.

Registered and intended product names remain unchanged in Canadian mode. French, Spanish, Hindi, Simplified Chinese, Hebrew, and Arabic dictionaries are not replaced by Canadian copy.