---
title: "APAR"
params:
  expansion: "Authorized Program Analysis Report"
  short: "IBM's defect record — the ticket number for a confirmed software bug."
  ref: { title: "IBM Docs: z/OS Basic Skills — APAR SYSMOD", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_aparsysmod.htm" }
  aka: ["problem report", "APAR fix"]
  related: ["PTF", "SMP/E", "HOLDDATA", "SYSMOD"]
  links:
    - title: "Wikipedia: Authorized Program Analysis Report"
      url: "https://en.wikipedia.org/wiki/Authorized_Program_Analysis_Report"
categories: ["System Services"]
tags: ["maintenance"]
---

When IBM support confirms a problem is a product defect, they open an APAR with an identifier like `OA61234` (z/OS) or `PH45678` (products such as Db2 and CICS). The APAR text describes the symptom, the affected releases and the circumvention; the fix then ships as one or more **PTF**s.

Searching APAR numbers is a normal debugging step: the symptom you are seeing has often been documented by someone else already.

An APAR moves through states. It is **open** while IBM investigates, and closes with a code that tells you what happened: `PER` means a program error was fixed, `DUA` or `DUB` that it duplicates another APAR, `UR1` that it could not be reproduced, `FIN` that the fix is deferred to a future release. A closed `PER` APAR names the fixing PTF for each affected release, which is the number you then order and apply with **SMP/E**.

The trap for newcomers is confusing the two identifiers. The APAR names the *problem*; the PTF names the *fix*. One PTF often resolves several APARs, and an urgent problem may get a temporary **APAR fix** (a `++APAR` SYSMOD) before the proper PTF exists. A **HIPER** APAR is one IBM considers high-impact and pervasive — the ones you are expected to act on rather than wait for the next maintenance cycle.
