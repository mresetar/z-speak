---
title: "Batch Window"
params:
  expansion: "Batch window"
  short: "The period, traditionally overnight, in which batch work must run and finish before online service resumes."
  ref: { title: "IBM Docs: Understanding the common batch window problem", url: "https://www.ibm.com/docs/en/cvrfz/6.3.0?topic=backout-understanding-common-batch-window-problem" }
  aka: ["overnight batch", "batch cycle", "end of day", "critical path"]
  related: ["Batch Scheduler", "JCL", "BatchPipes", "CICS", "Initiator", "WLM", "DFSORT", "VSAM", "Checkpoint/Restart", "RUNSTATS"]
  links:
    - title: "IBM Docs: Batch workload management"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=participants-batch-workload-management"
categories: ["Operating System"]
tags: ["batch", "operations", "performance"]
---

Classic applications are built as two halves. During the day, online transactions update files and databases; at night the files are closed to the online system and batch jobs take them over — posting the day's transactions, calculating interest, producing statements and extracts. The window is the time between closing the online service and the moment it must be open again.

It is under pressure from both sides: volumes grow, while internet channels and global operation shrink or abolish the quiet hours. A window that is missed means branches or services opening late, so the end time is normally a formal service-level commitment, and operators watch the **critical path** — the chain of dependent jobs that determines the finishing time.

The remedies fall into two groups. Make the batch faster: run independent streams in parallel, pipe data between jobs, tune sorts and I/O, give the critical jobs priority. Or remove the need for exclusivity, so that batch and online can run together: record-level sharing for VSAM, frequent commits in database batch, and designs that process work continuously instead of once a day.
