---
title: "Language Environment"
params:
  expansion: "z/OS Language Environment (LE)"
  short: "The shared runtime for COBOL, PL/I, C/C++ and Fortran — common storage, condition handling and callable services."
  ref: { title: "IBM Docs: z/OS Language Environment", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-language-environment" }
  aka: ["LE", "CEE"]
  related: ["COBOL", "PL/I", "zEDC", "ABEND", "Load Module", "z/OS Debugger", "Metal C", "ESTAE", "Program Check", "C/C++", "Fortran"]
  links:
    - title: "IBM Docs: Language Environment concepts, services, and models"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-language-environment-concepts-services-models"
categories: ["Development"]
tags: ["development"]
---

Before LE, each compiler shipped its own incompatible runtime, and calling PL/I from COBOL was an adventure. LE gives them one: a shared heap and stack model, one condition-handling architecture, one set of callable services (`CEEDAYS`, `CEEMOUT`), and interoperable calls between languages.

You meet it mostly through its messages and its knobs. Diagnostics start with `CEE` — `CEE3204S` is a data exception surfacing an `S0C7`, and LE prints a traceback naming the failing routine and offset, which is far friendlier than a raw dump. **Runtime options** (`HEAP`, `STACK`, `TRAP`, `TERMTHDACT`) are set in `CEEOPTS` or `CEEPRMxx` and materially affect both performance and how much diagnostic detail you get when something fails.

Structurally, a running application is an **enclave** inside a **process**, with one or more **threads**; the enclave ends when its main program returns. LE's runtime library, `CEE.SCEERUN` and `SCEERUN2`, must be available through the LNKLST or a `STEPLIB`, and most modules are loaded from the link pack area. Runtime options are taken from several places in a fixed order — installation defaults, the `CEEPRMxx` member, options built into the program, the `CEEOPTS` DD, and the `PARM` field — and the **RPTOPTS** option prints which ones took effect and where each came from.

When a program fails, LE handles the condition first. With `TRAP(ON)`, the default, you get a formatted **CEEDUMP** with a traceback and the values of variables, written to the `CEEDUMP` DD or SYSOUT. Whether a system dump follows depends on `TERMTHDACT` and on having a `SYSUDUMP` or `SYSMDUMP` DD. The abend codes `U4038` and `U4039` are LE's own, meaning "the enclave ended because of an unhandled error" — look further up the output for the original message.
