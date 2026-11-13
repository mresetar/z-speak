---
title: "LNKLST"
params:
  expansion: "Link list and link pack area"
  short: "The system-wide search path for programs, plus the shared memory area where hot modules are pre-loaded."
  ref: { title: "IBM Docs: z/OS Basic Skills — Search order for programs (LNKLST)", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_searchorder.htm" }
  aka: ["LPA", "link pack area", "LINKLIST"]
  related: ["Load Module", "STEPLIB", "PARMLIB", "APF Authorization", "DD Statement", "LLA", "Reentrant Code"]
  links:
    - title: "IBM Docs: Changing the LNKLST concatenation"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=management-changing-lnklst-concatenation"
categories: ["System Services"]
tags: ["sysprog", "internals"]
---

When a program is called, z/OS searches the job's `STEPLIB`/`JOBLIB`, then the **LPA**, then the **LNKLST** — the system-wide `PATH`. `S806` means the search reached the end and found nothing.

The **LPA** (link pack area) holds heavily used modules in storage shared by every address space: loaded once, executed by everyone, never paged per user. Modules in LPA are treated as APF-authorized, which is why what goes in there is tightly controlled.

Both are defined in `PROGxx` in PARMLIB and can be updated dynamically — `SETPROG LNKLST` to add a library, `SETPROG LPA` to replace a module — without an IPL.

The LNKLST is not searched by reading each library's directory every time. **LLA** (library lookaside) keeps the directories in storage and **VLF** caches the modules themselves, so after changing a member in a LNKLST library the old copy may still be found until LLA is refreshed with `F LLA,REFRESH`. Running programs that already have the module loaded keep the old version until they reload it. Both effects explain most cases of "I replaced the module but nothing changed".

LPA has parts worth telling apart. **PLPA** is built from `SYS1.LPALIB` and the `LPALSTxx` list at a cold start; **MLPA** and **FLPA** are temporary or fixed additions; **dynamic LPA** is what `SETPROG LPA` changes. LPA modules must be **reentrant**, because every address space executes the same copy. And the search order has one more step that surprises people: a module already loaded in the job's own storage is found first, before any library is looked at.
