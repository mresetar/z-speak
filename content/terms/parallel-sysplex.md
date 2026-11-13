---
title: "Parallel Sysplex"
params:
  expansion: "Parallel SYStems comPLEX"
  short: "A cluster of z/OS systems that share data and act as one, with no single point of failure."
  aka: ["sysplex", "plex"]
  related: ["Coupling Facility", "XCF", "System Logger", "LPAR", "GDPS", "Coupling Links", "STP", "CFRM", "CF Structure", "Data Sharing", "VIPA"]
  ref: { title: "IBM Docs: z/OS Basic Skills — Clustering on the mainframe: Parallel Sysplex", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=concepts-clustering-mainframe-parallel-sysplex-other-techniques" }
  links:
    - title: "Wikipedia: IBM Parallel Sysplex"
      url: "https://en.wikipedia.org/wiki/IBM_Parallel_Sysplex"
categories: ["Hardware"]
tags: ["availability", "clustering"]
---

Up to 32 z/OS images cooperate through a **Coupling Facility**, sharing locks, caches and lists at hardware speed. Unlike most clusters, all members can read *and write* the same data concurrently — Db2 data sharing and CICSPlex both rely on it.

The practical payoff is planned-outage-free maintenance: drain one member, upgrade it, bring it back, move on. Applications keep running. This is the mechanism behind mainframe availability claims measured in decades of uptime.

"Sysplex" alone can mean a *base* sysplex (systems joined by XCF only, no CF); "Parallel Sysplex" always implies a Coupling Facility.

Several components make this work together. **XCF** provides membership and messaging between systems. The **couple data sets** hold the shared state and policies. **GRS** extends serialisation across systems so that an enqueue means the same thing everywhere. A common time source (**STP**) keeps timestamps consistent, and **WLM** decides where incoming work should go. Systems that stop responding are removed automatically by the **sysplex failure management** policy so that the rest can continue.

The hardware alone does not deliver availability. Applications have to be able to run on more than one system — which means removing dependencies on a particular system name, a local file, or in-memory state — and the subsystems must be set up for **data sharing**. Many sites own a Parallel Sysplex and still have applications tied to one member. A **GDPS** configuration extends the idea across sites; the sysplex itself is normally confined to distances the coupling links allow, in the tens of kilometres.
