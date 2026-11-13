---
title: "Checkpoint/Restart"
params:
  expansion: "Checkpoint/restart and step restart for batch jobs"
  short: "Ways of resuming a failed batch job from a known point — the start of a step, or a checkpoint inside it — without rerunning everything."
  ref: { title: "IBM Docs: Using checkpoint/restart", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=management-using-checkpointrestart" }
  aka: ["step restart", "RESTART=", "RD parameter", "CHKPT macro", "deferred restart", "automatic restart", "SYSCHK", "rerun"]
  related: ["Batch Scheduler", "JOB Statement", "GDG", "DISP", "Batch Window", "Unit of Work", "IMS", "ABEND"]
categories: ["System Services"]
tags: ["batch", "availability", "operations"]
---

A batch job that fails three hours into a four-hour run raises an obvious question: must it all be done again? z/OS and its subsystems offer several answers, and choosing the wrong one corrupts data.

**Step restart** is the simple form. `RESTART=stepname` on the JOB statement, or the equivalent action in a scheduler, starts the job at a named step and skips those before it. It only works if the job was designed for it: data sets created by the failed step must be deleted first, `(+1)` generation references resolve differently on the rerun, and anything passed from an earlier step is gone.

**Checkpoint/restart** proper works inside a step. A program issues the `CHKPT` macro (in COBOL, the `RERUN` clause) at intervals, and the system writes the program's storage and the positions of its data sets to a checkpoint data set. A restart resumes from the last checkpoint, either automatically or later through a `SYSCHK` DD. The `RD` parameter says which kinds of restart are allowed. This classic facility has restrictions and is less used today.

Programs that update databases use the subsystem's own mechanism instead. An IMS batch program issues `CHKP` calls and restarts with `XRST`; a Db2 program commits at intervals and records its position in a restart table, so a rerun skips what was already committed.

The rule for developers: a long-running job should commit regularly and be restartable by design, and its restart instructions belong in the scheduler, not in someone's memory.
