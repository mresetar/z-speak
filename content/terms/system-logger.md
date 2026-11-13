---
title: "System Logger"
params:
  expansion: "z/OS System Logger (IXGLOGR)"
  short: "The z/OS service that writes high-volume, crash-proof log streams — the substrate under CICS, IMS, Db2 and SMF logging."
  ref: { title: "IBM Docs: Overview of system logger services", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=services-overview-system-logger" }
  aka: ["log stream", "IXGLOGR", "SMF log stream"]
  related: ["SMF", "Parallel Sysplex", "Coupling Facility", "CICS", "IMS", "RRS", "LOGREC", "CF Structure", "SYSLOG", "Db2 Log"]
  links:
    - title: "IBM Docs: What is system logger?"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=services-what-is-system-logger"
categories: ["System Services"]
tags: ["observability", "availability", "sysprog"]
---

Applications that need a reliable, ordered, survivable log used to hand-roll their own: a VSAM file, a GDG of sequential data sets, careful restart logic. The **system logger** replaces all of that with one service: write to a named **log stream**, and z/OS handles ordering, retention, block management and recovery. CICS journals, IMS logs, Db2 `RESUME`-style recovery data and SMF records all ride on it, and every shop has at least one automation or audit product reading from one.

Two shapes of log stream exist. A **CF log stream** stages its data in a list structure in a **Coupling Facility**, so log records survive even the loss of the writing system — the choice for sysplex-wide, must-not-lose data. A **DASD-only log stream** stages in local storage and offloads to data sets; cheaper, but tied to one system. The same application code writes to either; the connectivity in the CFRM policy (coupling facility resource management, defined via the `CFRM` couple data set) decides.

The logger runs as the `IXGLOGR` address space on each system, and its data lives in **logger data sets** (LDS) named in the `IXGPRIV` policies. What surprises newcomers: reading a log stream is cheap, but retention is a storage decision — a log stream set to "keep everything" grows until someone notices, and the standard triage for logger problems starts in `IXC353I`-style messages and the `IXG` SMF records.
