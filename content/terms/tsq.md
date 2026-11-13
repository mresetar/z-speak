---
title: "TSQ"
params:
  expansion: "Temporary Storage Queue"
  short: "A named CICS scratchpad of numbered items that a program can write, re-read in any order, update and delete."
  ref: { title: "IBM Docs: CICS — Temporary storage queues", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=applications-temporary-storage-queues" }
  aka: ["temporary storage", "TS queue", "WRITEQ TS", "READQ TS", "DFHTEMP", "TSMODEL"]
  related: ["TDQ", "CICS", "EXEC CICS", "Channels and Containers", "Coupling Facility", "CEMT"]
  links:
    - title: "IBM Docs: Temporary storage queues"
      url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=transaction-temporary-storage-queues"
categories: ["Middleware"]
tags: ["cics", "development"]
---

A program issues `WRITEQ TS QUEUE(name)` and the queue exists; nothing has to be defined first. Each write adds a numbered **item**, and `READQ TS` can fetch any item by number, as often as wanted. That makes a TSQ the classic place to keep state between the screens of a pseudo-conversation — a scrolling list, a shopping basket — usually under a name built from the terminal or user ID.

Where the data lives is a matter of configuration. **Main** storage is fast and is lost at restart; **auxiliary** storage is a VSAM file and can be recoverable; a **shared** queue lives in a Coupling Facility pool and is visible to every region in the sysplex. `TSMODEL` definitions map queue-name prefixes to these choices.

"Temporary" is misleading. A queue stays until something issues `DELETEQ TS`, and a transaction that abends before cleaning up leaves it behind. Orphaned queues filling auxiliary storage are a standard CICS housekeeping problem, which is why automatic expiry intervals were added to `TSMODEL`.
