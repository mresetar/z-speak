---
title: "Unit of Work"
params:
  expansion: "Unit of work / unit of recovery"
  short: "The all-or-nothing scope of a transaction, committed or backed out across every resource it touched."
  ref: { title: "IBM Docs: z/OS Basic Skills — Dispatchable units of work", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_dispatchable.htm" }
  aka: ["UOW", "syncpoint", "two-phase commit"]
  related: ["CICS", "IMS", "Db2 for z/OS", "IBM MQ", "EXEC CICS", "RRS", "Checkpoint/Restart", "SQLCODE", "Db2 Log", "Db2 Locking"]
  links:
    - title: "IBM Docs: Db2 13: Unit of work"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=recovery-unit-work"
categories: ["Middleware"]
tags: ["transactions", "fundamentals"]
---

A CICS transaction updates Db2, writes a VSAM record and puts an MQ message. At the **syncpoint** all three commit, or none do. The transaction manager acts as coordinator and runs **two-phase commit**: prepare every resource manager, and only if all vote yes, commit.

This is the platform's quiet advantage. Distributed systems usually give up on it and reach for sagas and compensation because coordinating heterogeneous resources is expensive — on z/OS the resource managers all speak the same protocol to the same coordinator, and it has been production-hardened for forty years.

Vocabulary: **SYNCPOINT** and **SYNCPOINT ROLLBACK** in CICS, **CHKP** and **ROLB** in IMS, `COMMIT` and `ROLLBACK` in Db2. An **in-doubt** unit of work is one where the coordinator failed between phases, and resolving those by hand is a genuinely unpleasant morning.
