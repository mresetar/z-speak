---
title: "GTF"
params:
  expansion: "Generalized Trace Facility"
  short: "A z/OS service aid that records detailed system events — I/O, SVCs, interrupts, component traces — for later analysis."
  ref: { title: "IBM Docs: The Generalized Trace Facility (GTF)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=aids-generalized-trace-facility-gtf" }
  aka: ["GTF trace", "GTFTRACE", "USR records", "CCW trace"]
  related: ["IPCS", "SLIP", "LOGREC", "Started Task", "SVC", "VTAM", "Systems Programmer", "System Trace"]
  links:
    - title: "Wikipedia: Generalized Trace Facility"
      url: "https://en.wikipedia.org/wiki/Generalized_Trace_Facility"
categories: ["System Services"]
tags: ["troubleshooting", "sysprog", "internals"]
---

The system trace built into z/OS is always on but short and terse. When a problem needs more — every channel program sent to one device, every SVC issued by one job, the contents of VTAM buffers — you start GTF. It runs as a started task, is told which event types to capture (`IO`, `SSCH`, `SVC`, `PI`, `DSP`, `USR` and others) and for which devices, jobs or address spaces, and writes records to a data set or keeps them in a wrap-around buffer in storage.

Components and products can write their own records through the same mechanism, as `USR` events; that is how VTAM buffer traces and several subsystem traces are collected. The output is formatted with the `GTFTRACE` subcommand of **IPCS**.

GTF is a diagnostic instrument, used at the request of a support centre for a specific problem and for as short a time as possible. An unfiltered trace on a busy system costs significant processor time and fills its data set in seconds, so the art lies in the filters.
