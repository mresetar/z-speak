---
title: "Reentrant Code"
params:
  expansion: "Reentrant (RENT) and refreshable programs"
  short: "A program that never modifies itself, so one copy in storage can be executed by many tasks at the same time."
  ref: { title: "IBM Docs: Making your COBOL program reentrant", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reentrant-making-your-cobol-program" }
  aka: ["RENT", "reentrancy", "REUS", "serially reusable", "REFR", "refreshable", "NORENT"]
  related: ["LNKLST", "Load Module", "Binder", "CSECT", "CICS", "Threadsafe", "TCB", "Storage Key"]
categories: ["Development"]
tags: ["development", "internals", "memory"]
---

A **reentrant** program keeps all its changeable data outside the program itself — in storage it obtains for each caller — and treats its own text as read-only. One copy can then be used by any number of tasks at once, each with its own working storage. This is what makes shared code possible: everything in the **link pack area** must be reentrant, and so must programs that servers such as CICS load once and run for many users.

High-level languages do the work for you. In COBOL the `RENT` compiler option makes the compiler obtain working storage dynamically; in C, `RENT` handles writable static data. In assembler it is the programmer's job: obtain a work area with `GETMAIN` or `STORAGE`, address it through a DSECT, and never store into the program's own CSECT.

The attribute is recorded by the binder (`RENT`, `REUS` or neither). `REUS` — **serially reusable** — means the program may be used again but only by one task at a time. Marking a module RENT does not make it so: a program that claims reentrancy and then stores into itself fails with `S0C4` when it is loaded into read-only storage, which is exactly what LPA and the `RENT` protection option provide.

Reentrant is not the same as **threadsafe**. A reentrant program can still corrupt *shared* data — a common area, a CICS shared work area — if two tasks update it at once. Reentrancy protects the program's own storage and nothing more.
