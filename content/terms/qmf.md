---
title: "QMF"
params:
  expansion: "Query Management Facility"
  short: "IBM's query and reporting tool for Db2 — run SQL, shape the result with a form, and save both for reuse."
  ref: { title: "Wikipedia: IBM Query Management Facility", url: "https://en.wikipedia.org/wiki/IBM_Query_Management_Facility" }
  aka: ["Db2 QMF", "QMF for TSO and CICS", "QMF form", "QMF proc"]
  related: ["Db2 for z/OS", "SPUFI", "TSO/E", "ISPF", "CICS", "SQL"]
  links:
    - title: "IBM Docs: Using the Query Management Facility (QMF)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=products-using-query-management-facility-qmf"
categories: ["Middleware"]
tags: ["db2", "sql", "tooling"]
---

QMF grew up as the tool that let analysts get at Db2 data without a programmer. A user writes a **query**, runs it, and then adjusts a **form** that controls how the result is presented: column headings, edit codes, break levels, subtotals. Queries, forms and **procedures** that chain them are stored in the database under the user's name and can be shared, scheduled in batch, or run with substitution variables.

Compared with **SPUFI**, which just executes SQL and shows raw output, QMF is a reporting tool. Many shops built a large library of QMF reports that the business still relies on.

It is a separately licensed product with a workstation and web version alongside the classic 3270 one. Because it lets end users run arbitrary SQL against production, it comes with a **governor** that limits how many rows and how much processor time a query may consume — a setting DBAs care about deeply.
