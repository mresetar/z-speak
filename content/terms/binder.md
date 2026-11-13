---
title: "Binder"
params:
  expansion: "Program management binder (successor to the linkage editor)"
  short: "The z/OS linker: it combines object modules, resolves the references between them and writes an executable load module or program object."
  ref: { title: "IBM Docs: The program management binder", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=binding-program-management-binder" }
  aka: ["linkage editor", "link-edit", "IEWL", "IEWBLINK", "HEWL", "link step", "SYSLMOD", "program management"]
  related: ["Load Module", "CSECT", "GOFF", "AMODE and RMODE", "STEPLIB", "APF Authorization", "COBOL", "HLASM", "C/C++", "Fortran"]
categories: ["Development"]
tags: ["development", "tooling", "internals"]
---

A compiler or assembler produces an **object module**: machine code with unresolved references to other routines. The binder takes one or more object modules, finds the routines they call, lays everything out, fixes up the addresses and writes the result as something z/OS can load. It replaced the older **linkage editor**, and people still say "link-edit" and "the link step".

In JCL it is `PGM=IEWL` (or an alias such as `HEWL`). Input comes from `SYSLIN`, called routines are found automatically in the libraries on `SYSLIB`, the output library is `SYSLMOD`, and the listing goes to `SYSPRINT`. Control statements refine the job: `INCLUDE` brings in a named module, `ENTRY` names where execution starts, `NAME` gives the member name, `ALIAS` adds further names, and `SETCODE AC(1)` marks the module as needing APF authorisation.

Output written to a PDS is a **load module**; output to a PDSE or a UNIX file is a **program object**, which lifts old size limits and is required by newer compilers.

Read the listing. "Unresolved external reference" is a warning, not a failure, and gives return code 4; the program then abends with `S0C1` or `S0C4` when it calls the missing routine. The map also shows the final `AMODE` and `RMODE`, where one old routine can pull the whole module below the line.

Static linking means the called code is copied in, so a fix to a shared routine reaches a program only when that program is bound again.
