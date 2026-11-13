---
title: "TSO/E"
params:
  expansion: "Time Sharing Option / Extensions"
  short: "The interactive command-line session a user gets when they log on to z/OS."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is TSO?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatistso.htm" }
  aka: ["TSO"]
  related: ["ISPF", "REXX", "CLIST", "Address Space", "z/OS", "RACF", "z/OSMF", "Zowe CLI", "Dynamic Allocation", "Logical Unit", "Natural"]
  links:
    - title: "Wikipedia: Time Sharing Option"
      url: "https://en.wikipedia.org/wiki/Time_Sharing_Option"
categories: ["System Services"]
tags: ["interactive", "zos"]
---

Logging on gives you an address space and a line-mode prompt where you can allocate data sets, submit jobs, run **REXX** or call utilities. Almost nobody stays at that prompt — the first thing you type is `ISPF`.

TSO commands (`LISTC`, `ALLOC`, `RECEIVE`, `SUBMIT`) remain important because they are scriptable and appear inside REXX execs and batch `IKJEFT01` steps everywhere.

Two things about the environment explain most of its quirks. A session is a complete address space, built from a **logon procedure** — a piece of JCL that allocates your libraries — and limited by a region size, so "data set not allocated" and "not enough storage" are usually logon-procedure questions. And a user ID can normally be logged on only once per system: a dropped connection leaves the session there until you log on again with `RECONNECT`.

Whether you may use TSO at all is a security matter. The user needs a **TSO segment** in RACF naming the logon procedure, account number and region size they are allowed.

The same command processor also runs with no terminal. A batch step that executes `IKJEFT01` with commands in `SYSTSIN` is "TSO in batch", and it is how Db2 batch programs, REXX execs and many housekeeping jobs are run. Remote tools use the idea too: `zowe tso issue command` starts a TSO address space through z/OSMF, runs the command and returns the output.
