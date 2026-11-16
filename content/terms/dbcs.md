---
title: "DBCS"
params:
  expansion: "Double-Byte Character Set"
  short: "The two-bytes-per-character encodings used for Japanese, Chinese and Korean on the mainframe, switched on and off inside EBCDIC text by shift codes."
  ref: { title: "Wikipedia: DBCS", url: "https://en.wikipedia.org/wiki/DBCS" }
  aka: ["double-byte character set", "SO/SI", "shift-out", "shift-in", "mixed data", "SBCS", "MBCS", "GRAPHIC", "PIC G", "DISPLAY-1", "IBM-939", "Kanji"]
  related: ["EBCDIC", "CCSID", "COBOL", "PL/I", "Db2 for z/OS", "3270", "ISPF", "Record Format", "DCLGEN", "z/OS UNIX"]
  links:
    - title: "IBM Docs: Enterprise COBOL — DBCS compiler option"
      url: "https://www.ibm.com/docs/en/cobol-zos/6.4.0?topic=options-dbcs"
categories: ["Development"]
tags: ["data", "encoding", "fundamentals"]
---

One byte gives 256 code points, which is enough for a European alphabet and nowhere near enough for kanji. IBM's answer, long before Unicode, was a second set of code pages in which every character occupies two bytes, combined with ordinary single-byte EBCDIC (**SBCS**) in the same field.

The combination is called **mixed data**, and it works by bracketing. The control character **shift-out** (`X'0E'`) says "double-byte characters start here" and **shift-in** (`X'0F'`) says "back to single-byte". Everything between the two is read in pairs. Mixed code pages such as IBM-939 (Japanese), IBM-933 (Korean) and IBM-935 (Simplified Chinese) pair a single-byte page with a double-byte one.

Languages and products carry dedicated types for it: `PIC G` with `DISPLAY-1` in COBOL, `GRAPHIC` in PL/I, `GRAPHIC` and `VARGRAPHIC` columns in Db2, and DBCS-capable 3270 terminals and emulators to display it.

Even if you never process Asian text, the term turns up — as a compiler option, a Db2 installation setting, an ISPF terminal type — and the rules behind it explain a class of bugs:

- **Length in bytes is not length in characters**, and the shift codes take up room themselves. A ten-character name can need 22 bytes.
- **Truncating or substringing in the middle of a double-byte run corrupts the rest of the field**, because the closing shift-in is lost or the pairs go out of step.
- **Converting to UTF-8 changes the length again**: the shift codes disappear and most of these characters become three bytes each, so a field sized for the host encoding can overflow on the way out.

COBOL's `NATIONAL` data (`PIC N` under `NSYMBOL(NATIONAL)`) is often filed under the same heading but is something else: UTF-16, with no shift codes.
