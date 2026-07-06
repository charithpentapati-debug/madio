# Quarantined images

Images pulled out of `src/assets/` because they leak internal supplier data
(SKU codes, supplier branding, unretouched catalogue-slide artifacts) directly
in the pixels. Kept here for reference only — **do not move these back into
`src/assets/` until they've been re-cropped/replaced.**

- `bar-chairs/MFBC-002.png` — pulled 2026-07-05. Raw catalogue slide for
  "CLASSIC CHAIR" / internal SKU `FRN-HC-001`, visibly printed in the image.
  Was mistakenly wired to product `mfbc-002` ("TRAVIS CHAIR") in
  `src/data/furniture.ts` — a mapping bug in addition to the leak.
- `bar-chairs/MFBC-001.png` through `MFBC-024.png` (all remaining) — pulled
  2026-07-05. Every image in this folder is a raw, un-retouched catalogue-slide
  crop: leftover spec-table rows at the bottom, ghosted supplier product-name
  watermarks (e.g. "FLOWEN CHAIR", "AURIO CHAIR"). `bar-chairs` category flipped
  to `isPopulated: false` in `src/data/furniture.ts` until these are re-cropped
  or replaced with clean photography.
