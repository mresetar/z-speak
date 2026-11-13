---
title: "CICSPlex SM"
params:
  expansion: "CICSPlex System Manager"
  short: "Manages many CICS regions as one system, with workload routing and a single point of operation."
  ref: { title: "IBM Docs: CICS TS — Configuring CICSPlex SM", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=configuring-cicsplex-sm" }
  aka: ["CPSM", "CICSplex"]
  related: ["CICS", "Parallel Sysplex", "WLM", "CMCI", "MRO", "CICS Region", "CICS Explorer"]
  links:
    - title: "IBM Docs: CICSPlex SM system overview"
      url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=sm-cicsplex-system-overview"
categories: ["Middleware"]
tags: ["transactions", "operations"]
---

Production CICS is not one region; it is dozens — terminal-owning regions, application-owning regions, file-owning regions, split for isolation and capacity. CPSM presents them as a single **CICSplex**: one place to query, one place to change resources, and rules that apply to groups rather than to each region by hand.

Its **workload management** routes each transaction to the least-loaded eligible region, and can avoid a region that is failing. Combined with a Parallel Sysplex, this is how a CICS estate absorbs the loss of a whole system without users noticing more than a retry.

The pieces have names you will see in started task lists. A **CMAS** (CICSPlex SM address space) is the manager, one per z/OS image. Each managed region runs a small agent and is then called a **MAS**. The **WUI server** is a CICS region providing the browser interface, and **CICS Explorer** connects through the same route. Definitions are kept in a **data repository** owned by the CMAS.

Besides workload routing there are three other functions. **BAS** (business application services) keeps resource definitions centrally and installs them into the right regions, an alternative to per-region CSD files. **RTA** (real-time analysis) watches for conditions and raises alerts. And monitoring collects performance data across regions. The trap is that routing depends on affinities: a transaction that leaves state in one region, such as a temporary storage queue, must return to that region, which defeats balancing until the affinity is removed.
