---
title: "Db2 Log"
params:
  expansion: "Db2 active log, archive log and bootstrap data set (BSDS)"
  short: "The record of every change Db2 makes, written before the data itself, and the basis of rollback, restart and recovery."
  ref: { title: "IBM Docs: Db2 13 — Managing the log and the bootstrap data set", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=recovery-managing-log-bootstrap-data-set" }
  aka: ["active log", "archive log", "BSDS", "bootstrap data set", "LRSN", "DSNJU004", "print log map", "log offload", "DSNJ110E", "write-ahead logging"]
  related: ["Db2 for z/OS", "Image Copy", "Unit of Work", "Data Sharing", "Db2 Locking", "System Logger", "DSNZPARM", "Buffer Pool"]
categories: ["Middleware"]
tags: ["db2", "availability", "internals"]
---

Db2 follows the rule of **write-ahead logging**: before a changed page may be written to disk, a description of the change must already be on the log. Updated pages can therefore sit in buffer pools for a long time, because the log is enough to redo or undo anything.

The log has two tiers. **Active logs** are a fixed set of disk data sets, normally kept in two copies, written in rotation. When one fills, Db2 **offloads** it to an **archive log** on disk or tape and reuses it. The **bootstrap data set** (BSDS), also duplexed, is the inventory: it lists every active and archive log with the range of log addresses each holds, plus checkpoint and restart information. Positions in the log are **RBAs** (relative byte addresses), or **LRSNs** in data sharing, where each member has its own log and the timestamps merge them.

The log serves three purposes. **Rollback** of a single unit of work, using undo records. **Restart** after a failure, when Db2 reads back from the last checkpoint, redoes committed work and backs out what was in flight. **Recovery** of an object, when log records are applied on top of an image copy.

Its failure modes are worth knowing. If archiving stops and every active log fills, Db2 halts all updates until space is found — messages `DSNJ110E` and `DSNJ111E` are warnings to act on immediately. And a batch job that updates millions of rows without committing forces Db2 to keep a huge span of log available, so its eventual rollback or a restart can take as long as the job did.
