---
title: "IMS Catalog"
params:
  expansion: "IMS catalog and IMS-managed ACBs"
  short: "An IMS database that holds the definitions of all the other databases and program views, readable by tools and applications."
  ref: { title: "IBM Docs: IMS 15.5 — Overview of the IMS catalog", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=catalog-overview-ims" }
  aka: ["DFSCD000", "catalog database", "IMS-managed ACBs", "IMS DDL", "IMS Explorer", "IMS Universal drivers"]
  related: ["IMS", "PSB", "Segment", "DL/I", "IMS Region", "Copybook", "Java on z/OS", "IMS Connect", "z/OS Connect"]
categories: ["Middleware"]
tags: ["ims", "database", "modernization"]
---

For decades the definition of an IMS database lived in assembler macro source and in libraries generated from it: `DBDGEN` produced a database description, `PSBGEN` a program's view, and `ACBGEN` merged the two into **ACB** members that the online system loads. Nothing in a running IMS could tell you, in a usable form, what segments and fields a database had — and the field definitions in a DBD usually covered only keys and search fields, with the full record layout held separately in COBOL copybooks.

The **IMS catalog** fixes that. It is itself an IMS database (`DFSCD000`) containing the metadata for every DBD and PSB: segments, fields with data types, relationships, and optional application-level details such as field mappings for variant record layouts. It is populated from the ACB library by a utility, and it keeps timestamps so that several versions of a definition can coexist.

It has two main uses. Java and distributed programs that access IMS through the **Universal drivers** read the catalog to learn the structure, so they can issue SQL or DL/I without a locally generated metadata class; this is what makes IMS data usable from JDBC tools. And with **IMS-managed ACBs**, the catalog becomes the system of record: IMS loads its control blocks from the catalog directory rather than from ACB libraries, and definitions can be created and changed with **DDL** statements — `CREATE DATABASE`, `ALTER` — activated by a command, without the generation jobs.

Sites adopted it in stages, running the catalog alongside the traditional libraries first. That choice has now been made for them: **IMS 15.6**, available since June 2025, is the first release that requires IMS-managed ACBs, so moving off ACB libraries is part of migrating to it.
