---
title: "Batch TSO"
params:
  expansion: ""
  short: "Running TSO commands, REXX execs and Db2 programs in a batch job by executing the TSO terminal monitor program, IKJEFT01."
  ref: { title: "Wikipedia: Time Sharing Option — Batch use", url: "https://en.wikipedia.org/wiki/Time_Sharing_Option#Batch_use" }
  aka: ["IKJEFT01", "IKJEFT1A", "IKJEFT1B", "TMP", "terminal monitor program", "SYSTSIN", "SYSTSPRT", "TSO in batch", "background TSO", "DSN RUN"]
  related: ["TSO/E", "REXX", "CLIST", "JCL", "EXEC Statement", "DD Statement", "Db2 for z/OS", "Plan and Package", "ISPF", "Condition Code", "SPUFI", "RACF"]
  links:
    - title: "IBM Docs: z/OS Basic Skills — What is TSO?"
      url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatistso.htm"
categories: ["Operating System"]
tags: ["batch", "tso", "fundamentals"]
---

TSO is thought of as the interactive side of z/OS, but the program that reads and runs TSO commands — the **terminal monitor program** — does not need a terminal. Run it as a job step and it takes its commands from the `SYSTSIN` DD and writes what would have appeared on the screen to `SYSTSPRT`.

```jcl
//RUNPGM   EXEC PGM=IKJEFT01
//STEPLIB  DD DISP=SHR,DSN=DSNC10.SDSNLOAD
//SYSTSPRT DD SYSOUT=*
//SYSTSIN  DD *
  DSN SYSTEM(DB2P)
  RUN PROGRAM(PAYROLL) PLAN(PAYPLAN) LIB('PROD.LOADLIB')
  END
/*
```

That example is the reason most application programmers meet it: the usual way to run a batch program that uses Db2 is under the `DSN` command, inside batch TSO. The other everyday uses are running a REXX exec unattended (`SYSEXEC` DD plus `%MYEXEC` in SYSTSIN), issuing RACF or catalog commands in bulk, and running ISPF dialogs in batch with `ISPSTART`.

There are three entry points and the difference is error handling. `IKJEFT01` carries on with the next command after one fails and reports an abend as return code 12. `IKJEFT1A` and `IKJEFT1B` stop the step and surface the failing command's return code or an abend, which is what later steps testing condition codes need. A job that "worked" with return code 0 although the program inside it failed is usually an `IKJEFT01` step.

Nothing is prompted for in batch. A command that would ask for a missing operand at a terminal simply fails, and commands written for interactive use may behave differently. Data set names are the usual stumbling block — the prefix TSO adds to unquoted names is not necessarily the one you have at your terminal, so quote fully qualified names in `SYSTSIN`.
