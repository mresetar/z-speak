---
title: "LOGREC"
params:
  expansion: "Logrec error recording"
  short: "The system-wide record of hardware errors and software abends, often holding the first sign of a problem before any dump."
  ref: { title: "IBM Docs: Recording logrec error records", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=aids-recording-logrec-error-records" }
  aka: ["SYS1.LOGREC", "EREP", "logrec log stream", "symptom record", "VERBX LOGDATA"]
  related: ["IPCS", "ABEND", "System Logger", "RAS", "SMF", "GTF", "Dump", "SYSLOG", "ESTAE", "System Trace"]
  links:
    - title: "IBM Docs: Analyzing a logrec error record"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=loop-analyzing-logrec-error-record"
categories: ["System Services"]
tags: ["troubleshooting", "sysprog", "hardware"]
---

z/OS components recover from most of their own errors, and a successful recovery often produces no message and no dump. What it does produce is a logrec record. Machine checks, I/O errors, channel problems and program abends in system code are all written there, with the registers, PSW and a symptom string identifying the failing module.

The recording medium is either the `SYS1.LOGREC` data set, one per system, or a **System Logger** log stream that merges the records of every system in the sysplex — the recommended setup. Reports are produced with **EREP**, the Environmental Record Editing and Printing program. The most recent records are also held in storage, so `VERBX LOGDATA` in **IPCS** shows what led up to a dump.

It is the most under-used diagnostic source on the platform. Before analysing a dump, look at logrec for the minutes before it: the abend you were given is frequently a consequence, and the cause is an earlier software record nobody saw. Hardware engineers use the same data to spot a device that is failing gradually.
