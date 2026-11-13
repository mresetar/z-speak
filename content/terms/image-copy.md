---
title: "Image Copy"
params:
  expansion: "Db2 image copy (the COPY and RECOVER utilities)"
  short: "A Db2 backup of a table space or index, taken by the COPY utility and used by RECOVER together with the log to rebuild the object."
  ref: { title: "IBM Docs: Db2 13 — Full image copies", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=copy-full-image-copies" }
  aka: ["COPY utility", "RECOVER utility", "full image copy", "incremental image copy", "SYSCOPY", "SHRLEVEL REFERENCE", "COPYTOCOPY", "QUIESCE", "point-in-time recovery"]
  related: ["Db2 Log", "Db2 for z/OS", "Table Space", "REORG", "FlashCopy", "DFSMShsm", "GDG", "Batch Window"]
categories: ["Middleware"]
tags: ["db2", "backup", "operations"]
---

Db2 data is not backed up by copying its underlying data sets with a general tool while Db2 is running. The supported backup is an **image copy**, written by the `COPY` utility page by page and recorded by Db2 in a catalog table, `SYSIBM.SYSCOPY`, along with the log position at which it was taken.

A **full** copy contains every page; an **incremental** copy only the pages changed since the last copy. `SHRLEVEL REFERENCE` allows readers while it runs and gives a consistent copy; `SHRLEVEL CHANGE` allows updates too, producing a "fuzzy" copy that is still usable because the log fills the gaps. Copies can be written to disk or tape — often as generations of a GDG — or taken almost instantly with **FlashCopy**.

`RECOVER` reverses the process. It restores the most recent suitable image copy and then applies the **log** forward, either to the current moment or to an earlier point (`TOLOGPOINT`, or a prior copy) when the aim is to undo a bad change. Recovering to a point in time is delicate: related tables must go back together or referential integrity and application consistency are lost, which is what `QUIESCE` points and recovery of whole sets of objects are for.

Two states warn you. **COPY-pending** means an object was changed in a way that was not logged, typically by `LOAD` or `REORG` with `LOG NO`, and has no valid backup until a copy is taken. **RECOVER-pending** means it is unusable until recovered. A backup strategy is only proven when a recovery has actually been rehearsed, including the time it takes.
