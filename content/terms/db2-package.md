---
title: "Plan and Package"
params:
  expansion: "Db2 application plans and packages"
  short: "The bound form of a program's SQL — the access paths Db2 chose in advance — which the program needs before it can run."
  ref: { title: "IBM Docs: Db2 13 — Packages and application plans", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=concepts-packages-application-plans" }
  aka: ["BIND", "REBIND", "DBRM", "collection", "PKLIST", "-805", "-818", "static SQL"]
  related: ["Db2 for z/OS", "DCLGEN", "SPUFI", "COBOL", "Load Module", "Stored Procedure", "Dependency Based Build", "SQLCODE", "EXPLAIN", "RUNSTATS"]
  links:
    - title: "IBM Docs: Db2 13: Binding application packages and plans"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=db2forzos-binding-application-packages-plans"
categories: ["Middleware"]
tags: ["db2", "sql", "development"]
---

Embedded SQL is not interpreted when the program runs. At build time the precompiler, or the compiler's SQL coprocessor, takes the SQL statements out of the source and writes them to a **DBRM**. `BIND PACKAGE` then gives the DBRM to Db2, which checks authorisation, lets the optimizer choose an access path for each statement, and stores the result as a **package** in a named **collection**. A **plan** is little more than a list of collections that an application runs under.

So a Db2 program is two artefacts that must match: the load module and its package. Both carry the same consistency token from the precompile. Running a newly compiled program against an old package produces SQLCODE `-818`; if no matching package can be found, `-805`. Either one means a bind step was skipped or sent to the wrong collection or subsystem.

Because access paths are frozen at bind time, performance is predictable — and does not improve by itself when data volumes change or an index is added. `REBIND` makes Db2 choose again. Since that can also make things worse, Db2 can keep the previous copies of a package so that a bad rebind can be switched back.
