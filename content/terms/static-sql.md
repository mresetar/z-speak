---
title: "Static and Dynamic SQL"
params:
  expansion: "Static SQL and dynamic SQL in Db2 for z/OS"
  short: "Static SQL is fixed in the program and optimised once at bind; dynamic SQL arrives as text at run time and is optimised then."
  ref: { title: "IBM Docs: Db2 13 — Differences between static and dynamic SQL", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=program-differences-between-static-dynamic-sql" }
  aka: ["dynamic SQL", "embedded SQL", "PREPARE", "EXECUTE IMMEDIATE", "dynamic statement cache", "parameter marker", "host variable", "cursor", "REOPT"]
  related: ["Plan and Package", "EXPLAIN", "Db2 for z/OS", "DDF", "SQLCODE", "COBOL", "Stored Procedure", "RUNSTATS", "DCLGEN", "SQL"]
categories: ["Middleware"]
tags: ["db2", "sql", "development"]
---

In a COBOL program, an SQL statement written between `EXEC SQL` and `END-EXEC` is **static**: its text is known when the program is built. The precompiler or coprocessor extracts it, and the **bind** step checks it, verifies authorisation, chooses the access path and stores the result in a package. At run time Db2 just executes the stored plan, substituting the current values of the program's **host variables**.

**Dynamic** SQL is text that Db2 first sees while the program runs — built in a string and passed to `PREPARE`, or sent by a JDBC or ODBC client over DDF. Db2 must parse, authorise and optimise it on the spot. To avoid repeating that work it keeps a **dynamic statement cache**, keyed on the exact text; which is why dynamic applications should use **parameter markers** (`?`) rather than building literal values into the string. Literals make every statement unique, defeat the cache, and invite SQL injection.

The differences are practical. *Performance:* static avoids the prepare; dynamic can adapt its access path to the actual values. *Stability:* a static access path changes only at rebind, a dynamic one whenever statistics change or the cache is flushed. *Security:* with static SQL users need only permission to execute the package, not access to the tables; with dynamic SQL the authorisation ID normally needs privileges on the tables themselves. *Accounting:* static SQL is identified by package, which makes it easy to trace back to a program.

Neither is better in general. Mainframe transaction programs are overwhelmingly static; anything written in Java, Python or a reporting tool is dynamic unless special steps are taken.
