---
title: "PSB"
params:
  expansion: "Program Specification Block"
  short: "The IMS definition of what one program may access: which databases, which segments, and with what processing options."
  ref: { title: "IBM Docs: IMS — PCBs and PSB", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=program-pcbs-psb" }
  aka: ["DBD", "Database Description", "PCB", "PSBGEN", "DBDGEN", "ACBGEN", "PROCOPT", "ACBLIB"]
  related: ["IMS", "HLASM", "COBOL", "SYSGEN", "Db2 for z/OS", "DL/I", "Segment", "HDAM and HIDAM", "IMS Status Code", "IMS Secondary Index"]
  links:
    - title: "IBM Docs: IMS 15.5: Program Specification Block (PSB) Generation utility"
      url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=utilities-program-specification-block-psb-generation-utility"
categories: ["Middleware"]
tags: ["ims", "database", "configuration"]
---

IMS separates the description of a database from the description of a program's view of it. A **DBD** (Database Description) defines the physical database: its segments, their hierarchy and fields, and the access method. A **PSB** belongs to a program and is a list of **PCBs** (program communication blocks): each database PCB names a DBD, the segments the program is *sensitive* to, and a `PROCOPT` saying whether it may read, insert, replace or delete. Other PCBs represent message queues.

The program receives the PCBs as parameters at entry and passes one on every DL/I call, which is how IMS knows which view applies and where to return status codes. A program cannot touch a segment its PSB does not mention — the PSB is both a schema and an authorisation.

Traditionally both are coded as assembler macros and processed by **DBDGEN** and **PSBGEN**, then merged by **ACBGEN** into the control blocks IMS loads. Newer IMS releases can hold the same definitions in the IMS catalog and accept them as DDL. Either way, changing a database means coordinating its DBD, every affected PSB and the ACBs.
