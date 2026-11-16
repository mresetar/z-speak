---
title: "LPA"
params:
  expansion: "Link Pack Area"
  short: "The area of common storage where heavily used reentrant modules are loaded once and executed by every address space."
  ref: { title: "IBM Docs: z/OS Basic Skills — z/OS system libraries", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=customization-zos-system-libraries" }
  aka: ["link pack area", "PLPA", "MLPA", "FLPA", "ELPA", "dynamic LPA", "LPALSTxx", "SYS1.LPALIB", "CLPA", "SETPROG LPA", "IEALPAxx", "IEAFIXxx"]
  related: ["LNKLST", "Common Storage", "Reentrant Code", "Load Module", "STEPLIB", "PARMLIB", "IPL", "APF Authorization", "LLA", "Paging", "SVC", "The Line and the Bar"]
  links:
    - title: "IBM Docs: CICS — Common areas in z/OS storage"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=space-common-areas-in-zos-storage"
categories: ["Operating System"]
tags: ["sysprog", "internals", "storage"]
---

Some code is used by nearly everything: access methods, SVC routines, TSO command processors, the Language Environment runtime. Loading a private copy into each of several hundred address spaces would waste real storage and load time, so z/OS puts one copy into the common area, maps it into every address space at the same address, and lets everyone execute it there.

The LPA comes in parts, and the names appear in documentation and dumps:

| Part | Built from | Notes |
|---|---|---|
| **PLPA** — pageable | `SYS1.LPALIB` and the libraries in `LPALSTxx` | The bulk of it; built at a cold start |
| **MLPA** — modified | `IEALPAxx` | Temporary additions or replacements for one IPL |
| **FLPA** — fixed | `IEAFIXxx` | Page-fixed, for modules that must never take a page fault |
| **Dynamic LPA** | `PROGxx`, `SETPROG LPA,ADD` | Added or replaced on a running system |

Each has an "extended" twin above the 16 MB line, which is where almost everything lives today.

Building the PLPA is expensive, so the system does it only when told to with the **CLPA** option at IPL. Otherwise it reuses the copy already on the PLPA page data set. This is the classic trap: a module replaced in an LPA library does not take effect at the next IPL unless that IPL specifies CLPA, or the module is added dynamically.

Two rules follow from sharing one copy. LPA modules must be **reentrant** — the storage is write-protected, and a module that tries to modify itself abends with `S0C4`. And LPA is searched before the LNKLST and treated as authorized, so what goes into the LPA libraries is as security-sensitive as the APF list.
