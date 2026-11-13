---
title: "DCLGEN"
params:
  expansion: "Declarations Generator"
  short: "The Db2 utility that reads a table's definition from the catalog and generates the matching host-language record layout."
  ref: { title: "IBM Docs: DCLGEN (declarations generator)", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=definitions-dclgen-declarations-generator" }
  aka: ["declarations generator", "EXEC SQL INCLUDE", "host structure", "DECLARE TABLE"]
  related: ["Db2 for z/OS", "Copybook", "COBOL", "PL/I", "SPUFI", "Packed Decimal", "Plan and Package", "SQLCODE", "Static and Dynamic SQL", "SQL"]
  links:
    - title: "IBM Docs: Db2 13: DCLGEN (DSN subcommand)"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=commands-dclgen-dsn"
categories: ["Development"]
tags: ["db2", "sql", "development"]
---

A program that fetches a row needs host variables whose types match the columns exactly: a `DECIMAL(9,2)` wants a packed field of the right precision, a `VARCHAR` a length-prefixed structure. Typing those by hand invites mistakes. DCLGEN — option 2 of the DB2I panels, or a `DSN` subcommand in batch — generates them from the catalog for a named table or view.

Its output is a library member with two parts: an SQL `DECLARE TABLE` statement, which lets the precompiler check your SQL against the table without connecting to Db2, and a **host structure** in COBOL, PL/I or C with one field per column. Options add a prefix to field names and generate indicator variables for nullable columns.

The member is brought into the program with `EXEC SQL INCLUDE member END-EXEC`. With the separate precompiler a COBOL `COPY` is processed too late for the SQL to see it — a distinction that puzzles newcomers. And a DCLGEN is a snapshot: when a column is added or altered, regenerate it and recompile the programs that use it.
