---
title: "EXPLAIN"
params:
  expansion: "EXPLAIN and the Db2 access path"
  short: "The Db2 facility that records how the optimizer intends to run an SQL statement: which indexes, which join method, in what order."
  ref: { title: "IBM Docs: Db2 13 — Using EXPLAIN to understand the access path", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=performance-using-explain-understand-access-path" }
  aka: ["access path", "PLAN_TABLE", "optimizer", "EXPLAIN(YES)", "table space scan", "matching index scan", "MATCHCOLS", "APREUSE", "access path regression"]
  related: ["Db2 for z/OS", "Plan and Package", "RUNSTATS", "Db2 Index", "Static and Dynamic SQL", "Db2 Developer Extension", "Table Space", "Buffer Pool", "SQL"]
categories: ["Middleware"]
tags: ["db2", "sql", "performance"]
---

SQL says what data is wanted, not how to fetch it. The Db2 **optimizer** chooses the how — the **access path** — by estimating the cost of the alternatives from catalog statistics. Whether a query takes a millisecond or an hour depends almost entirely on that choice, and **EXPLAIN** is how you see it.

Run `EXPLAIN PLAN FOR` a statement, or bind a package with `EXPLAIN(YES)`, and Db2 writes rows into a table called **PLAN_TABLE** under your ID, one row per step. The columns worth learning first are `ACCESSTYPE` (`I` for index access, `R` for a table space scan, `N` for an IN-list index scan), `ACCESSNAME` (which index), `MATCHCOLS` (how many leading index columns are used to narrow the search — zero means the whole index is read), `METHOD` (join type: nested loop, merge scan, hybrid), `INDEXONLY`, and the sort indicators. Other tables add cost estimates and predicate detail, and tools such as the Db2 Developer Extension draw the result as a diagram.

For static SQL the access path is chosen at **bind** time and stored in the package, so it stays the same until a rebind. That stability is a feature, and also the source of the classic incident: a rebind after new statistics or a new Db2 level picks a different path and a program that ran well suddenly does not. Options such as `APREUSE` and plan management, which keeps the previous copy of a package for `REBIND SWITCH`, exist to contain this.

A table space scan is not automatically bad, and an index is not automatically good; what matters is how many rows and pages are touched.
