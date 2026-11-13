---
title: "Address Space"
params:
  expansion: "Virtual address space"
  short: "z/OS's unit of isolation — one program's private 64-bit memory, roughly a process."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is an address space?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_82.htm" }
  aka: ["AS", "ASID"]
  related: ["z/OS", "MVS", "TCB", "Paging", "Started Task", "WLM", "Data Space", "Cross-Memory", "Common Storage", "Subsystem"]
  links:
    - title: "Wikipedia: Address space"
      url: "https://en.wikipedia.org/wiki/Address_space"
categories: ["System Services"]
tags: ["zos", "internals"]
---

Every job, started task and TSO user gets its own address space, identified by an **ASID**. Storage is private unless deliberately shared, so a runaway program damages only itself — the reason a single z/OS image safely mixes production and test workloads.

Three flavours dominate everyday talk: **batch** jobs submitted through JES, **started tasks** (STCs) for long-running servers like CICS or Db2, and **TSO** users. `D A,L` on the console lists them all.

Inside an address space, work runs under **TCB**s (task control blocks) or, for more privileged and dispatchable-anywhere code, **SRB**s.

Not everything in an address space is private. Each one maps the same **common** areas — the nucleus, the link pack area and the common service area — at the same addresses, so that system code and shared data are visible from everywhere. The **private area** is what belongs to the job, and its size is what the `REGION` parameter limits. Running out gives abends such as `S878` or `S80A`, which are about virtual storage, not about real memory in the machine.

The number of address spaces is set by `MAXUSER` in PARMLIB, and each has costs, so servers handle many users inside one address space rather than one each. Some address spaces can be made **non-swappable** or are system ones created at IPL — `*MASTER*`, `PCAUTH`, `GRS`, `XCFAS` and others. When programs need to work across the boundary, they use **cross-memory** services or shared data spaces rather than breaking isolation.
