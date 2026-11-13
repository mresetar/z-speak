---
title: "Zoned Decimal"
params:
  expansion: "Zoned decimal format (DISPLAY numeric)"
  short: "A number stored one digit per byte as readable EBCDIC characters, with the sign tucked into the last byte."
  ref: { title: "Wikipedia: Zoned decimal", url: "https://en.wikipedia.org/wiki/Zoned_decimal" }
  aka: ["DISPLAY", "USAGE DISPLAY", "PIC S9", "overpunch", "signed numeric"]
  related: ["Packed Decimal", "EBCDIC", "COBOL", "Copybook", "ABEND", "CCSID"]
categories: ["Development"]
tags: ["data", "encoding"]
---

Each byte has two halves: a **zone** in the high four bits and a **digit** in the low four. For an unsigned number the zone is `F`, so the digits 1, 2, 3 are stored as `F1 F2 F3` — which is simply the EBCDIC text "123". This is what COBOL calls `USAGE DISPLAY`, the default for a `PIC 9` field.

A signed field, `PIC S9(3)`, keeps its sign in the zone of the *last* byte: `C` for positive, `D` for negative. Plus 123 is `F1 F2 C3` and minus 123 is `F1 F2 D3`. Viewed as text those are `12C` and `12L` — the final digit appears as a letter. That is not corruption; it is an **overpunch**, a convention inherited from punched cards.

Two practical consequences. Arithmetic is not done in this format: the machine packs the digits into **packed decimal** first, and invalid zoned data is the usual origin of an `S0C7`. And a file with signed zoned fields cannot be converted to ASCII as plain text, because the translation mangles the sign byte; such fields must be converted as numbers, using the copybook.
