---
title: "Stored Procedure"
params:
  expansion: "Db2 stored procedure"
  short: "A program kept at the database server and run with an SQL CALL, so that logic executes next to the data."
  ref: { title: "IBM Docs: Db2 13 — Implementing Db2 stored procedures", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=design-implementing-stored-procedures" }
  aka: ["SQL PL", "native SQL procedure", "external procedure", "CALL", "WLM application environment", "SPAS"]
  related: ["Db2 for z/OS", "DDF", "WLM", "RRS", "Plan and Package", "zIIP", "Db2 Developer Extension", "COBOL", "Enclave", "SQLCODE", "SQL"]
  links:
    - title: "Wikipedia: Stored procedure"
      url: "https://en.wikipedia.org/wiki/Stored_procedure"
categories: ["Middleware"]
tags: ["db2", "sql", "development"]
---

A distributed application that issues twenty SQL statements pays twenty network round trips. Put those statements in a stored procedure and the client sends one `CALL`; the work happens inside the server and only the result returns. Procedures also give many applications one shared, controlled implementation of a piece of business logic.

On Db2 for z/OS there are two kinds, and the difference is operational. An **external** procedure is a load module written in COBOL, PL/I, C, Java or REXX. It runs in a separate stored-procedure address space that **WLM** starts on demand for a named *application environment*, and it needs **RRS** to coordinate its updates. A **native SQL** procedure is written entirely in SQL PL and runs inside the Db2 engine itself — no extra address space, and when called remotely through DDF much of its processing is eligible for zIIP.

Either kind is created with `CREATE PROCEDURE` and can return result sets to its caller.

The recurring operational problem concerns external procedures. After repeated abends, WLM stops the application environment, and every later call fails until someone resumes it — to the application this looks like a database error, but the fix is an operator command.
