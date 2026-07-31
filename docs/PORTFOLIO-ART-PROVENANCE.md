# Portfolio art provenance

## Founder source boards

The following files are byte-for-byte repository copies of the supplied founder boards:

- assets/bobby/bobby-concept-board-source.png
- assets/evil-doom/evil-doom-concept-board-a-source.png
- assets/evil-doom/evil-doom-concept-board-b-source.png

Recorded SHA-256 values:

- Bobby: 42957FA82AB3A6F2A6252AF556EBA959E71994792DAE9DEBB0414B490C692971
- Evil A: 729824E8BB56FF7ADD4FE11292F8FAC2674A421472323A7FACA23D57C341A1BF
- Evil B: 9A1D4C88A87DF6713F5F99AA47A2D2F848DEFD04F98CB1AE1DFBDA49C4B8AC9A

Source files are never overwritten. Public pages use optimized WebP crops and derivatives generated locally by scripts/process-portfolio-art.py.

## Bobby derivatives

The processing script produces a full optimized board plus hero, character, and world crops. Embedded concept-board names and text remain artwork reference only and are not canonical website copy.

## Evil Girl deep-purple treatment

The approved website identity is anchored to #4E2A84. The processing script converts only the saturated magenta mask to a deep-purple range. It preserves pixels outside the mask, retains the original board, writes separate derivative files, and emits assets/evil-doom/recolor-report.json.

Board A changed 24,790 targeted pixels; Board B changed 28,097 targeted pixels; zero pixels outside the selection changed in the decoded comparison. Red enemy effects are excluded by hue and saturation bounds.

Before/after visual evidence is docs/visual-evidence/portfolio-art-before-after-1366x768.png.

## Reproduction

Run the script with the repository’s Pillow and NumPy-capable Python runtime:

    python scripts/process-portfolio-art.py

Then run:

    node scripts/build-site.mjs
    node scripts/verify-portfolio-expansion.mjs

Founder physical visual acceptance remains pending.
