---
title: "SYSLOG"
params:
  expansion: "System log and operations log"
  short: "The running record of every console message, command and reply on a z/OS system — the first place to look when anything happens."
  ref: { title: "IBM Docs: Hardcopy processing", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=configuration-hardcopy-processing" }
  aka: ["OPERLOG", "hardcopy log", "system log", "SDSF LOG", "WRITELOG", "job log"]
  related: ["MCS Console", "SDSF", "System Logger", "JES", "System Automation", "SYSOUT", "LOGREC", "Parallel Sysplex", "Message ID"]
  links:
    - title: "IBM Docs: Using OPERLOG"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=medium-using-operlog"
categories: ["System Services"]
tags: ["operations", "troubleshooting", "observability"]
---

Everything written to an operator console — messages from the system and from jobs, commands entered, the responses to them — is also recorded in the **hardcopy log**. On one system this is the SYSLOG, a continuous output data set on the JES spool. Each line carries a time stamp, the job that issued it and the message, whose identifier begins with a component prefix: `IEF` for job management, `IEC` for data management, `$HASP` for JES2, `DFH` for CICS, `DSN` for Db2.

In a sysplex the better source is **OPERLOG**, a System Logger log stream into which the messages of all systems are merged in time order. A problem that crosses systems can then be read as a single story. The `LOG` panel in SDSF browses whichever is active.

The log is the timeline for any investigation: when the job started, what the operator did, which message came first. It is also the input to automation, which acts on message identifiers, and audit evidence — so it is normally archived daily, the `WRITELOG` command closing the current portion and queueing it for output.

It is not the **job log**. The messages at the top of a job's own output are only the subset concerning that job; if an explanation is missing there, look in the SYSLOG at the same time.
