---
title: "CSD"
params:
  expansion: "CICS System Definition data set"
  short: "The VSAM file that holds a CICS region's resource definitions — programs, transactions, files, TCP/IP services — grouped and installed at startup."
  ref: { title: "IBM Docs: How you can define CICS resources", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=resources-how-you-can-define-cics" }
  aka: ["RDO", "resource definition online", "CEDA", "DFHCSDUP", "GRPLIST"]
  related: ["CICS", "SIT", "CEMT", "VSAM", "CICSPlex SM", "CMCI", "CICS Transaction", "CICS Region", "CICS Explorer", "CICS Bundle"]
  links:
    - title: "IBM Docs: The CICS system definition data set (CSD)"
      url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=resources-cics-system-definition-data-set-csd"
categories: ["Middleware"]
tags: ["cics", "configuration"]
---

A CICS region runs nothing it does not know about. Before transaction `PAY1` can run, the region needs a **TRANSACTION** definition that names program `PAYPGM`, and a **PROGRAM** definition that says what language it is in. A VSAM file needs a **FILE** definition, and a web port needs a **TCPIPSERVICE**. Those definitions live in the CSD, a VSAM KSDS, sorted into named **groups**. Groups are bundled into **lists**, and the `GRPLIST` SIT parameter says which lists to install when the region starts from cold.

There are three ways to change the CSD. **CEDA** (online, from a CICS terminal — this is what "RDO", resource definition online, means). **DFHCSDUP** (a batch utility, which is how the CSD is initialized and how most shops script their definitions). Or CMCI and CICSPlex SM, which the Zowe CICS extension and pipelines use. Setting up a new region usually means a DFHCSDUP job that runs `INITIALIZE` and then adds the IBM-supplied groups.

What newcomers get wrong is **define versus install**. `CEDA DEFINE` only writes a record to the CSD. The region does not see the change until `CEDA INSTALL` copies the definition into the running region and its catalog. `CEMT SET` goes the other way: it changes the installed copy and leaves the CSD alone. When "it worked yesterday" after a restart, that is almost always where the drift came from. One CSD can be shared by many regions, so a careless `DEFINE` can also reach more regions than you meant.
