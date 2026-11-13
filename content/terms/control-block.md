---
title: "Control Block"
params:
  expansion: "Control block (system data area)"
  short: "A structured area of storage in which z/OS keeps the state of something: a task, an address space, a device, an open file."
  ref: { title: "IBM Docs: Control blocks and data areas scanned, mapped, and formatted", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=commands-control-blocks-data-areas-scanned-mapped-formatted" }
  aka: ["data area", "CVT", "PSA", "ASCB", "ASXB", "TIOT", "JFCB", "control block chain", "mapping macro"]
  related: ["TCB", "UCB", "DCB", "IPCS", "Dump", "Address Space", "HLASM", "Storage Key"]
categories: ["Operating System"]
tags: ["internals", "troubleshooting", "sysprog"]
---

z/OS does not keep its state in objects or tables with accessor functions. It keeps it in **control blocks** — fixed layouts of fields at known offsets — linked to each other by address pointers. Understanding the system at depth largely means knowing which block describes what and how to get from one to the next.

A few are the starting points for everything. The **PSA** sits at address zero of each processor's storage and points to the **CVT** (communications vector table), the anchor for system-wide information. Each address space is represented by an **ASCB**; each task by a **TCB**; each device by a **UCB**. For a job step, the **TIOT** lists its DD names and the **JFCB** holds the details of each allocated data set. Programs build blocks of their own too: a **DCB** or **ACB** for every file they open.

Layouts are published as **mapping macros** (for example `IHAPSA`, `CVT`, `IKJTCB`), which generate a DSECT in assembler, and are documented in the multi-volume *MVS Data Areas*. Many fields are marked as programming interfaces; the rest may change between releases, which is how code that "peeks" at control blocks breaks during an upgrade.

In a dump, IPCS formats these blocks and follows the chains for you, and a broken chain is itself a finding. Even high-level-language programmers meet the names in messages and in dump summaries.
