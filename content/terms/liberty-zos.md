---
title: "WebSphere Liberty for z/OS"
params:
  expansion: "IBM WebSphere Application Server Liberty"
  short: "The lightweight Java application server used for Jakarta EE, Spring and REST workloads on z/OS."
  ref: { title: "IBM Docs: WebSphere Application Server Liberty", url: "https://www.ibm.com/docs/en/was-liberty" }
  aka: ["Liberty", "WLP"]
  related: ["z/OS UNIX", "Java on z/OS", "Specialty Engine", "z/OS Connect", "Db2 for z/OS", "WebSphere Application Server for z/OS", "CICS Transaction Gateway", "CICS Bundle", "LDAP"]
  links:
    - title: "Wikipedia: IBM WebSphere Application Server"
      url: "https://en.wikipedia.org/wiki/IBM_WebSphere_Application_Server"
categories: ["Middleware"]
tags: ["java", "modernization"]
---

Liberty is the same server used off-platform, configured by a small `server.xml` with composable features. On z/OS it gains platform integration — SAF/RACF for authentication, type 2 JDBC to a local Db2, WOLA for fast calls into CICS or batch — and its Java work is largely **zIIP**-eligible, which changes the cost conversation.

It runs on the z/OS UNIX side, and it is the runtime underneath **z/OS Connect** and CICS Liberty JVM servers.

On z/OS a Liberty server can run from the shell like anywhere else, but in production it is normally a **started task**, using a supplied procedure (`BBGZSRV`) so that operators start and stop it with console commands and automation treats it like any other subsystem. An optional **angel process** — a small authorised started task — lets unauthorised Liberty servers use authorised z/OS services such as SAF, WLM classification and RRS transactions. Forgetting the angel is the usual reason those features silently fall back or fail.

Do not confuse it with traditional **WebSphere Application Server for z/OS**, the older, heavier product with its controller and servant regions. Liberty is the strategic runtime; new work goes there, and it starts in seconds rather than minutes. **Open Liberty** is the open-source core of the same code.
