---
title: "REORG"
params:
  expansion: "REORG utility (reorganising table spaces and indexes)"
  short: "The Db2 utility that rewrites a table space or index into clean physical order, reclaiming space and applying pending definition changes."
  ref: { title: "IBM Docs: Db2 13 — REORG TABLESPACE", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=utilities-reorg-tablespace" }
  aka: ["REORG TABLESPACE", "REORG INDEX", "online REORG", "SHRLEVEL CHANGE", "shadow data set", "mapping table", "drain", "pending definition change", "AREOR"]
  related: ["Table Space", "Db2 Index", "RUNSTATS", "Image Copy", "Db2 for z/OS", "Batch Window", "FlashCopy", "Db2 Locking"]
categories: ["Middleware"]
tags: ["db2", "operations", "performance"]
---

Rows are inserted, updated and deleted all day, and the physical layout degrades. Rows meant to sit together in clustering order drift apart; updated rows that no longer fit are moved, leaving pointers behind; deleted rows leave holes; indexes develop half-empty pages. Queries that read ranges of data pay for it with extra I/O. **REORG** unloads the data, sorts it into order, reloads it with fresh free space and rebuilds the indexes.

In its modern form it runs while applications keep working. With `SHRLEVEL CHANGE` Db2 builds a **shadow** copy of the data, applies the changes made meanwhile from the log, and then briefly **drains** all access to switch the shadow in. That final switch needs every application to reach a commit point, so one long-running unit of work with no commits can make an online REORG wait and time out — the usual reason one fails in production.

REORG is also how many `ALTER` statements take effect. Changing a column's data type, a table space's page size or its partitioning leaves the object in an **advisory REORG-pending** state, and the change is materialised by the next REORG.

Operationally it is usually combined: REORG can take an inline **image copy** and gather inline **statistics** in the same pass, so one utility does the work of three.

Reorganising everything on a schedule wastes resources. Real-time statistics show which objects are disorganised enough to matter, and sites drive REORG from those thresholds.
