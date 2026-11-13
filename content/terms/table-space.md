---
title: "Table Space"
params:
  expansion: "Db2 table space"
  short: "The Db2 storage object that holds a table's rows, backed by VSAM linear data sets — and the unit most utilities work on."
  ref: { title: "IBM Docs: Db2 13 — Table space types and characteristics", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=spaces-table-space-types-characteristics-in-db2forzos" }
  aka: ["tablespace", "UTS", "PBG", "PBR", "index space", "COPY pending", "table space partition"]
  related: ["Db2 for z/OS", "Buffer Pool", "KSDS", "Plan and Package", "DFSMS", "Data Sharing", "VSAM", "EXPLAIN", "RUNSTATS", "REORG"]
  links:
    - title: "IBM Docs: Db2 13: Db2 table spaces"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=structures-db2-table-spaces"
categories: ["Middleware"]
tags: ["db2", "database", "storage"]
---

A table is a logical thing; a table space is where its rows physically live. Each table space, and each index's **index space**, is one or more VSAM linear data sets with names such as `DSNC10.DSNDBD.PAYDB.EMPTS.I0001.A001` — which is how a Db2 object appears in a catalog listing or a storage report. A **database**, in Db2 for z/OS, is just a named group of table spaces.

The current type is the **universal table space**, in two forms. **Partition-by-range** (PBR) divides a table by key value — by month or region, say — so that partitions can be loaded, reorganised and recovered independently. **Partition-by-growth** (PBG) simply adds a partition when the last one fills. The older simple, segmented and classic partitioned types are deprecated and are being converted wherever they survive.

Operationally, the table space or partition is the unit of work for the utilities — `COPY`, `REORG`, `RUNSTATS`, `RECOVER` — and of availability. Db2 marks an object with a restrictive state such as *COPY pending* or *CHECK pending* when something must be done before it can be used normally, and those states are a routine cause of applications suddenly receiving "resource unavailable".
