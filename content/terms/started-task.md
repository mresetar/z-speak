---
title: "Started Task"
params:
  expansion: "Started task (STC)"
  short: "A long-running address space started by the operator or at IPL — the mainframe's daemon or service."
  ref: { title: "IBM Docs: z/OS Basic Skills — The master scheduler subsystem (started tasks)", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_mastersched.htm" }
  aka: ["STC", "started procedure"]
  related: ["Address Space", "JES", "RACF", "MCS Console", "Automatic Restart Manager", "MODIFY Command", "System Automation", "SDSF", "Subsystem", "CICS Region"]
  links:
    - title: "IBM Docs: The STARTED class"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=racf-started-class"
categories: ["System Services"]
tags: ["operations", "zos"]
---

`S CICSPRD` starts it, `P CICSPRD` stops it. The JCL lives in a **PROCLIB** member, and the task runs under an identity assigned by the **STARTED** class in RACF — a security detail that matters, because these are the address spaces with real authority.

CICS regions, Db2 subsystems, MQ queue managers, TCP/IP, VTAM, automation and monitoring all run as started tasks. Batch jobs come and go; started tasks are what is *there*.

A started task differs from a batch job in how it begins. There is no `JOB` statement to submit: an operator, an automation product or a `COMMNDxx` PARMLIB member issues `START`, and the system builds the job around the procedure. It gets a job ID beginning `STC`, and its output goes to the spool like any job's, where SDSF shows it.

The three everyday commands are `S` to start, `F` (MODIFY) to send the running task a command it understands, and `P` to ask it to stop cleanly. `C` (CANCEL) is the forceful alternative, and for a database or a transaction manager it is a last resort. An identifier can be added — `S CICS.PRD1` — so that several instances of one procedure can be addressed separately.

Order matters. Started tasks depend on each other — nothing network-facing works before VTAM and TCP/IP are up — so automation brings them up in sequence after an IPL and takes them down in reverse.

On the security side, the `STARTED` profile can also mark a task *trusted* or *privileged*, which bypasses most authorization checking. Those few entries are among the first things an auditor looks at.
