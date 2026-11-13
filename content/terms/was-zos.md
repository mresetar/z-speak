---
title: "WebSphere Application Server for z/OS"
params:
  expansion: "WebSphere Application Server for z/OS (traditional WAS)"
  short: "IBM's full Java EE application server on z/OS, built around WLM-managed controller and servant address spaces."
  ref: { title: "Wikipedia: WebSphere Application Server for z/OS", url: "https://en.wikipedia.org/wiki/WebSphere_Application_Server_for_z/OS" }
  aka: ["WAS", "tWAS", "WAS z/OS", "WOLA", "controller region", "servant region"]
  related: ["WebSphere Liberty for z/OS", "Java on z/OS", "WLM", "CICS", "zIIP", "SMF", "RRS"]
categories: ["Middleware"]
tags: ["java", "transactions", "legacy"]
---

"Traditional WAS" on z/OS runs the same applications as WebSphere on other platforms but is built differently. Each server is split into a **controller region**, which accepts requests, and one or more **servant regions**, where application code runs. The controller puts each request on a **WLM** queue and WLM decides how many servants to run and how to prioritise the work — so a web request is classified and managed like any other z/OS transaction. Global transactions are coordinated by **RRS**, and activity is recorded in SMF type 120 records.

Around the servers sit a deployment manager, node agents and a daemon, all started tasks.

**WOLA**, WebSphere Optimized Local Adapters, is its distinctive integration feature: cross-memory calls in both directions between Java code and CICS, IMS or batch programs in the same LPAR, with no network hop.

New work uses **WebSphere Liberty**, which is far lighter, and existing WAS estates are steadily migrating to it. You will still find traditional WAS cells fronting CICS and Db2 at many sites.
