---
title: "JES"
params:
  expansion: "Job Entry Subsystem (JES2 / JES3)"
  short: "The component that queues, schedules and spools batch jobs and their output."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is JES?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatisjes.htm" }
  aka: ["JES2", "JES3", "spool"]
  related: ["JCL", "SDSF", "Address Space", "SYSOUT", "NJE", "HASP", "Initiator", "SYSLOG", "Subsystem", "FTP"]
  links:
    - title: "Wikipedia: MVS Job Entry Subsystems"
      url: "https://en.wikipedia.org/wiki/MVS_Job_Entry_Subsystems"
categories: ["System Services"]
tags: ["batch", "zos"]
---

You submit JCL; JES reads it, puts the job on a queue, picks it up when an initiator and the right job class are free, runs it, and captures the printed output on the **spool**. Then you read that output in SDSF.

**JES2** is the common choice — each system in a sysplex manages its own queue in a shared MAS. **JES3** centralised scheduling across systems. z/OS 2.5 was the last release to include it, and 2.5 itself left standard support in September 2026, so sites have moved to JES2 or to the vendor-supported JES3plus.

JES is also the first subsystem started at IPL and the last stopped, because almost nothing else can run without it — started tasks and TSO users get their job IDs (`STC`, `TSU`, `JOB` prefixes) and their output handling from it. A job passes through fixed **phases**: input, conversion (where JCL is checked and procedures expanded), execution, output and purge. A JCL error is caught at conversion, before any step runs, which is why such a job has output but no step messages.

Control comes from two places. JES2 **initialisation statements** define classes, initiators, printers and the spool, and operators adjust them with commands that begin with `$` — `$D` to display, `$T` to change, `$P` to stop. Inside a job, `/*` control statements and the newer `JOBGROUP` and `SCHEDULE` statements pass requests such as hold, route or run-after-time. The spool and the **checkpoint** data set are JES2's critical resources: lose the checkpoint and the job queue goes with it.
