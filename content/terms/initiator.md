---
title: "Initiator"
params:
  expansion: "Initiator address space and job classes"
  short: "The address space that takes a batch job from the queue and runs it; which jobs it takes is decided by job class."
  ref: { title: "IBM Docs: JES2 — Using job classes with JES2-managed initiators", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=initiation-using-job-classes-jes2-managed-initiators" }
  aka: ["INIT", "job class", "WLM-managed initiator", "$SI", "job queue"]
  related: ["JES", "JOB Statement", "WLM", "Address Space", "SDSF", "Batch Scheduler", "Batch Window", "DISP"]
  links:
    - title: "IBM Docs: JES2 control of batch job initiation"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=execution-jes2-control-batch-job-initiation"
categories: ["Operating System"]
tags: ["batch", "operations", "zos"]
---

A submitted job does not start by itself. It waits on the JES input queue until an initiator — an address space whose only purpose is to run batch jobs, one at a time and one step after another — selects it. Each initiator is assigned a list of **job classes** and takes only jobs whose `CLASS` matches. The number of initiators serving a class is therefore the number of jobs of that class that can run at once.

Classes are an installation's way of sorting work: short jobs and long ones, jobs that need tape, production and test. The meaning of class `A` is purely local.

There are two ways of running initiators. With **JES-managed** initiators, operators or automation start and stop a fixed set. With **WLM-managed** initiators, Workload Manager starts as many as are needed to meet the goals of the jobs' service class and the system can bear.

"Why isn't my job running?" has a short list of answers, visible in SDSF: no free initiator for its class, the job or its class is held, another job with the same name is executing, or it is waiting for a data set.
