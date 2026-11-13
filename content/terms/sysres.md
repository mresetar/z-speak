---
title: "SYSRES"
params:
  expansion: "System residence volume"
  short: "The disk volume z/OS is IPLed from, holding the nucleus and the core system libraries."
  ref: { title: "IBM Docs: Using indirect volume serial support", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=definitions-using-indirect-volume-serial-support" }
  aka: ["system residence volume", "IPL volume", "res pack", "&SYSR1"]
  related: ["IPL", "PARMLIB", "LNKLST", "SMP/E", "DASD", "Catalog"]
  links:
    - title: "IBM Docs: Using indirect catalog entries"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=installations-using-indirect-catalog-entries"
categories: ["Storage"]
tags: ["sysprog", "storage", "maintenance"]
---

The SYSRES is the volume whose device number you give the hardware as the load address. It carries the IPL text and `SYS1.NUCLEUS`, and by convention the rest of the code that defines a z/OS level: `SYS1.LINKLIB`, `SYS1.LPALIB`, `SYS1.SVCLIB` and the other target libraries SMP/E maintains. When they no longer fit on one volume, the set becomes a "logical SYSRES" of several.

The point of keeping the code together is that **a maintenance level is a volume**. Sysprogs apply service to a copy, then IPL from the copy; falling back is an IPL from the old one. To make that possible, catalog entries for these data sets use the system symbol `&SYSR1` (or the older `******`) instead of a real volume serial, so the same catalog works whichever volume was IPLed.

Site-specific things — PARMLIB, PROCLIB, catalogs, page data sets — are deliberately kept *off* the SYSRES, so that swapping it changes the code and nothing else.
