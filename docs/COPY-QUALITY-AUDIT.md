# Copy Quality Audit

Reviewed: August 30, 2026

The studio-voice pass establishes “Games with heart. Apps with purpose.” as the company-level line, separates games from useful applications, makes the South Dakota origin specific, and gives each product a distinct premise and call to action.

The current copy removes generic “new worlds” positioning, avoids slogan stacks, and limits the strongest privacy argument to one primary homepage section. About, footer, product detail, and privacy pages reinforce the position without repeating the same paragraph.

Run `node scripts/audit-marketing-copy.mjs` after every build. It reports:

- duplicate marketing sentences and taglines;
- repeated opening verbs;
- repeated call-to-action text;
- repeated three- to six-word phrases;
- overused adjectives.

The report is written to `docs/copy-quality-results.json`. It is a warning tool rather than a destructive rewrite: shared navigation, legal disclosures, accurate availability language, and necessary accessibility labels may repeat intentionally.
