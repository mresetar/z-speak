---
title: "MODIFY Command"
params:
  expansion: "MVS MODIFY (F) operator command"
  short: "`F jobname,text` — the z/OS console command that passes a command string to a running job or started task."
  ref: { title: "IBM Docs: z/OS MVS System Commands — MODIFY command", url: "https://www.ibm.com/docs/en/zos/3.2.0?topic=reference-modify-command" }
  aka: ["F", "MODIFY", "F jobname", "START/STOP/CANCEL"]
  related: ["MCS Console", "Started Task", "SDSF", "CEMT", "RACF", "JES", "Subsystem"]
  links:
    - title: "IBM Docs: Passing information to a job"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=jobs-passing-information-job"
categories: ["System Services"]
tags: ["operations"]
---

A long-running address space has no terminal for you to type into, so z/OS gives the operator a way to talk to it: `MODIFY jobname,text`, or just `F jobname,text`. MVS delivers the text to the program, and the program decides what it means. Each product defines its own vocabulary. `F LLA,REFRESH` rebuilds the link-list directory, `F CATALOG,REPORT` shows catalog address space status, and `F CICSPROD,CEMT I TCPIPSERVICE` runs a CEMT command in a CICS region and returns the output to the console. A program that never set itself up to accept commands rejects the MODIFY.

It is one of the verbs of operator life, each with its own abbreviation: `S` START, `P` STOP, `F` MODIFY, `C` CANCEL, `D` DISPLAY. The zXplore challenge asks why it is `F` and not `M`: `M` is taken by MOUNT, just as `P` is STOP because `S` is START. From TSO the usual way in is SDSF: type `/` followed by the command on the command line, and the reply appears in the log.

The difference to understand is between **asking** and **forcing**. `F` and `P` ask the program to act or to shut down, and a well-behaved subsystem tidies up first. `C` (CANCEL) kills it. For CICS that matters: `F region,CEMT PERFORM SHUTDOWN` writes a warm keypoint so the next `START=AUTO` is a quick warm start, while a cancelled region comes back through emergency restart. MODIFY is also a security boundary: RACF profiles in the **OPERCMDS** class (`MVS.MODIFY.STC.*`, `MVS.MODIFY.JOB.*`) decide who may send commands to what.
