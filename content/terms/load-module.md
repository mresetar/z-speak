---
title: "Load Module"
params:
  expansion: "Load module / program object"
  short: "The compiled, linked, executable form of a program, stored as a member of a load library."
  ref: { title: "IBM Docs: z/OS Basic Skills — Modules, macros, components and control blocks", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_76.htm" }
  aka: ["program object", "executable"]
  related: ["STEPLIB", "LNKLST", "JCL", "PDS", "GOFF", "AMODE and RMODE", "LLA", "APF Authorization", "Binder", "Reentrant Code"]
  links:
    - title: "IBM Docs: Object modules, load modules and program objects"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=input-object-modules-load-modules-program-objects"
categories: ["Development"]
tags: ["development", "devops"]
---

Compilation produces an **object deck**; the **Binder** (formerly the linkage editor) resolves external references and writes a load module into a PDS, or a **program object** into a PDSE — the newer format required for many current features.

At run time, z/OS finds it by searching `STEPLIB`/`JOBLIB`, then the **LNKLST** and **LPA**. `S806` means that search failed, and the mistake is usually a missing library rather than a missing program.

A load module carries attributes fixed when it is bound, and they decide how it may be loaded and run: its addressing and residency mode (**AMODE/RMODE**), whether it is reentrant, its aliases and entry points, and its authorization code — `AC(1)` marks a program that may run APF-authorized. The ISPF member list of a load library shows them, and the `AMBLIST` utility prints them in full.

Because an executable is just a member, there is no version history: a new bind replaces it in place. And the copy already loaded into memory does not change. That is the reason for a family of "refresh" operations — `F LLA,REFRESH` for the link list, `NEWCOPY` or `PHASEIN` in CICS — and for the classic complaint that a fix was installed but the old code still runs.

Load modules are not plain data. Copying one with a text-mode file transfer destroys it; move them with `IEBCOPY`, with TSO `TRANSMIT` and `RECEIVE`, or by transferring an unloaded copy in binary.
