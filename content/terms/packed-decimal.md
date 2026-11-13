---
title: "Packed Decimal"
params:
  expansion: "COMP-3 / packed decimal format"
  short: "Two decimal digits per byte with a sign nibble — the numeric format most business data is stored in."
  ref: { title: "IBM z/Architecture Principles of Operation (SA22-7832)", url: "https://publibfp.dhe.ibm.com/epubs/pdf/a227832c.pdf" }
  aka: ["COMP-3", "PD"]
  related: ["COBOL", "ABEND", "EBCDIC", "Copybook", "Zoned Decimal", "Program Check"]
  links:
    - title: "Wikipedia: Binary-coded decimal"
      url: "https://en.wikipedia.org/wiki/Binary-coded_decimal"
categories: ["Development"]
tags: ["data", "encoding"]
---

`PIC S9(5)V99 COMP-3` stores `1234.56` as `x'0123456C'` — digits packed two per byte, with the last nibble carrying the sign (`C` positive, `D` negative, `F` unsigned). It is compact and exact, and the hardware has instructions to compute on it directly.

Two consequences. First, decimal arithmetic is exact, which is why financial calculations do not need the workarounds floating point requires. Second, if a field is ever filled with spaces or binary junk, the next arithmetic instruction raises a **data exception** — the famous `S0C7`.

Anything reading mainframe data off-platform must decode this itself; a packed field read as text is meaningless.

The size rule is simple: a field of *n* digits takes ⌈(n+1)/2⌉ bytes, so `S9(7)` fits in four bytes and `S9(8)` needs five, with a wasted half byte — one reason COBOL programmers favour odd digit counts. The decimal point is not stored anywhere; `V99` only tells the compiler where to assume it, so the same bytes mean 1234.56 or 123456 depending on the layout used to read them. The maximum is 31 digits (16 bytes).

Related formats are easy to mix up. **Zoned decimal** (`DISPLAY`) uses one byte per digit with the sign in the last byte's upper half, so `-123` appears as `12L` when viewed as text. **Binary** (`COMP`) is ordinary two's-complement. In assembler, packed is type `P`, and `PACK`, `UNPK`, `ZAP`, `AP` and `CVB` are the instructions involved. The sign nibble `F` and `C` both mean positive, which matters when two fields that look equal compare unequal byte for byte.
