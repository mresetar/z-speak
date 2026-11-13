---
title: "Copybook"
params:
  expansion: "COPY member"
  short: "A shared source fragment — usually a record layout — included at compile time. The mainframe's schema."
  ref: { title: "IBM Docs: The COBOL copybook", url: "https://www.ibm.com/docs/en/odm/8.0.1?topic=generation-cobol-copybook" }
  aka: ["copy book", "COPY statement", "include member"]
  related: ["COBOL", "PDS", "z/OS Connect", "Packed Decimal", "DCLGEN", "File Manager", "IMS Catalog", "Easytrieve", "Natural"]
  links:
    - title: "IBM Docs: Enterprise COBOL: COPY statement"
      url: "https://www.ibm.com/docs/en/cobol-zos/6.5.0?topic=statements-copy-statement"
categories: ["Development"]
tags: ["development", "data"]
---

`COPY CUSTREC.` pulls in a member from a library, so every program that touches the customer record agrees on its layout. That layout — field names, `PIC` clauses, `OCCURS`, `REDEFINES` — is often the only formal description of the data that exists.

This makes copybooks disproportionately valuable to anything integrating with the platform. z/OS Connect, data replication tools, ETL products and API mapping all start by parsing a copybook. It also makes changing one a serious matter: everything that copies it must be recompiled, and a `REDEFINES` can hide a variant record structure that no schema captures.

The `COPY` statement finds its member through the `SYSLIB` DD of the compile step, searching the concatenated libraries in order, so which version a program gets depends on the build JCL as much as on the source. `COPY ... REPLACING` substitutes text as the member is copied, commonly to give each use of a layout its own field prefix. Other languages have the same idea under other names: `%INCLUDE` in PL/I, `COPY` and macros in assembler, and `EXEC SQL INCLUDE` for Db2 declarations.

Reading a layout takes care because the bytes depend on the `USAGE`. A `PIC S9(7)V99 COMP-3` field occupies five bytes of packed decimal, `COMP` is binary, and plain `DISPLAY` numbers are zoned decimal with the sign in the last byte. A file described by a copybook therefore cannot be transferred as text: translating EBCDIC to ASCII across the whole record corrupts the binary and packed fields. Tools that convert such files need the copybook to know which bytes to leave alone.
