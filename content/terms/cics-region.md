---
title: "CICS Region"
params:
  expansion: "CICS region (one CICS address space) and region roles"
  short: "One running copy of CICS in its own address space; production systems run many, each with a role such as terminal, application or file owning."
  ref: { title: "IBM Docs: Identifying your CICS systems and regions", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=cicsplexes-identifying-your-cics-systems-regions" }
  aka: ["CICS address space", "terminal-owning region", "application-owning region", "file-owning region", "DOR", "QOR", "DFHSIP", "APPLID", "SYSID", "CICS startup"]
  related: ["CICS", "MRO", "CICSPlex SM", "SIT", "CSD", "Started Task", "CICS Transaction", "Address Space", "RLS"]
categories: ["Middleware"]
tags: ["cics", "transactions", "operations"]
---

A **CICS region** is a single z/OS address space running the CICS program `DFHSIP`. Inside it CICS acts as a small operating system of its own, dispatching thousands of short tasks, managing its own storage and owning files, queues and connections. To z/OS it is one started task or long-running job, with an **APPLID** by which the network knows it and a four-character **SYSID** by which other regions do.

A serious installation never runs just one. Work is split across regions by role. A **TOR** (terminal-owning region) holds the network sessions and routes each incoming transaction. **AORs** (application-owning regions) run the programs; there are usually several clones so that work can be balanced and one can be taken down. A **FOR** (file-owning region) owns VSAM files that must have a single owner, and some sites add regions for queues, for Db2-heavy work, or for web and Liberty workloads. The regions talk to each other over **MRO** or IPIC links, and CICSPlex SM manages them as a group.

The reasons are isolation and capacity. A storage violation or a runaway transaction damages one region, not the whole service; a region is limited by its own virtual storage and, historically, by a single main task; and maintenance can be rolled through clones without an outage.

A region is defined by its startup JCL, its **system initialization** parameters and the resource definitions it installs from the CSD. It starts **cold** (ignoring previous state), **warm** or as an **emergency restart** that backs out work interrupted by a failure — choosing cold by reflex after a crash discards that recovery information.
