---
title: "CICS"
params:
  expansion: "Customer Information Control System"
  short: "IBM's transaction server — the runtime behind a very large share of the world's online business transactions."
  aka: ["CICS TS", "CICS Transaction Server"]
  related: ["IMS", "Db2 for z/OS", "VSAM", "COBOL", "z/OS Connect", "CMCI", "CEMT", "CSD", "SIT", "EXEC CICS", "Channels and Containers", "MRO", "TSQ", "TDQ", "CICS Transaction", "BMS", "Pseudo-Conversational"]
  ref: { title: "IBM Docs: CICS Transaction Server for z/OS", url: "https://www.ibm.com/docs/en/cics-ts" }
  links:
    - title: "Wikipedia: CICS"
      url: "https://en.wikipedia.org/wiki/CICS"
categories: ["Middleware"]
tags: ["transactions"]
---

A CICS **region** is a started task hosting many short programs. A **transaction** is a four-character identifier (`MENU`, `PAY1`) that maps to a program; the program is invoked, does its work in milliseconds, and ends. State between screens is deliberately not kept in memory — it is passed in a **COMMAREA** or **channel/container**, which is what makes a region able to serve thousands of users with a modest footprint.

Programs talk to CICS through `EXEC CICS` commands for terminal I/O (**BMS** maps), file access, program linking, and — importantly — **syncpoints**, since CICS coordinates two-phase commit across VSAM, Db2, IMS and MQ.

Modern CICS is not just 3270: it serves and calls REST and SOAP, runs Java in a Liberty JVM server, and fronts existing programs through **z/OS Connect**. When someone says "we need to expose the core system as an API", CICS is usually where that lands.
