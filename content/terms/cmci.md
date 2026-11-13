---
title: "CMCI"
params:
  expansion: "CICS Management Client Interface"
  short: "A REST API for CICS resources, so scripts and tools can create, query or change them without 3270 or CICSPlex SM screens."
  ref: { title: "IBM Docs: CICS Management Client Interface", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=interfaces-cics-management-client-interface-cmci" }
  aka: ["CMCI REST API", "CMCI JVM server"]
  related: ["CICS", "CICSPlex SM", "Wazi Deploy", "CICS Explorer", "CICS Bundle"]
  links:
    - title: "IBM Docs: How it works: CMCI REST API"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=cmci-how-it-works-rest-api"
categories: ["Middleware"]
tags: ["automation", "operations"]
---

CMCI exposes the same resource model CICSPlex SM and single CICS regions manage — programs, transactions, files, connections — as HTTP requests instead of a 3270 panel: `GET`/`PUT`/`POST`/`DELETE` against a resource URL, with the data as XML or JSON.

That makes it the piece automation reaches for whenever a pipeline needs to touch a running CICS region, rather than just deploy load modules to a library. Wazi Deploy's CICS building blocks (`cics_cmci_prog_create`, `_update`, `_delete`) are exactly this: a deployment step that calls CMCI to install or refresh a program definition, authenticating with a host, port and credentials rather than a terminal session.

There are two ways to provide it. In a **CICSPlex SM** environment the WUI server hosts the interface and a request can address any region in the CICSplex. A single region without CPSM can run the **single-region CMCI** itself. Newer CICS releases add a **CMCI JVM server**, a Liberty instance inside the region that also supports the GraphQL API and the aggregation views used by current CICS Explorer. Which variant is set up decides what clients can see.

The URL carries the resource type, the context (CICSplex or region name), an optional scope and a filter, for example `/CICSSystemManagement/CICSProgram/PLEX1/REGIONA?CRITERIA=(PROGRAM=PAY*)`. Actions such as `NEWCOPY`, `ENABLE` or `INSTALL` are sent as a request body on a `PUT` or `POST`. Access is controlled by the user ID on the HTTP request and the same security profiles that govern the equivalent CICS commands, so a pipeline's service ID needs those permissions. CICS Explorer, the Zowe CLI CICS plug-in and the Ansible CICS collection are all CMCI clients.
