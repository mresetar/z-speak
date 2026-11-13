---
title: "Fortran"
params:
  expansion: "VS FORTRAN on z/OS"
  short: "The scientific programming language IBM invented in the 1950s; on z/OS it survives as the old VS FORTRAN compiler and a compatibility runtime."
  ref: { title: "IBM Docs: Customizing for Fortran applications link-edited with Language Environment", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=environment-customizing-fortran-applications-link-edited-language" }
  aka: ["VS FORTRAN", "VS FORTRAN Version 2", "FORTRAN IV", "FORTRAN 77", "Fortran H", "WATFIV", "IBM Mathematical Formula Translating System"]
  related: ["Language Environment", "PL/I", "COBOL", "HLASM", "C/C++", "IBM Z", "Binder", "Linux on IBM Z"]
categories: ["Development"]
tags: ["language", "legacy", "history"]
---

**Fortran** — "formula translation" — was created at IBM by John Backus's team and released in 1957 for the IBM 704. It was the first widely used high-level language, and for two decades scientific and engineering computing on IBM mainframes meant Fortran: the System/360 compilers Fortran G and H, the student compilers WATFOR and WATFIV, and later **VS FORTRAN**.

On z/OS today the language is a legacy. IBM's compiler is still **VS FORTRAN Version 2**, a product from the 1980s supporting the FORTRAN 77 standard with extensions, including a vector feature for the 3090. It has not been brought up to Fortran 90 or later. **Language Environment** includes a Fortran runtime so that existing programs keep running and can be called from, or call, COBOL, PL/I and C routines, with some restrictions that the migration documentation spells out.

Where it remains in use it is usually a core of numerical code that nobody wants to rewrite: actuarial and pricing routines in insurance, engineering calculations, statistical libraries, and subroutines buried inside larger COBOL or PL/I applications. The source is recognisable by its fixed layout — statement labels in columns 1 to 5, a continuation mark in column 6, code from column 7 — and by variables that are integers simply because their names begin with `I` to `N`.

Anyone needing modern Fortran on IBM hardware uses **Linux on IBM Z**, where GNU Fortran and other current compilers are available. On z/OS itself, new numerical work is written in C, C++, Java or Python.

Fortran matters to mainframe history for another reason: the need to run existing Fortran and COBOL programs unchanged on new machines was one of the forces behind the compatible System/360 family.
