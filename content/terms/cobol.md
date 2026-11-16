---
title: "COBOL"
params:
  expansion: "Common Business-Oriented Language"
  short: "The language most mainframe business logic is written in — verbose, fixed-decimal, and still compiled every day."
  related: ["JCL", "CICS", "Copybook", "Packed Decimal", "PL/I", "Binder", "SQLCODE", "Static and Dynamic SQL", "EIB", "C/C++", "Easytrieve", "Static and Dynamic CALL"]
  ref: { title: "IBM Docs: Enterprise COBOL for z/OS", url: "https://www.ibm.com/docs/en/cobol-zos" }
  aka: ["Enterprise COBOL", "COBOL for z/OS", "COBOL 6", "IGYCRCTL"]
  links:
    - title: "Wikipedia: IBM COBOL"
      url: "https://en.wikipedia.org/wiki/IBM_COBOL"
categories: ["Development"]
tags: ["language", "development"]
---

COBOL's design goal was readable business processing, and its enduring advantage is **fixed-point decimal arithmetic**: `PIC S9(9)V99 COMP-3` is exact, which is why financial code written in it does not carry floating-point rounding surprises.

A program has four divisions — IDENTIFICATION, ENVIRONMENT, DATA, PROCEDURE — and data layouts are hierarchical level numbers shared between programs through **copybooks**. Current IBM Enterprise COBOL (6.x) compiles to modern optimised code and supports JSON and XML parsing natively.

The stereotype of a dying language is not what the code base shows: it is maintained, extended and exposed as APIs. The real problem is not the language but undocumented business rules accumulated over forty years.

Building a program is a chain: optional precompile or coprocessor steps for CICS and Db2, the compile (`IGYCRCTL`), then the binder. **Compiler options** change behaviour, not just diagnostics. `TRUNC` decides how binary fields are truncated, `NUMPROC` how signs are treated, `ARCH` which machine level the code needs, `SSRANGE` whether subscripts are checked, and `OPT` the optimisation level. Two sites compiling the same source with different options can get different results, so the options belong under version control with the code.

Source is traditionally **fixed format**: columns 1–6 are sequence numbers, column 7 is an indicator (`*` for a comment, `-` for continuation), code sits in 8–72, and anything beyond 72 is ignored — a silent cause of missing statements. Old code relies on a full stop to end a sentence, where one misplaced period changes the logic; scope terminators such as `END-IF` avoid it. Moving from COBOL 4 to 6 is a real migration, because the newer compiler exposes invalid data that older code happened to tolerate.
