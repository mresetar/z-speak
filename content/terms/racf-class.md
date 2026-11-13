---
title: "RACF Class"
params:
  expansion: "RACF general resource class and the class descriptor table"
  short: "A named category of protected resource in RACF: FACILITY, SURROGAT, OPERCMDS, TCICSTRN and hundreds more, each with its own profiles."
  ref: { title: "IBM Docs: Supplied RACF resource classes", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-supplied-racf-resource-classes" }
  aka: ["resource class", "class descriptor table", "CDT", "SURROGAT", "OPERCMDS", "STARTED", "UNIXPRIV", "CSFKEYS", "XFACILIT", "grouping class", "member class", "RDEFINE", "RLIST"]
  related: ["RACF", "RACF Profile", "SETROPTS", "SAF", "RACF Group", "APF Authorization", "Started Task", "ESM", "ICSF"]
categories: ["Security"]
tags: ["security", "access-control", "configuration"]
---

RACF protects data sets with data set profiles. Everything else — a CICS transaction, an operator command, a Db2 plan, the right to submit jobs as someone else — is protected by a profile in a **general resource class**. The class says what kind of thing is being protected; the profile name says which one.

Each class is defined in the **class descriptor table**, which sets the rules for its profile names, the default return code when no profile matches, and whether the class can be held in memory. IBM supplies several hundred, and an installation or a vendor can add more dynamically.

A few come up constantly. `FACILITY` is a catch-all for miscellaneous system functions, with profile names such as `BPX.SUPERUSER` or `IRR.DIGTCERT.LIST`. `SURROGAT` controls who may submit work under another user ID. `OPERCMDS` protects console commands, `STARTED` assigns user IDs to started tasks, `UNIXPRIV` grants individual superuser abilities, `CSFKEYS` and `CSFSERV` protect cryptographic keys and services, and `PROGRAM` controls program execution. Subsystems have their own: `TCICSTRN` for CICS transactions, `DSNR` for connecting to Db2, `MQQUEUE` for MQ.

Some classes come in pairs: a **member class** for individual profiles and a **grouping class** whose profiles list many resources, such as `TCICSTRN` and `GCICSTRN`.

Two things catch people. A class does nothing until it is **active** (`SETROPTS CLASSACT`), and an inactive class usually means the check is skipped, not failed. And the product documentation, not RACF, decides what each access level means: `READ` to a `FACILITY` profile may confer a very powerful privilege, so levels cannot be read as "read-only".
