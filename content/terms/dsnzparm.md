---
title: "DSNZPARM"
params:
  expansion: "Db2 subsystem parameter module"
  short: "The load module that holds a Db2 subsystem's system-wide settings, built by an assembly job and loaded when Db2 starts."
  ref: { title: "IBM Docs: Db2 13 — Subsystem parameters", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=objects-subsystem-parameters" }
  aka: ["zparm", "ZPARM", "subsystem parameters", "DSNTIJUZ", "DSN6SPRM", "DSN6SYSP", "SET SYSPARM", "DSNHDECP", "application defaults", "DECP"]
  related: ["Db2 for z/OS", "SIT", "PARMLIB", "Db2 Locking", "Db2 Log", "DDF", "Buffer Pool", "Systems Programmer"]
categories: ["Middleware"]
tags: ["db2", "configuration", "sysprog"]
---

Most z/OS products read their settings from text members. Db2 keeps its global settings in a **load module**, conventionally called **DSNZPARM** — "the zparms". The values are coded as parameters of assembler macros (`DSN6SPRM`, `DSN6SYSP`, `DSN6LOGP` and others) in an installation job, `DSNTIJUZ`, which assembles and binds them. The name of the module to use is given when Db2 is started.

The parameters cover the things that apply to the whole subsystem: how many threads and remote connections are allowed (`CTHREAD`, `MAXDBAT`), how long a lock wait may last (`IRLMRWT`), checkpoint frequency, log and archive settings, authorisation IDs with system authority, default behaviours of the optimizer and many feature switches. A companion module, **DSNHDECP**, holds application defaults such as the default CCSIDs, decimal point and date format.

Many parameters can be changed without stopping Db2: rebuild the module and issue `-SET SYSPARM RELOAD` or name a different module. Others still need a restart, and the documentation marks each one. In data sharing every member has its own module, and keeping them aligned is part of the administrator's job.

The reason it matters to people who never edit it is that zparms explain behaviour. A program that receives `-911` after 30 seconds is seeing `IRLMRWT`. A connection refused at peak is `MAXDBAT` or `CONDBAT`. A query that behaves differently on test and production may be seeing different optimizer zparms. When behaviour differs between subsystems with identical code and data, comparing zparms is an early step.
