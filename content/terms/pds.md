---
title: "PDS"
params:
  expansion: "Partitioned Data Set (and PDSE)"
  short: "A data set containing named members — a one-level directory, used for source and load modules."
  ref: { title: "IBM Docs: z/OS Basic Skills — Why is a PDS structured like that?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_163.htm" }
  aka: ["PDSE", "library"]
  related: ["Data Set", "Load Module", "Copybook", "ISPF", "High-Level Qualifier", "BPAM", "SPACE", "Sequential Data Set"]
  links:
    - title: "IBM Docs: Partitioned Data Set Extended (PDSE)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sets-partitioned-data-set-extended-pdse"
categories: ["Storage"]
tags: ["storage", "development"]
---

`PROD.SOURCE.COBOL(PAYCALC)` is member `PAYCALC` in library `PROD.SOURCE.COBOL`. Members are what you edit in ISPF; libraries are what JCL concatenates on `SYSLIB`, `STEPLIB` and `SYSPROC`.

The classic **PDS** never reclaims space when a member is deleted or rewritten, so it eventually fills up and needs a **compress** (`IEBCOPY`) — a genuine cause of production incidents. **PDSE** fixed this: automatic space reuse, no directory-block limit, and support for program objects. New libraries should be PDSE unless something specifically requires otherwise.

A PDS has two parts: a **directory** at the front, with a fixed number of blocks chosen at allocation (`SPACE=(CYL,(5,1,20))` asks for 20), and the member data behind it. Run out of directory blocks and you cannot add members even though the data set has free space — and in a classic PDS the only fix is to reallocate and copy. Each directory entry holds the member name (up to eight characters) and optional statistics, such as the last-changed date and user that ISPF maintains.

Sharing is the other trap. A classic PDS is safe for one writer at a time; two jobs updating different members with `DISP=SHR` can corrupt the directory, which is why ISPF adds its own enqueue. **PDSE** allows member-level sharing, and within a sysplex can be shared for update across systems. In JCL the difference is one keyword — `DSNTYPE=LIBRARY` — and SMS can make it the default.
