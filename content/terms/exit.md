---
title: "Exit"
params:
  expansion: "Installation exit / user exit"
  short: "A defined point where the system or a product calls a routine you supply, so you can change its behaviour without modifying its code."
  ref: { title: "IBM Docs: z/OS MVS — Dynamic Exits Facility", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=routines-dynamic-exits-facility" }
  aka: ["installation exit", "user exit", "exit routine", "dynamic exit", "IEFUSI", "IEFACTRT", "IEFUJV", "JES2 exit", "CSVDYNEX", "SETPROG EXIT", "global user exit"]
  related: ["PARMLIB", "LPA", "SMF", "JES", "RACF", "HLASM", "APF Authorization", "REGION", "SYSMOD", "Systems Programmer"]
  links:
    - title: "IBM Docs: z/OS MVS Installation Exits — IEFUSI, step initiation exit"
      url: "https://www.ibm.com/docs/en/SSLTBW_3.1.0/com.ibm.zos.v3r1.ieae400/usi.htm"
    - title: "IBM Docs: Using the PROGxx EXIT statement"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=lpa-using-exit-statement"
    - title: "IBM Docs: Updating dynamic exits (SETPROG EXIT)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=command-updating-dynamic-exits"
categories: ["System Services"]
tags: ["sysprog", "internals", "customisation"]
---

z/OS and almost every product on it were designed before configuration files could express much, so they offer **exits** instead: at a documented point in its processing the system calls a routine written by the installation, hands it a parameter list, and acts on the return code. This is how a site enforces its own job naming standard, limits region sizes, adds accounting, or rejects a weak password — without touching IBM's code.

The ones you hear about first:

| Exit | Called when | Typical use |
|---|---|---|
| `IEFUJV` | A job's JCL is read and converted | Validate or reject JOB statements |
| `IEFUSI` | A job step starts | Set region and `MEMLIMIT` limits |
| `IEFACTRT` | A step or job ends | Write the step-end summary in the job log |
| JES2 exits (numbered) | Throughout job input, conversion and output | Job class and output standards |
| `ICHPWX01` | A RACF password is changed | Password quality rules |

Exit routines used to be link-edited into the system and changed with an IPL. The **dynamic exits facility** removed that: exits are defined in `PROGxx`, several routines can be attached to the same exit, and `SETPROG EXIT,ADD` or `SETPROG EXIT,DELETE` swaps them on a running system. `D PROG,EXIT` shows what is active.

Exits are usually written in assembler and run authorized, in the caller's environment, often with locks held. A bug in one does not fail a job — it can fail every job, or the system. That is why exits are the first thing a sysprog inventories before an upgrade, and why the direction of travel is away from them: `SMFLIMxx` replaces most `IEFUSI` logic, JES2 policies replace several JES2 exits, and RACF password rules replace home-grown checks.

The word is also used one level up. Products have their own — DFSORT `E15`/`E35`, CICS global user exits, Db2 authorization exits — and they follow the same contract: a documented call point, a parameter list, a return code.
