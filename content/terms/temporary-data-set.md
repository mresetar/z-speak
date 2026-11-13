---
title: "Temporary Data Set"
params:
  expansion: "Temporary data set (&&name) and VIO"
  short: "A work file that exists only for the life of a job, named with && or not named at all, and deleted automatically at the end."
  ref: { title: "IBM Docs: Temporary data sets", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=set-temporary-data-sets" }
  aka: ["passed data set", "DISP=(NEW,PASS)", "VIO", "virtual I/O", "work file", "SYSUT1"]
  related: ["DD Statement", "DISP", "JCL", "SPACE", "UNIT", "DFSORT", "Paging", "Sequential Data Set"]
categories: ["Storage"]
tags: ["jcl", "storage", "batch"]
---

Many job steps need scratch space: the object module between a compile and a link, sort work areas, an intermediate extract passed from one step to the next. A **temporary data set** is made for that. Code a name beginning with two ampersands, `DSN=&&EXTRACT`, or leave `DSN` off entirely, and the system generates a unique name such as `SYS26317.T093015.RA000.MYJOB.EXTRACT.H01` and deletes the data set when the job ends.

To use it in a later step it must be **passed**: `DISP=(NEW,PASS)` in the step that creates it and `DISP=(OLD,DELETE)` or `(OLD,PASS)` in the steps that read it. A temporary data set is never cataloged and cannot be kept; `KEEP` and `CATLG` are ignored or rejected.

The two ampersands matter. A single ampersand introduces a **JCL symbol**, so `&TEMP` is treated as a symbol first and only falls back to a temporary name if no such symbol is defined — a habit in old JCL that causes surprises when someone later defines the symbol.

**VIO** (virtual I/O) keeps small temporary data sets in paging storage instead of on a real volume, selected by a unit name the installation defines. It avoids disk allocation but uses memory.

The real trap is restart. Temporary data sets vanish when the job ends, so a job that fails in step 5 cannot be restarted there if step 5 reads something passed from step 2. Production jobs that must be restartable use permanent, cataloged work files and delete them in a final step.
