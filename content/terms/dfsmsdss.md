---
title: "DFSMSdss"
params:
  expansion: "Data Facility Storage Management Subsystem - data set services"
  short: "The z/OS copy engine for volumes and data sets — full-volume dumps, restores and fast replication via ADRDSSU."
  ref: { title: "IBM Docs: z/OS DFSMSdss", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=descriptions-dfsmsdss" }
  aka: ["DSS", "ADRDSSU"]
  related: ["DFSMS", "DFSMShsm", "DFSMSrmm", "DASD", "Virtual Tape", "GDPS", "FlashCopy"]
  links:
    - title: "IBM Docs: Introduction to the DFSMSdss component of DFSMS"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-introduction-dfsmsdss-component-dfsms"
categories: ["Storage"]
tags: ["storage", "backup", "batch"]
---

Where **DFSMShsm** is the always-on housekeeper, **DFSMSdss** is the heavy machinery you point at a job: volume-level and data-set-level **DUMP** and **RESTORE**, logical or physical copies, space release and data set conversion — driven in batch by the `ADRDSSU` program with a control card naming what to move and a `STORCLAS`/filter set for what matches.

Two capabilities make it more than a copy utility. **FlashCopy** integration means a "full volume dump" can be an instantaneous point-in-time snapshot taken by the storage subsystem and written out afterwards — the basis of most backup windows and of **GDPS**'s copy pipelines. And `CONVERTV`/`RELEASE`-style functions reclaim fragmented space without a recall of the data.

You meet DSS in DR runbooks ("restore the volume set with ADRDSSU from the tape/virtual tape stack"), in migration projects (move everything off an old volume array), and whenever someone needs a *consistent, restorable copy* rather than HSM's per-data-set backups. The command syntax is famously picky — `DUMP DS(INCL(**)) SPHERE`-style — and the `ADR`-prefixed messages are what you read when a copy misses a data set.
