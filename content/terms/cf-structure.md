---
title: "CF Structure"
params:
  expansion: "Coupling Facility structure"
  short: "A named block of Coupling Facility storage — cache, list or lock — that a sysplex exploiter uses to share data between systems."
  ref: { title: "IBM Docs: Types of Coupling Facility Structures", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=programmer-types-coupling-facility-structures" }
  aka: ["structure", "cache structure", "list structure", "lock structure", "XES", "rebuild", "duplexing"]
  related: ["Coupling Facility", "CFRM", "XCF", "Parallel Sysplex", "IRLM", "System Logger", "GRS", "RLS"]
  links:
    - title: "IBM Docs: Contents of a coupling facility"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=planning-contents-coupling-facility"
categories: ["System Services"]
tags: ["sysplex", "clustering", "internals"]
---

A **Coupling Facility** is, to its users, just memory with rules. That memory is divided into structures, each owned by one exploiter and reached through the z/OS XES services. There are three kinds:

| Type | Behaviour | Typical users |
|---|---|---|
| **Cache** | Shared buffers with cross-invalidation of local copies | Db2 group buffer pools, VSAM record-level sharing |
| **List** | Shared queues and tables | XCF signalling, System Logger log streams, MQ shared queues, JES2 checkpoint |
| **Lock** | A shared lock table for fast contention detection | IRLM for Db2 and IMS, GRS star |

Each structure has a name the exploiter expects, and a size and placement defined in the **CFRM** policy. `D XCF,STR` lists them and shows which Coupling Facility each one is in.

Structures can move. A **rebuild** recreates one in another Coupling Facility, for maintenance or after a failure, and **duplexing** keeps two live copies. Sizing is the recurring task: a structure that is too small does not fail cleanly but degrades whatever depends on it.
