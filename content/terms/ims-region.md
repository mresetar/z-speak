---
title: "IMS Region"
params:
  expansion: "IMS control region and dependent regions (MPP, BMP, IFP, JMP)"
  short: "The address spaces that make up a running IMS: a control region owning the system, and dependent regions where applications execute."
  ref: { title: "IBM Docs: IMS — Dependent regions", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=environment-dependent-regions" }
  aka: ["MPP", "BMP", "IFP", "JMP", "control region", "DLISAS", "DBRC", "DFSRRC00", "DL/I batch"]
  related: ["IMS", "DL/I", "PSB", "Started Task", "Fast Path", "IMS Connect", "IRLM", "Address Space", "MFS", "IMS Status Code"]
  links:
    - title: "IBM Docs: IMS 15.5: Starting dependent regions"
      url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=ims-starting-dependent-regions"
categories: ["Middleware"]
tags: ["ims", "operations", "transactions"]
---

IMS is not one address space but a family. The **control region** owns the message queues, the log and the scheduling of work. Beside it run a DL/I separate address space for database access, a **DBRC** region that keeps track of logs and database recovery information, and, for locking across systems, an IRLM.

Application programs run in **dependent regions**, of several kinds:

| Region | Runs |
|---|---|
| **MPP** — message processing | Online transactions. IMS schedules a program into a free region when a message for its transaction arrives |
| **BMP** — batch message processing | A batch job connected to the online system, sharing its databases and able to read and write its queues |
| **IFP** | Fast Path message-driven programs |
| **JMP / JBP** | Java equivalents of MPP and BMP |

A BMP is how batch and online coexist. Because it holds locks on live databases, it must take checkpoints frequently, both to release those locks and to be restartable.

Separate from all this is true **DL/I batch**: a stand-alone job with its own copy of the database manager and its own log, needing exclusive use of its databases unless data sharing is set up.

In JCL every one of them executes the same program, `DFSRRC00`, with a parameter saying which kind of region it is to be.
