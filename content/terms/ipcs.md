---
title: "IPCS"
params:
  expansion: "Interactive Problem Control System"
  short: "The tool for reading dumps — where a crash on z/OS is actually diagnosed."
  ref: { title: "IBM Docs: Interactive Problem Control System (IPCS)", url: "https://www.ibm.com/docs/en/z-netview/6.3.0?topic=program-interactive-problem-control-system" }
  aka: ["dump analysis", "SVC dump", "stand-alone dump"]
  related: ["ABEND", "PSW", "Systems Programmer", "SDSF", "SLIP", "GTF", "LOGREC", "Dump", "Control Block", "System Trace"]
  links:
    - title: "IBM Docs: Introduction to IPCS"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=ipcs-introduction"
categories: ["System Services"]
tags: ["troubleshooting", "sysprog"]
---

Three kinds of dump reach IPCS. An **SVC dump** is taken automatically when a subsystem hits an error, and is the usual input. A **transaction dump** covers one address space. A **stand-alone dump** is taken from the HMC when the system itself is wedged, and captures everything.

Typical session: point IPCS at the dump data set, run `VERBEXIT SUMDUMP` or `STATUS`, find the failing task, read the **PSW** and registers, walk the save-area chain back to the caller, then map the address to a module and offset. Component verb exits (`VERBX CICS`, `VERBX MQDATA`) decode subsystem control blocks.

It is a specialist skill, and it is why IBM support routinely asks you to send a dump rather than a log.
