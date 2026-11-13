---
title: "TCB"
params:
  expansion: "Task Control Block"
  short: "The control block representing one unit of work inside an address space — the thing the dispatcher actually schedules."
  ref: { title: "IBM Docs: z/OS Basic Skills — Dispatchable units of work: tasks and service requests", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=system-dispatchable-units-work-tasks-service-requests" }
  aka: ["SRB", "Service Request Block", "dispatchable unit"]
  related: ["Address Space", "TCB", "PSW", "Problem State", "WLM", "Interrupt", "Control Block", "Dispatcher", "Enclave", "Reentrant Code"]
  links:
    - title: "Wikipedia: Task Control Block"
      url: "https://en.wikipedia.org/wiki/Task_Control_Block"
categories: ["Operating System"]
tags: ["zos", "internals", "performance"]
---

Dispatching in z/OS happens at two levels. An **address space** is the container; inside it, work runs as **dispatchable units**. The ordinary one is the **TCB** — one per task, chained off the address space's control blocks, holding the register set, dispatching priority and open data set information for that task. COBOL batch steps, CICS transactions (via kernel tasks) and TSO sessions all execute under TCBs.

The second kind is the **SRB** (Service Request Block) — a lighter-weight unit for privileged, system-level work that may be dispatched on any CPU in the sysplex and does not need the full task machinery. System services, XCF and cross-memory code favour SRBs; you meet the distinction in tuning discussions ("this path is TCB-bound" vs "SRB time") and in RMF reports that charge CPU time to each.

The newcomer mistake is treating the TCB as the thread model of other platforms: TCBs are heavier, and a classic z/OS performance trick is reducing TCB switches (or moving work into SRBs) rather than adding parallelism. In a dump, the TCB chain is where IPCS analysis of "what was this address space doing" starts.
