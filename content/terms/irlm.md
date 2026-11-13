---
title: "IRLM"
params:
  expansion: "Internal Resource Lock Manager"
  short: "The separate address space that manages locks for Db2 and IMS, and detects the deadlocks and timeouts among them."
  ref: { title: "IBM Docs: Db2 internal resource lock manager", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=architecture-db2-internal-resource-lock-manager" }
  aka: ["lock manager", "IRLMPROC", "deadlock", "timeout", "-911"]
  related: ["Db2 for z/OS", "IMS", "Coupling Facility", "CF Structure", "Parallel Sysplex", "WLM", "Data Sharing", "Db2 Locking"]
  links:
    - title: "IBM Docs: Db2 13: Controlling the IRLM"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=connections-controlling-irlm"
categories: ["Middleware"]
tags: ["database", "internals", "performance"]
---

Every Db2 subsystem starts a companion address space, the IRLM, and asks it for a lock each time a transaction needs one on a page, row, table or other resource. IMS uses the same component for its database locking. Keeping the lock manager outside the database gives it its own storage and lets it be dispatched independently.

The IRLM is where contention becomes visible. It runs **deadlock detection** on a timer and picks a victim; it enforces the **timeout** after which a waiter gives up. Both surface to the application as SQLCODE `-911` or `-913`, and to the DBA as messages naming the holder and the waiter.

In **data sharing**, the IRLMs of all members cooperate through a lock structure in the **Coupling Facility**, so a lock taken on one system is honoured on every other. One operational rule follows from its role: the IRLM must be dispatched ahead of the work that depends on it, so it is given a very high WLM priority — if the lock manager is slow, the whole database is slow.
