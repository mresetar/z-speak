---
title: "DISP"
params:
  expansion: "The DISP (disposition) parameter of the DD statement"
  short: "Tells the system whether a data set already exists, how it may be shared, and what to do with it when the step ends."
  ref: { title: "IBM Docs: JCL Reference — DISP parameter", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-disp-parameter" }
  aka: ["disposition", "DISP=SHR", "DISP=OLD", "DISP=MOD", "CATLG", "NOT CATLGD 2"]
  related: ["DD Statement", "JCL", "Data Set", "Catalog", "GRS", "GDG", "System Utilities", "Dynamic Allocation", "Checkpoint/Restart", "Temporary Data Set"]
  links:
    - title: "IBM Docs: Bypassing disposition processing"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=parameter-bypassing-disposition-processing"
categories: ["Development"]
tags: ["batch", "jcl", "beginner"]
---

`DISP=(status,normal,abnormal)` has three positions. The **status** is `NEW` (create it), `OLD` (it exists and I need it exclusively), `SHR` (it exists and others may read it too) or `MOD` (append to it, creating it if necessary). The second and third say what happens at the end of the step if it ends normally or abends: `KEEP`, `DELETE`, `CATLG`, `UNCATLG` or `PASS` to a later step.

The idiom for an output file is `DISP=(NEW,CATLG,DELETE)`: create it, catalog it if all goes well, remove it if the step fails. Omit the parameter and the default is `(NEW,DELETE)` — a data set that vanishes at the end of the step, which surprises people exactly once.

The status is also a locking request. `OLD`, `NEW` and `MOD` take an exclusive enqueue on the data set name for the *whole job*, not just the step. A job that sits "waiting for data sets" has asked for exclusive use of something another job or a TSO user is holding. Use `SHR` for anything you only read.

The classic rerun failure belongs here too: the first run cataloged the output, so the second run's `NEW` fails or leaves `NOT CATLGD 2`. The usual cure is a first step that deletes it with `DISP=(MOD,DELETE)`.
