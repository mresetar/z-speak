---
title: "SMF"
params:
  expansion: "System Management Facilities"
  short: "z/OS's built-in telemetry: numbered records for nearly everything the system does."
  ref: { title: "IBM Docs: z/OS MVS System Management Facilities (SMF)", url: "https://www.ibm.com/docs/en/SSLTBW_2.2.0/pdf/iea3g215.pdf" }
  aka: ["SMF records", "SMF type 30", "IFASMFDP"]
  related: ["System Logger", "RMF", "WLM", "z/OS", "Enclave", "SETROPTS", "zSecure", "zERT", "SAS"]
  links:
    - title: "Wikipedia: IBM System Management Facilities"
      url: "https://en.wikipedia.org/wiki/IBM_System_Management_Facilities"
categories: ["System Services"]
tags: ["observability", "cost"]
---

Every job step, data set access, CICS transaction, Db2 thread and security check can emit an SMF record. The type number is the vocabulary: **type 30** address space activity, **type 42** DFSMS I/O, **type 70–79** RMF performance, **type 80** RACF security events, **type 110** CICS, **type 100–102** Db2.

SMF data feeds chargeback, capacity planning, performance tuning and audit. Historically it was written to data sets and post-processed in batch; **SMF logstreams** and the real-time in-memory interfaces now let tools like Splunk, Elastic or IBM Z monitoring consume it live.

What gets recorded is a choice. The `SMFPRMxx` PARMLIB member lists which record types are written, for which subsystems, and at what **interval** — long-running address spaces cut interval records every few minutes rather than only at the end. Recording everything is expensive in volume, so sites choose, and a question that needs a type nobody collected cannot be answered afterwards.

The records are binary, with variable sections located by offsets called **triplets**, and they are not readable without a mapping. The dump programs `IFASMFDP` (data sets) and `IFASMFDL` (logstreams) extract them; reporting has traditionally been done with SAS-based tools such as MXG, with DFSORT's ICETOOL, or with products that load them into a database. The original recording data sets, `SYS1.MANx`, fill and switch, and if every one is full, records are lost — one reason logstreams are now preferred. Types 0–127 belong to IBM; 128 and above are for vendors and your own programs.
