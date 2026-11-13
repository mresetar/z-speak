---
title: "GRS"
params:
  expansion: "Global Resource Serialization"
  short: "The lock manager for z/OS: who currently holds a data set or a named resource, across the whole sysplex."
  ref: { title: "IBM Docs: z/OS Basic Skills — Serializing the use of resources (GRS)", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=system-serializing-use-resources" }
  aka: ["ENQ", "enqueue"]
  related: ["Parallel Sysplex", "Data Set", "XCF", "Coupling Facility", "Dynamic Allocation"]
  links:
    - title: "Wikipedia: Global Resource Serialization"
      url: "https://en.wikipedia.org/wiki/Global_Resource_Serialization"
categories: ["System Services"]
tags: ["internals", "clustering"]
---

Programs request a resource with an **ENQ** — a major name (QNAME) and minor name (RNAME), exclusive or shared — and release it with a DEQ. `DISP=OLD` in JCL is an ENQ; so is opening a PDS member for edit.

GRS runs either as a **ring** (systems pass a token) or, far more commonly now, in **star** mode using a Coupling Facility lock structure, which scales much better.

The operational face of GRS is contention. When a batch job hangs, the answer is usually that something else holds the ENQ: `D GRS,C` shows the waiters and the holder, and the holder is often a forgotten TSO user sitting in edit on a production data set.

Each request has a **scope**. `STEP` limits it to the address space, `SYSTEM` to one z/OS image, and `SYSTEMS` extends it across the sysplex. GRS **resource name lists** (RNLs) in the `GRSRNLxx` member can change the scope of a request without changing the program: one list promotes system-level requests to the sysplex, another keeps named resources local, and a third converts hardware **RESERVE**s — which lock a whole disk volume — into global ENQs, which lock only the resource.

Some names are worth recognising in a contention display. `SYSDSN` is the major name for data set allocation, `SPFEDIT` for ISPF edit of a member, `SYSIEFSD` for allocation internals, and `SYSZ…` names belong to the system. Besides `D GRS,C`, the `D GRS,ANALYZE` command finds the longest waiters and the address space at the head of a chain of blockers. A **latch** is a lighter-weight lock used inside components and reported separately. Products that serialise on their own, such as Db2 through IRLM, do not appear in GRS displays at all.
