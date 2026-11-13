---
title: "JOB Statement"
params:
  expansion: "The JCL JOB statement (the job card)"
  short: "The first statement of every batch job: it names the job and says how it is to be accounted, queued and reported."
  ref: { title: "IBM Docs: JCL Reference — JOB statement", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-job-statement" }
  aka: ["job card", "CLASS", "MSGCLASS", "MSGLEVEL", "NOTIFY", "TYPRUN"]
  related: ["JCL", "EXEC Statement", "DD Statement", "Initiator", "JES", "SYSOUT", "JCL Symbol", "REGION", "Checkpoint/Restart"]
  links:
    - title: "IBM Docs: JOB statement"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statements-job-statement"
categories: ["Development"]
tags: ["batch", "jcl", "beginner"]
---

```
//PAYROLL1 JOB (ACCT123),'MONTH END',CLASS=A,MSGCLASS=X,
//             MSGLEVEL=(1,1),NOTIFY=&SYSUID
```

The name in columns 3 to 10 is the **job name** — up to eight characters, and what you look for in SDSF. After `JOB` come accounting information and a programmer name, then keywords. `CLASS` picks the job class, which decides which **initiator** may run the job. `MSGCLASS` says where the job log goes, `MSGLEVEL=(1,1)` asks for all JCL and allocation messages in it, and `NOTIFY` sends a message to a TSO user when the job ends.

A few others earn their keep. `TYPRUN=SCAN` checks the JCL for syntax errors without running anything; `TYPRUN=HOLD` queues the job held. `RESTART=stepname` reruns a failed job from a given step. `REGION` and `TIME` set limits for every step.

Almost everything here is subject to site rules — which classes exist, what the accounting field must contain, whether the job name must begin with your user ID — and they are enforced by exits, so a job card that works on one system is rejected on another. Copy one from a colleague before writing your own.
