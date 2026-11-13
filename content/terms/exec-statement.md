---
title: "EXEC Statement"
params:
  expansion: "The JCL EXEC statement"
  short: "Marks the start of a job step and names the program or procedure that the step runs."
  ref: { title: "IBM Docs: JCL Reference — EXEC statement", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=jcl-exec-statement" }
  aka: ["job step", "PGM=", "PARM", "COND", "IF/THEN/ELSE", "step name"]
  related: ["JCL", "JOB Statement", "DD Statement", "Cataloged Procedure", "Condition Code", "STEPLIB", "Load Module", "REGION"]
  links:
    - title: "IBM Docs: EXEC statement: PGM parameter"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-exec-statementpgm-parameter"
categories: ["Development"]
tags: ["batch", "jcl", "beginner"]
---

A job is a sequence of **steps**, and each step begins with an EXEC statement: `//STEP1 EXEC PGM=IEBGENER` runs a program, while `//STEP1 EXEC PROC=MYPROC` — or simply `EXEC MYPROC` — runs a cataloged procedure. The DD statements that follow belong to that step. A job may have up to 255 steps.

`PARM='…'` passes a short character string to the program, the batch counterpart of command-line arguments. `REGION` and `TIME` limit the step's storage and processor time.

Conditional execution is the confusing part. The old `COND` parameter states when a step is to be *skipped*: `COND=(4,LT)` means "bypass this step if 4 is less than any earlier return code". Read aloud, it nearly always sounds backwards. The `IF`/`THEN`/`ELSE`/`ENDIF` statement construct says the same thing readably — `// IF (STEP1.RC <= 4) THEN` — and is the better choice for new JCL.

When the step runs a procedure, keywords can be aimed at a step inside it — `PARM.COMPILE='LIST'` — and DD statements overridden as `//COMPILE.SYSIN DD …`. That override syntax is how one shared procedure serves many jobs.
