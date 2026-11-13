---
title: "SQL"
params:
  expansion: "Structured Query Language"
  short: "The standard language for relational databases, invented at IBM; on the mainframe it means Db2, whether embedded in COBOL or sent from Java."
  ref: { title: "Wikipedia: SQL", url: "https://en.wikipedia.org/wiki/SQL" }
  aka: ["Structured Query Language", "SEQUEL", "DML", "DDL", "DCL", "SELECT", "EXEC SQL", "System R", "ISO SQL"]
  related: ["Db2 for z/OS", "Static and Dynamic SQL", "SQLCODE", "SPUFI", "QMF", "EXPLAIN", "Stored Procedure", "DCLGEN", "COBOL", "Db2 Index"]
categories: ["Development"]
tags: ["language", "sql", "database"]
---

**SQL** came out of IBM research: the System R project in San Jose in the 1970s, where it was first called SEQUEL, implementing Edgar Codd's relational model. Its first IBM products were SQL/DS and then DB2 for MVS in 1983. The pronunciation "sequel" is a leftover from the original name.

The language is declarative. A statement describes the rows wanted — `SELECT NAME, BALANCE FROM ACCOUNT WHERE BRANCH = 'ZG01'` — and the database decides how to find them. It is usually divided into **DML** (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`), **DDL** for defining objects (`CREATE TABLE`, `ALTER`, `DROP`) and **DCL** for permissions (`GRANT`, `REVOKE`).

On z/OS it reaches Db2 by several routes. **Embedded SQL** is written inside a COBOL, PL/I, C or assembler program between `EXEC SQL` and `END-EXEC`, with results delivered into **host variables**; a multi-row result is read through a **cursor**, declared, opened and fetched row by row. Interactive tools — **SPUFI** under ISPF, QMF, and the Db2 extension for VS Code — run statements directly. Java, Python and other clients send SQL over JDBC or ODBC through the distributed data facility. And **SQL PL** is a procedural dialect for writing stored procedures and functions in SQL itself.

Db2 for z/OS follows the ISO standard closely but has its own extensions, and it is not identical to Db2 on Linux or to Oracle or PostgreSQL: functions, the handling of dates, and details of DDL differ, so SQL copied from another platform often needs adjusting.

The beginner's mistake is treating SQL like a file-reading loop — fetching every row and filtering in the program. Letting the database select, join and aggregate is almost always faster. IMS data can also be queried with SQL through its Java drivers.
