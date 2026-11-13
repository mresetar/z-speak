---
title: "Db2 Index"
params:
  expansion: "Db2 index (B-tree access path to a table)"
  short: "A sorted structure of key values and row pointers that lets Db2 find rows without reading the whole table, and enforce uniqueness."
  ref: { title: "IBM Docs: Db2 13 — Db2 indexes", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=tables-db2-indexes" }
  aka: ["unique index", "clustering index", "partitioning index", "NPI", "DPSI", "RID", "index-only access", "REBUILD INDEX", "leaf page"]
  related: ["EXPLAIN", "Table Space", "RUNSTATS", "REORG", "Db2 for z/OS", "Buffer Pool", "Alternate Index", "Db2 Locking", "SQL"]
categories: ["Middleware"]
tags: ["db2", "sql", "performance"]
---

A Db2 **index** is a B-tree: root and intermediate pages lead to **leaf pages**, which hold key values in order, each with the **RIDs** (row identifiers) of the rows that have that key. Given a key, Db2 walks a few pages down the tree and goes straight to the row. Each index lives in its own **index space**, a separate data set with its own buffer pool.

Indexes do several jobs. A **unique** index enforces a primary key or unique constraint. The **clustering** index defines the order Db2 tries to keep the rows in, which makes range scans on that key cheap. On a partitioned table, an index can itself be partitioned (a **DPSI**) or span all partitions (an **NPI**), a choice that trades query speed against how independently partitions can be maintained.

The optimizer decides whether and how to use an index. What matters most is the order of its columns: an index on `(BRANCH, ACCOUNT)` serves a predicate on BRANCH, or on both, but is little help for ACCOUNT alone. If every column a query needs is in the index, Db2 can answer with **index-only access** and never touch the table. Predicates wrapped in functions or comparing mismatched data types may not be able to use an index at all.

Indexes are not free. Every insert, delete, and update of a key column must maintain each index, so a table with fifteen indexes is slow to load and to update. Indexes also need REORG as their leaf pages split and empty, and an index can be discarded and recreated from the data with `REBUILD INDEX`, which is why losing one is an inconvenience rather than a disaster.
