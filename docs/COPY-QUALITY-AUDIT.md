# Copy Quality Audit

Reviewed: August 30, 2026

The current pass removed “worlds” as a generic portfolio brand, reduced repeated “explore” and “hold the line” phrasing, and gave each product a distinct sentence rhythm and premise. Shared navigation, status language, accessibility labels, footer links, and legal disclosures remain intentionally consistent.

Run `node scripts/audit-marketing-copy.mjs` after every build. It scans the main public marketing pages, records exact repeated sentences, and writes `docs/copy-quality-results.json` as an editorial warning report. Repetition is reviewed rather than automatically rewritten because legal and availability disclosures should remain stable.