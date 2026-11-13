---
title: "PL/I"
params:
  expansion: "Programming Language One"
  short: "IBM's ambitious 1960s general-purpose language — less common than COBOL, but far from extinct."
  ref: { title: "IBM Docs: IBM Enterprise PL/I for z/OS", url: "https://www.ibm.com/docs/en/epfz" }
  aka: ["PL/1", "Enterprise PL/I", "PLI"]
  related: ["COBOL", "HLASM", "JCL", "Language Environment", "Copybook", "Fortran"]
  links:
    - title: "Wikipedia: PL/I"
      url: "https://en.wikipedia.org/wiki/PL/I"
categories: ["Development"]
tags: ["language", "development"]
---

PL/I tried to combine COBOL's data handling with Fortran's computation and add pointers, structures, exceptions (`ON` units) and multitasking. The result is powerful and expressive — and harder to read than COBOL, with a grammar that has no reserved words.

You will find it in insurance, banking and industrial systems. Enterprise PL/I for z/OS is still supported and still gets new function.

The look is distinctive: programs are procedures (`PROC OPTIONS(MAIN)`), variables are declared with `DCL`, and data types name their machine representation — `FIXED DEC(9,2)` is packed decimal, `FIXED BIN(31)` a fullword integer, `CHAR(20) VARYING` a length-prefixed string. Shared declarations are brought in with `%INCLUDE`, the counterpart of a COBOL copybook.

On z/OS it is compiled with Enterprise PL/I and runs under **Language Environment**, so PL/I, COBOL and C routines can call one another and share condition handling. It works with CICS, IMS and Db2 in the same way COBOL does.

The language is generous with defaults, and that is the trap. Undeclared variables are created implicitly, with a type chosen by the first letter of the name, and conversions between types happen silently. Shops therefore compile with strict `RULES` options that turn these conveniences into errors.

A systems dialect, PL/X, is what much of z/OS itself is written in — which is why IBM's control-block documentation often looks like PL/I declarations.
