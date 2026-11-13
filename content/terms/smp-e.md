---
title: "SMP/E"
params:
  expansion: "System Modification Program/Extended"
  short: "The package manager for z/OS software — installs products and tracks every fix and prerequisite."
  ref: { title: "IBM Docs: z/OS Basic Skills — System installation and maintenance using SMP/E", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_whatissmpe.htm" }
  aka: ["FIXCAT"]
  related: ["PTF", "APAR", "z/OS", "SYSMOD", "CSI", "HOLDDATA", "ServerPac"]
  links:
    - title: "Wikipedia: SMP/E"
      url: "https://en.wikipedia.org/wiki/SMP/E"
categories: ["System Services"]
tags: ["maintenance", "sysprog"]
---

SMP/E maintains a **CSI** database describing every element of installed software, who owns it, which fixes are applied, and what they require. Its verbs run in a fixed sequence: `RECEIVE` (bring the fix in), `APPLY` (put it in the test libraries), `ACCEPT` (commit it, discarding the ability to back it out easily).

Its value is dependency integrity: it refuses an APPLY whose prerequisites are missing and can restore a bad fix cleanly. Its cost is ceremony — this is why installing mainframe software is a project rather than a command.

SMP/E keeps software in **zones**. The **global zone** records what has been received. A **target zone** describes the libraries a system actually runs from, and a **distribution zone** describes the backup copy of every element at its last accepted level. `APPLY` updates target libraries; `ACCEPT` updates distribution libraries; `RESTORE` backs a fix out by rebuilding the element from the distribution copy — which is why you do not accept a fix until you trust it.

Everything installed is a **SYSMOD**: a **FUNCTION** (a product or feature, identified by an **FMID**), a **PTF**, an **APAR** fix, or a **USERMOD** (a local change). `APPLY CHECK` is a dry run that reports what would happen and what is missing, and it should precede every real apply. Work is done in batch, with ISPF panels or **z/OSMF Software Management** to help. The trap is thinking that a successful `APPLY` means the fix is active: it has changed libraries on disk, and nothing changes in a running system until those libraries are brought into use.
