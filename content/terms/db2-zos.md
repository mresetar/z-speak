---
title: "Db2 for z/OS"
params:
  expansion: "IBM Db2 for z/OS"
  short: "The relational database of the mainframe — SQL, with sysplex data sharing across members."
  aka: ["DB2", "Db2z"]
  related: ["CICS", "IMS", "DDF", "Parallel Sysplex", "COBOL", "IBM MQ", "Db2 Analytics Accelerator", "IRLM", "SPUFI", "DCLGEN", "QMF", "Plan and Package", "Buffer Pool", "Table Space", "Data Sharing", "Stored Procedure"]
  ref: { title: "IBM Docs: Db2 for z/OS", url: "https://www.ibm.com/docs/en/db2-for-zos" }
  links:
    - title: "Wikipedia: IBM Db2"
      url: "https://en.wikipedia.org/wiki/IBM_Db2"
categories: ["Middleware"]
tags: ["database", "sql"]
---

Standard SQL with a distinct operational model. Application SQL is usually **static**: embedded in COBOL or PL/I, extracted by a precompiler, bound into a **package**/**plan** at build time so the access path is fixed and predictable. **Dynamic** SQL from Java, ODBC or JDBC goes through **DDF**, the distributed data facility, which is also what makes off-platform clients possible — and largely zIIP-eligible.

In a Parallel Sysplex, **data sharing** lets several Db2 members read and write the same tables concurrently, coordinating locks and buffers through the Coupling Facility. That is the feature competitors find hardest to match.

Everyday vocabulary: **tablespace**, **bufferpool**, **RUNSTATS**, **REORG**, **BIND**, `-DIS` commands, and `SQLCODE` values (`-911` deadlock, `-904` unavailable resource, `+100` not found).

A Db2 **subsystem** is a set of address spaces with a four-character name: the system services region (`xxxxMSTR`), the database services region (`xxxxDBM1`), the distributed facility (`xxxxDIST`) and the lock manager (`xxxxIRLM`). Data is held in VSAM linear data sets; the **catalog** and **directory** describe everything; and the **log** and the **bootstrap data set** make recovery possible. A program connects through an **attachment** suited to its environment — CICS, IMS, TSO, RRS for batch and stored procedures, or DRDA from elsewhere.

Day-to-day care is done with **utilities** run as batch jobs: `COPY` for backups, `RUNSTATS` to refresh the statistics the optimiser relies on, `REORG` to restore physical order, `LOAD` and `UNLOAD`, and `RECOVER`. Because static SQL is bound in advance, changing an index or refreshing statistics has no effect on a program until its package is **rebound** — and a rebind can make an access path worse as well as better, which is why sites keep the previous copy to fall back on. The command prefix, often a hyphen, is set per subsystem.
