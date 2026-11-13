---
title: "DDF"
params:
  expansion: "Distributed Data Facility"
  short: "Db2's built-in server for SQL from outside the mainframe — DRDA, JDBC, ODBC and REST all enter through it."
  ref: { title: "IBM Docs: Db2 13 — Distributed data facility", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=architecture-distributed-data-facility" }
  aka: ["distributed data facility", "DRDA"]
  related: ["Db2 for z/OS", "z/OS Connect", "zIIP", "WLM", "Db2 Analytics Accelerator", "Stored Procedure", "Data Sharing", "Enclave", "DSNZPARM", "Static and Dynamic SQL"]
  links:
    - title: "IBM Docs: Db2 13: Db2 address spaces in the z/OS environment"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=architecture-db2-address-spaces-in-zos-environment"
categories: ["Middleware"]
tags: ["db2", "sql", "integration"]
---

A Db2 for z/OS subsystem can serve SQL to clients that are not on the mainframe at all — JDBC from Java, ODBC from Windows, DRDA requesters from other Db2s, REST via z/OS Connect. **DDF** is the Db2 component that makes that work: an address space (or two, `DIST`-flavoured) inside the Db2 subsystem that listens on TCP/IP ports, authenticates remote users, and turns their SQL into Db2 threads.

DDF is where mainframe meets "distributed" architecture, and where several load-bearing concepts live: **locations** and DRDA mapping, two-phase commit across systems (the `in-doubt` transactions operators dread), connection concentration, and **sysplex-wide** DDF with DVIPA for high availability.

It is also one of the original zIIP-eligible workloads: distributed queries largely run on zIIPs, which is why "expose the database over REST" conversations in cost-conscious shops turn into "so the traffic goes through DDF" — the modernisation path is priced better than the CICS path.
