---
title: "TDQ"
params:
  expansion: "Transient Data Queue"
  short: "A predefined CICS queue read once in arrival order — used for logging, for handing data to batch, and for triggering transactions."
  ref: { title: "IBM Docs: CICS — Transient data queues", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=applications-transient-data-queues" }
  aka: ["transient data", "TD queue", "WRITEQ TD", "intrapartition", "extrapartition", "DCT", "CSSL"]
  related: ["TSQ", "CICS", "EXEC CICS", "CSD", "SYSOUT", "IBM MQ"]
  links:
    - title: "IBM Docs: Intrapartition transient data queues"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=control-intrapartition-transient-data-queues"
categories: ["Middleware"]
tags: ["cics", "development"]
---

Unlike a temporary storage queue, a transient data queue must be defined as a resource, has a four-character name, and is strictly first-in, first-out: `READQ TD` returns the next record and removes it.

There are two main kinds. An **extrapartition** queue is a sequential data set or SYSOUT stream outside CICS: writing to it is how an online program produces a file or a report for batch, and CICS's own message logs — `CSSL`, `CSMT` and the like, pointing at the `MSGUSR` output — are queues of this kind. An **intrapartition** queue is kept inside the region and can have a **trigger level**: when the number of records reaches it, CICS automatically starts a named transaction to process them. That is the original CICS mechanism for asynchronous, queue-driven work. An **indirect** queue is simply an alias for another.

The old name for the definitions, the destination control table (DCT), still appears in conversation and messages. For work that must be queued reliably across regions or systems, MQ has largely taken over.
