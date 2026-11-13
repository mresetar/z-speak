---
title: "MRO"
params:
  expansion: "Multiregion Operation"
  short: "The CICS facility that lets regions in the same system or sysplex call each other directly, without going through a network."
  ref: { title: "IBM Docs: CICS — Multiregion operation", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=intercommunication-multiregion-operation" }
  aka: ["ISC", "IPIC", "IRC", "TOR", "AOR", "FOR", "function shipping", "transaction routing", "DPL"]
  related: ["CICS", "CICSPlex SM", "XCF", "SNA", "Parallel Sysplex", "CSD", "RLS", "CICS Region", "CICS Transaction Gateway", "Logical Unit"]
  links:
    - title: "IBM Docs: Multiregion operation (MRO)"
      url: "https://www.ibm.com/docs/en/cics-ts/5.5.0?topic=components-multiregion-operation-mro"
categories: ["Middleware"]
tags: ["cics", "configuration", "clustering"]
---

One CICS region is one address space, and a large workload is spread over many: terminal-owning regions (**TOR**) that hold the connections, application-owning regions (**AOR**) that run the programs, and sometimes file-owning regions (**FOR**) that own shared data. MRO is the link between them — cross-memory services within a z/OS image, XCF between images of a sysplex — and it is fast because no communications stack is involved.

Over that link CICS offers **transaction routing** (the transaction runs in another region), **function shipping** (a file or queue request is executed where the resource lives), and **distributed program link** (a `LINK` to a program elsewhere). The application does not change; the routing is in resource definitions, or decided dynamically by **CICSPlex SM**.

The same functions are available to regions that MRO cannot reach, over **ISC** (SNA LU 6.2) or **IPIC** (TCP/IP). MRO is the choice whenever the regions share a sysplex. Splitting regions this way is for availability and scaling as much as tidiness: an AOR can be cloned or recycled without users losing their sessions.
