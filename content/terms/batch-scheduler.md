---
title: "Batch Scheduler"
params:
  expansion: "IWS, Control-M, CA-7"
  short: "The product that decides which of tens of thousands of nightly jobs runs, in what order, and what to do when one fails."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is batch processing?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatisbatch.htm" }
  aka: ["TWS", "OPC", "IWS", "Control-M", "CA-7"]
  related: ["JES", "JCL", "GDG", "SYSOUT", "Connect:Direct", "Batch Window", "Initiator", "Checkpoint/Restart", "Dead-Letter Queue"]
  links:
    - title: "Wikipedia: Job scheduler"
      url: "https://en.wikipedia.org/wiki/Job_scheduler"
categories: ["System Services"]
tags: ["batch", "operations"]
---

Nobody submits production JCL by hand. A scheduler holds the **application** — a dependency graph of jobs with predecessors, calendars, resource locks and time windows — and drives the whole night's work, restarting from the right step after a failure.

The common ones: **IBM Workload Scheduler for z/OS** (still called TWS or OPC by everyone who used it before the renames), **BMC Control-M**, and **Broadcom CA-7**. The vocabulary differs but the concepts do not.

This is where the **batch window** lives — the hours between the online day ending and the next one starting. Shrinking it is a perennial project, and the reason people care so much about parallelism, sort performance and restartability.

A job becomes eligible to run when everything it waits for is satisfied: predecessor jobs have ended as expected, a time has been reached, a **special resource** is free, or an **event** has happened — a file arriving or a data set being closed. The scheduler builds a plan for the day from the definitions and the calendar, submits each job to JES, and reads the outcome from system messages and SMF records, comparing the highest return code with what was defined as acceptable.

Operators watch for exceptions: a job ended in error, one running longer than usual, or one that will miss its **deadline**. **Critical path** monitoring warns hours ahead that a late job will delay an important one. Restart is partly automated — the scheduler or a companion product removes data sets created by the failed run and restarts at the right step. Modern schedulers also control work on distributed servers and cloud services from the same plan, and expose REST APIs so that pipelines can add or trigger jobs.
