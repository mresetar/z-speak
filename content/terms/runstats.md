---
title: "RUNSTATS"
params:
  expansion: "RUNSTATS utility (catalog statistics)"
  short: "The Db2 utility that counts and samples the data and stores the results in the catalog, where the optimizer reads them to choose access paths."
  ref: { title: "IBM Docs: Db2 13 — RUNSTATS", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=utilities-runstats" }
  aka: ["catalog statistics", "inline statistics", "STATISTICS keyword", "real-time statistics", "RTS", "statistics profile", "DSNACCOX"]
  related: ["EXPLAIN", "Db2 for z/OS", "REORG", "Plan and Package", "Db2 Index", "Table Space", "Batch Window"]
categories: ["Middleware"]
tags: ["db2", "performance", "operations"]
---

The Db2 optimizer does not look at the data when it plans a query. It looks at numbers in the catalog: how many rows a table has, how many pages, how many distinct values each indexed column holds, how well the data is clustered. **RUNSTATS** is the utility that produces those numbers. If they are missing or stale, the optimizer plans for a table that no longer exists — treating a ten-million-row table as nearly empty, for instance — and chooses badly.

It runs as a batch utility against a table space or index, `RUNSTATS TABLESPACE db.ts TABLE(ALL) INDEX(ALL)`, optionally sampling rather than reading everything. Extra options collect **frequency** and **histogram** statistics for columns whose values are unevenly distributed, which is where defaults mislead most. Other utilities — `REORG`, `LOAD`, `REBUILD INDEX` — can gather the same statistics **inline** as they pass over the data, saving a separate run.

Two points confuse newcomers. First, new statistics change nothing for **static SQL** until the package is rebound; only dynamic SQL sees them immediately. So "run RUNSTATS and rebind" is a pair, and the rebind is the risky half. Second, there are two kinds of statistics. RUNSTATS feeds the optimizer; **real-time statistics**, which Db2 maintains continuously on its own, track inserts, updates and deletes since the last utility ran. Tools and the `DSNACCOX` stored procedure read the real-time numbers to decide when a RUNSTATS, REORG or image copy is actually due.

Running it on everything every night is common and wasteful; running it after large changes in volume or distribution is what matters.
