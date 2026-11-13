---
title: "IMS"
params:
  expansion: "Information Management System"
  short: "IBM's hierarchical database and transaction manager, built for Apollo and still running banks."
  aka: ["IMS DB", "IMS TM"]
  related: ["CICS", "Db2 for z/OS", "COBOL", "IMS Connect", "PSB", "DL/I", "Segment", "IMS Region", "Fast Path", "HDAM and HIDAM"]
  ref: { title: "IBM Docs: IMS", url: "https://www.ibm.com/docs/en/ims" }
  links:
    - title: "Wikipedia: IBM Information Management System"
      url: "https://en.wikipedia.org/wiki/IBM_Information_Management_System"
categories: ["Middleware"]
tags: ["database", "transactions"]
---

Two products under one name. **IMS DB** is a hierarchical database: segments in a parent-child tree, navigated with **DL/I** calls (`GU`, `GN`, `ISRT`, `REPL`) against a **PCB** described in a **PSB**. **IMS TM** is a message-driven transaction manager where programs read from a queue, process, and reply.

The hierarchy is not a limitation to apologise for: when access paths are known in advance, navigating a tree beats joining tables, and IMS still posts transaction rates that are hard to match. The cost is rigidity — the physical structure is baked into the programs.

Where Db2 asks "what do you want?", IMS asks "which path do you want to walk?".

An IMS system is a group of address spaces. The **control region** owns the databases and the message queues; **dependent regions** run the application programs — **MPP** regions for message-driven transactions, **BMP** regions for batch programs that share the online databases, **IFP** for Fast Path, **JMP** for Java. Databases are defined in a **DBD**, and each program's view of them in a **PSB**; the two are combined by a generation step into **ACBs**, which is why a database change is a managed event rather than a statement you run.

Access from outside has widened over the years. **IMS Connect** takes TCP/IP requests, **OTMA** links to MQ and other clients, the **Open Database** drivers let Java issue SQL against IMS data, and z/OS Connect exposes transactions as REST APIs. Programs call IMS through an interface named for the language — `CBLTDLI` in COBOL — and check a two-character **status code** after each call: blanks mean success, `GE` not found, `GB` end of database.
