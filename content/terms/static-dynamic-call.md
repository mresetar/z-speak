---
title: "Static and Dynamic CALL"
params:
  expansion: ""
  short: "Whether a called subprogram is link-edited into the caller's load module or loaded by name at run time — decided by how the CALL is coded and compiled."
  ref: { title: "IBM Docs: Enterprise COBOL — Making both static and dynamic calls", url: "https://www.ibm.com/docs/en/SS6SG3_6.4.0/pg/tasks/tpsub09.html" }
  aka: ["static call", "dynamic call", "DYNAM", "NODYNAM", "CALL literal", "CALL identifier", "CANCEL", "subprogram", "IS INITIAL"]
  related: ["COBOL", "Binder", "Load Module", "STEPLIB", "LNKLST", "Language Environment", "ABEND", "Copybook", "CICS", "Plan and Package", "Reentrant Code", "PL/I"]
  links:
    - title: "IBM Docs: Enterprise COBOL — DYNAM compiler option"
      url: "https://www.ibm.com/docs/en/cobol-zos/6.4.0?topic=options-dynam"
categories: ["Development"]
tags: ["cobol", "build", "fundamentals"]
---

In COBOL the same `CALL` statement can mean two different things at run time.

| You write | Compiled with | Result |
|---|---|---|
| `CALL 'SUBPGM'` | `NODYNAM` | **Static** — the binder copies SUBPGM into the caller's load module |
| `CALL 'SUBPGM'` | `DYNAM` | **Dynamic** — SUBPGM is loaded by name when first called |
| `CALL WS-PGM-NAME` | either | **Dynamic** — always |

A static call is slightly faster and the result is self-contained, but the subprogram's code is now inside every caller. Fix a bug in the subprogram and each of those callers has to be relinked, and any that is missed keeps running the old code indefinitely. A dynamic call keeps one copy in the load library, found through the normal STEPLIB and LNKLST search, so replacing that member changes behaviour for every caller at once.

This is the first thing to check when "the fix is in production but the program still does the old thing". The binder's module map shows whether the subprogram is inside the caller, and from which library it was taken.

A dynamic call fails at run time, not at build time, if the module cannot be found — code `ON EXCEPTION` if that is a condition the program should survive. A dynamically called subprogram also stays loaded with its `WORKING-STORAGE` as the previous call left it; `CANCEL` or the `IS INITIAL` attribute gives a fresh copy. Programs that assume their counters start at zero on every call work in testing and fail on the second transaction.

The `DYNAM` choice is not free in every environment. Programs translated for CICS are compiled with `NODYNAM` and use `CALL identifier` where they need dynamic behaviour, and for programs containing `EXEC SQL` the option influences how the Db2 language interface module is reached. Sites normally fix this in their compile procedures, which is why most programmers never choose it — and are surprised by it once.
