---
title: "Db2 Locking"
params:
  expansion: "Db2 locks, isolation levels, deadlocks and timeouts"
  short: "How Db2 keeps concurrent transactions from seeing or damaging each other's uncommitted work, and what happens when they collide."
  ref: { title: "IBM Docs: Db2 13 — Lock contention, suspension, deadlock, and timeout", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=locks-lock-contention-suspension-deadlock-timeout" }
  aka: ["isolation level", "cursor stability", "uncommitted read", "lock escalation", "lock suspension", "CS", "RR", "RS", "LOCKSIZE", "claim and drain", "CURRENTDATA", "SKIP LOCKED DATA"]
  related: ["IRLM", "SQLCODE", "Unit of Work", "Db2 for z/OS", "Plan and Package", "Table Space", "Data Sharing", "REORG"]
categories: ["Middleware"]
tags: ["db2", "transactions", "troubleshooting"]
---

Db2 protects data with **locks**, managed by the **IRLM** address space. A transaction that reads a row takes a share lock; one that changes it takes an exclusive lock and holds it until **commit**. Locks are taken on rows or on pages, according to the table space's `LOCKSIZE`, with intent locks on the table space above them.

How long read locks are held is set by the **isolation level**, chosen at bind time or per statement. **Cursor stability** (CS), the usual choice, releases a read lock as the cursor moves on. **Read stability** and **repeatable read** keep locks until commit, guaranteeing that rows read once look the same if read again. **Uncommitted read** (UR) takes no row locks and may see data that is later rolled back — acceptable for estimates, not for balances.

When a transaction needs a lock held by another it is **suspended**. If the wait exceeds the limit set in the subsystem parameters, it **times out**; if two transactions each wait for the other, Db2 detects the **deadlock** and chooses a victim. Either way the program receives SQLCODE `-911` (its work was rolled back) or `-913` (it was not), and messages `DSNT375I` and `DSNT376I` on the console name both parties and the resource.

The cures are application habits: commit often, access tables in the same order everywhere, keep units of work short, and do not hold locks across a terminal wait. **Lock escalation** — Db2 trading thousands of row locks for one table lock — is the warning sign that a batch job is not committing, and it stalls every online user of that table.
