---
title: "Buffer Pool"
params:
  expansion: "Db2 buffer pool"
  short: "The memory in which Db2 keeps copies of data and index pages, so that most reads never touch disk."
  ref: { title: "IBM Docs: Db2 13 — Buffer pools", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=objects-buffer-pools" }
  aka: ["BP0", "BP32K", "VPSIZE", "getpage", "group buffer pool", "GBP", "PGFIX"]
  related: ["Db2 for z/OS", "Table Space", "Data Sharing", "Virtual Storage", "Paging", "Coupling Facility", "zHyperLink", "EXPLAIN", "Db2 Log", "DSNZPARM"]
  links:
    - title: "IBM Docs: Db2 13: Buffer pool thresholds"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=pools-buffer-pool-thresholds"
categories: ["Middleware"]
tags: ["db2", "performance", "memory"]
---

Db2 never reads a row directly from disk. It reads the 4 KB (or 8, 16 or 32 KB) **page** containing it into a buffer pool and works on it there. A later request for the same page is satisfied from memory; changed pages are written back to disk later, asynchronously, with the log guaranteeing recoverability in the meantime.

There are many pools, named `BP0`, `BP1` … and `BP8K0`, `BP16K0`, `BP32K` for the larger page sizes. Every table space and index is assigned to one. Separating objects — indexes from data, sort work files from everything — allows each pool to be sized and tuned for its workload with `-ALTER BUFFERPOOL`.

The basic measure is how many **getpage** requests are satisfied without a synchronous read. Buffer pools are normally the largest consumer of real memory on a Db2 system, and they are usually **page-fixed** and backed by large frames, which means that memory must genuinely be available: a buffer pool that z/OS has to page is worse than a smaller one.

In data sharing, changed pages are also written to **group buffer pools** in the Coupling Facility so that other members see them.
