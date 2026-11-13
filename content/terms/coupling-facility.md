---
title: "Coupling Facility"
params:
  expansion: "Coupling Facility (CF)"
  short: "Shared memory for a sysplex — holds locks, caches and queues that all members access directly."
  ref: { title: "IBM Docs: z/OS — Coupling facilities", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=planning-coupling-facilities" }
  aka: ["CF"]
  related: ["Parallel Sysplex", "XCF", "System Logger", "Specialty Engine", "Coupling Links", "STP", "CF Structure", "CFRM", "CFCC", "RLS"]
  links:
    - title: "Wikipedia: Coupling Facility"
      url: "https://en.wikipedia.org/wiki/Coupling_Facility"
categories: ["Hardware"]
tags: ["availability", "clustering"]
---

A CF is an LPAR running **CFCC**, a specialised control program, reachable over dedicated high-speed links. It stores three kinds of structure:

- **Lock** — global serialization, so two members never update the same row at once
- **Cache** — shared buffer pools with cross-invalidation
- **List** — shared queues, e.g. MQ shared queues, JES2 checkpoint

Because the CF is a single point of shared state, production sysplexes run at least two, usually on separate CPCs, with structures duplexed between them.

Access is **synchronous** for the fastest requests: the z/OS processor issues the request and spins until the CF answers, in microseconds. That is why link speed and distance matter so much, and why CF processors are normally dedicated **ICF** engines rather than shared ones — a CF that has to wait for its turn on a shared processor makes every sysplex member wait with it.

Sizing and placement are described in the **CFRM policy**: which structures exist, how large they may grow, and which CF each prefers. A structure can be moved to another CF with a **rebuild**, which is how a CF is emptied for maintenance without stopping the sysplex. The failure case to design against is losing a CF *and* a z/OS system that was using it at the same moment — **failure isolation** — which is why a CF running on the same CPC as its exploiters is treated differently from a standalone one.
