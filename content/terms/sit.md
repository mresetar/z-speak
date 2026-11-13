---
title: "SIT"
params:
  expansion: "System Initialization Table"
  short: "The startup parameters of a CICS region — its APPLID, which resource lists to install, security, and how to restart."
  ref: { title: "IBM Docs: Specifying CICS system initialization parameters", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=region-specifying-cics-system-initialization-parameters" }
  aka: ["SIT parameters", "SIT overrides", "DFHSIT", "system initialization parameters"]
  related: ["CICS", "CSD", "CEMT", "Started Task", "VTAM", "RACF", "DSNZPARM", "CICS Region"]
  links:
    - title: "IBM Docs: System initialization parameters to set up a CICS region"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=parameters-system-initialization-set-up-cics-region"
categories: ["Middleware"]
tags: ["cics", "configuration"]
---

Everything a CICS region needs to know before it can read its CSD comes from the SIT. That covers `APPLID=` (its VTAM name, which users type after `LOGON APPLID=`), `GRPLIST=` (which resource lists to install), `SEC=YES` and `DFLTUSER=` (security on, and who you are before you sign on), `TCPIP=YES`, the data set names of the catalogs and the CSD, and `START=`.

Originally the SIT was an assembled table, a `DFHSIT` macro turned into a load module. Nowadays sites keep the supplied default table and supply **overrides**, applied in order: the `PARM=` on the region's `EXEC` statement, then the region's **SYSIN** data set, then the console, if you ask for it. The zXplore regions work exactly this way: a SYSIN member carries the overrides, and the region's attributes view in the Zowe CICS extension shows the values in effect.

The parameter to understand is `START=`. With `START=AUTO`, CICS reads its global catalog to decide. After a clean shutdown it does a **warm** start and restores what was installed. After a crash it does an **emergency** start and backs out in-flight units of work. `START=INITIAL` (or `COLD`) throws that state away and rebuilds from the CSD. Most SIT values are read once at startup, so changing them means a restart. A handful can be changed live through `CEMT SET SYSTEM`.
