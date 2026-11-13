---
title: "BatchPipes"
params:
  expansion: "IBM BatchPipes"
  short: "Connects the output of one batch job directly to the input of another through memory, so both run at the same time without an intermediate file."
  ref: { title: "Wikipedia: BatchPipes", url: "https://en.wikipedia.org/wiki/BatchPipes" }
  aka: ["SUBSYS=", "BatchPipeWorks", "SmartBatch", "batch pipe"]
  related: ["JCL", "DD Statement", "QSAM", "CMS Pipelines", "Batch Scheduler", "Coupling Facility", "z/OS UNIX"]
  links:
    - title: "IBM Docs: Steps for writing to BatchPipes"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=batchpipes-steps-writing"
categories: ["System Services"]
tags: ["batch", "performance", "jcl"]
---

In a classic batch stream, job A writes a tape or disk file, ends, and job B then reads it. The data is written once and read once, and the two jobs' elapsed times add up. BatchPipes replaces the file with a **pipe**: the writer's DD and the reader's DD both specify `SUBSYS=` with the BatchPipes subsystem name and the same data set name, and records flow from one address space to the other through a buffer in memory.

Both jobs run concurrently — the reader waits when the pipe is empty, the writer when it is full — so the batch window shrinks and the I/O disappears. The programs do not change, as long as they read and write sequentially with QSAM or BSAM. Within a sysplex the pipe can span systems through a Coupling Facility structure.

The cost is operational. The two jobs are now one unit: both must be scheduled together, and if either fails, both must be rerun, because there is no file to restart from. That dependency, more than the technology, decides where pipes are worth using.
