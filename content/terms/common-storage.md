---
title: "Common Storage"
params:
  expansion: "Common storage areas (CSA, SQA and their extended forms)"
  short: "The parts of virtual storage that appear at the same addresses in every address space, used by the system and subsystems to share data."
  ref: { title: "IBM Docs: Common service area (CSA/Extended CSA)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=overview-common-service-area-csaextended-csa" }
  aka: ["CSA", "ECSA", "SQA", "ESQA", "common service area", "system queue area", "CSA creep"]
  related: ["Virtual Storage", "Address Space", "The Line and the Bar", "Storage Key", "PARMLIB", "LNKLST", "Cross-Memory", "IPL", "REGION", "Storage Subpool", "LPA"]
  links:
    - title: "IBM Docs: Using extended common service area (ECSA)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=needs-using-extended-common-service-area-ecsa"
categories: ["Operating System"]
tags: ["internals", "memory", "sysprog"]
---

Each address space has its own private area, but a section of every address space is the same storage, mapped at the same addresses for all. This **common** storage holds the nucleus, the link pack area with shared system code, and two areas for data: the **SQA** (system queue area), for system control blocks that must always be addressable, and the **CSA** (common service area), which subsystems use to share data among address spaces. Each has an extended counterpart above the 16 MB line — ESQA and ECSA.

Their sizes are set at IPL in `IEASYSxx` and cannot be changed afterwards. They are also a trade-off: every megabyte of common storage is a megabyte removed from the private area of *every* address space, so a generous CSA below the line shrinks the region available to each batch job and TSO user.

Shortages are system-wide emergencies. When SQA fills, it overflows into CSA; when CSA is exhausted, components fail in unpredictable places and the system may need an IPL. The usual slow cause is storage obtained in CSA and never released when its owner ends, known as **CSA creep**. Storage tracking, switched on in a `DIAGxx` member, records who obtained each piece so the culprit can be found.
