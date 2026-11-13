---
title: "Datacom"
params:
  expansion: "Datacom/DB"
  short: "Broadcom's high-volume mainframe database, originally an inverted-file system and now relational with SQL."
  ref: { title: "Wikipedia: DATACOM/DB", url: "https://en.wikipedia.org/wiki/DATACOM/DB" }
  aka: ["CA Datacom", "Datacom/DB", "MUF", "Multi-User Facility", "Ideal"]
  related: ["IDMS", "Adabas", "Db2 for z/OS", "CICS", "COBOL", "Natural"]
categories: ["Middleware"]
tags: ["database", "sql", "legacy"]
---

Datacom/DB is one of the three long-lived non-IBM mainframe databases, with IDMS and Adabas. It began in the early 1970s as an inverted-file system built for fast keyed retrieval, was developed by Applied Data Research, and reached Broadcom by way of Computer Associates. Over time it gained a relational engine and full SQL, so a single database can be reached both through the original record-at-a-time calls and through SQL.

The server is the **Multi-User Facility** (MUF), an address space that owns the data and serves CICS regions and batch jobs. Its 4GL is **Ideal**, and its data dictionary, Datadictionary, was influential in its day.

You are most likely to meet it at long-established sites and inside Broadcom's own products, several of which use an embedded Datacom as their repository. So a systems programmer may be running a MUF without the company ever having chosen Datacom as a database.
