---
title: "SPUFI"
params:
  expansion: "SQL Processor Using File Input"
  short: "The ISPF panel that runs SQL statements from a data set against Db2 and writes the results to another data set."
  ref: { title: "Wikipedia: IBM SPUFI", url: "https://en.wikipedia.org/wiki/IBM_SPUFI" }
  aka: ["DB2I", "DSNTEP2", "DSNTEP4", "DSNTIAD"]
  related: ["Db2 for z/OS", "QMF", "ISPF", "DCLGEN", "Db2 Developer Extension", "Data Set", "SQLCODE", "SQL"]
  links:
    - title: "IBM Docs: Db2 13 — Changing SPUFI defaults"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=spufi-changing-defaults"
categories: ["Middleware"]
tags: ["db2", "sql", "tooling"]
---

SPUFI — pronounced "spoofy" — is option 1 of **DB2I**, the Db2 Interactive panels under ISPF. You name an input data set or member containing SQL statements separated by semicolons, and an output data set. SPUFI lets you edit the input, executes it, and drops you into browse on the output: each statement echoed, followed by its result rows and SQLCODE.

It comes with Db2 at no charge, which makes it the universal way to try a statement, look at a table, or run a few lines of DDL. The panel defaults matter: autocommit is on unless you change it, and the output record length and maximum rows silently truncate wide or long results.

For the same job in batch, use the sample programs **DSNTEP2** or DSNTEP4, which read SQL from `SYSIN` and print to `SYSPRINT`, or DSNTIAD for statements that return no rows. Graphical clients such as the Db2 Developer Extension are the modern alternative, but on any Db2 for z/OS system SPUFI is the tool certain to be there.
