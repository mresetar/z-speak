---
title: "JCL"
params:
  expansion: "Job Control Language"
  short: "The language that tells z/OS what program to run, with which data sets, and in what order."
  related: ["JES", "DD Statement", "Cataloged Procedure", "Data Set", "Record Format", "Condition Code", "JOB Statement", "EXEC Statement", "DISP", "JCL Symbol", "Easytrieve"]
  ref: { title: "IBM Docs: z/OS MVS JCL Reference", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=introduction-job-control-language-jcl" }
  aka: ["job control", "job stream", "deck"]
  links:
    - title: "Wikipedia: Job Control Language"
      url: "https://en.wikipedia.org/wiki/Job_Control_Language"
categories: ["Development"]
tags: ["batch", "language"]
---

Three statement types do almost everything:

```jcl
//PAYROLL  JOB (ACCT),'MONTH END',CLASS=A,MSGCLASS=X
//STEP010  EXEC PGM=PAYCALC,PARM='202609'
//INFILE     DD DSN=PROD.PAYROLL.MASTER,DISP=SHR
//OUTFILE    DD DSN=PROD.PAYROLL.RESULT,DISP=(NEW,CATLG,DELETE),
//              SPACE=(CYL,(50,10)),DCB=(RECFM=FB,LRECL=200)
//SYSPRINT   DD SYSOUT=*
```

`JOB` identifies and accounts, `EXEC` names a program or procedure, `DD` connects a name the program knows to a real data set. JCL is not a scripting language — there are no loops and no expressions, only conditional step execution via `COND` or `IF/THEN`.

It is unforgiving about columns and continuations, and a job can fail on a JCL error before a single line of your program runs. Everyone gets bitten by `DISP` at least once.

The layout rules are few and strict. Statements begin with `//` in columns 1–2, then a name, an operation and its parameters, all in upper case and ending by column 71. A line is continued by breaking after a comma and starting the next line with `//` and the parameters between columns 4 and 16. `//*` is a comment; `/*` ends in-stream data. A stray character in the wrong column gives a JCL error that names a line but rarely the real cause.

After a run, the outcome of each step is a **condition code**, by convention 0 for success, 4 for a warning, and 8 or more for failure; an **abend** is something else, a system (`Sxxx`) or user (`Unnnn`) code meaning the program was terminated. `COND` reads backwards — it says when to *skip* a step — which is why `IF/THEN/ELSE` is preferred. Reuse comes from **procedures**, `INCLUDE` groups and symbols set with `SET`, and the job output (`JESMSGLG`, `JESJCL`, `JESYSMSG`) shows the JCL as it was actually interpreted.
