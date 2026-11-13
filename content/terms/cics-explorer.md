---
title: "CICS Explorer"
params:
  expansion: "IBM CICS Explorer (Eclipse-based CICS tool)"
  short: "The free Eclipse-based workstation tool for viewing and operating CICS regions and their resources, in place of 3270 panels."
  ref: { title: "IBM Docs: CICS Explorer overview", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=fundamentals-cics-explorer-overview" }
  aka: ["CICS Explorer SDK", "CICS SM perspective", "Eclipse CICS tooling", "IBM Explorer for z/OS", "z/OS Explorer", "Aqua"]
  related: ["CICS", "CMCI", "CICSPlex SM", "CEMT", "CICS Bundle", "IDz", "CSD", "CICS Region", "Zowe Explorer"]
categories: ["Middleware"]
tags: ["cics", "tooling", "operations"]
---

**CICS Explorer** gives CICS a graphical front end. It connects to a region or a CICSplex and shows resources — regions, programs, transactions, files, queues, connections, tasks — in sortable, filterable tables, with the same attributes you would see with `CEMT INQUIRE` and the same actions: enable, disable, new copy, purge a task, open or close a file. The difference is breadth: one view can list a resource across every region in the plex, which on a green screen means many separate commands or the CICSPlex SM panels.

It is built on **IBM Explorer for z/OS**, an Eclipse platform that also provides views of data sets, z/OS UNIX files and job output, and it accepts plug-ins from other CICS tools — the performance analyser, the configuration manager, the deployment assistant — so they share a single workbench.

It is a client only. All requests go to the host through the **CMCI** interface, so that must be set up, and what a user can see and do is governed by their own user ID and the usual CICS security: the tool grants nothing by itself. Definitions can be created and edited too, in the CSD or the CICSPlex SM repository.

For developers the **CICS Explorer SDK** adds what is needed to build Java programs for CICS and package applications as **bundles**, then deploy them straight to a region. The server-side counterpart to all this in newer releases is the CMCI JVM server, which adds faster aggregated queries.

Many sites give Explorer to operators and developers and keep the 3270 transactions as the fallback that always works.
