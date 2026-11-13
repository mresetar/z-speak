---
title: "Threadsafe"
params:
  expansion: "Threadsafe CICS programs and the open transaction environment (OTE)"
  short: "A CICS program written so it can run on its own TCB alongside others, without relying on CICS running one task at a time."
  ref: { title: "IBM Docs: Enabling CICS IMS applications to use the open transaction environment (OTE) through threadsafe programming", url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=apd-enabling-cics-ims-applications-use-open-transaction-environment-ote-through-threadsafe-programming" }
  aka: ["quasi-reentrant", "QR TCB", "open TCB", "L8 TCB", "OTE", "open transaction environment", "CONCURRENCY(THREADSAFE)", "CONCURRENCY(REQUIRED)", "TCB switch", "CWA"]
  related: ["CICS", "Reentrant Code", "TCB", "CICS Region", "Db2 for z/OS", "EXEC CICS", "CICS Transaction", "Dispatcher"]
categories: ["Middleware"]
tags: ["cics", "performance", "development"]
---

For most of its history CICS ran all application code on a single z/OS task, the **quasi-reentrant** (QR) TCB. Only one transaction's code executed at a time, switching only when a program issued a CICS command. Programs could therefore read and update shared storage — the common work area, a shared table — without any locking, and nothing could interleave.

That one task is also a ceiling: a region can use only one processor's worth of application CPU, and every call to Db2 or MQ needs two TCB switches, out to an **open TCB** and back. The **open transaction environment** lets a program stay on an open TCB (an `L8` TCB) after such a call, or run there from the start, so many transactions execute truly in parallel.

A program may only do that if it is **threadsafe**: it must not assume it is alone. Any update to shared storage must be serialised explicitly, with `ENQ` and `DEQ` or compare-and-swap logic, and the program must be reentrant. The program definition declares it — `CONCURRENCY(THREADSAFE)` means it can run on either kind of TCB, `REQUIRED` that it always runs on an open one. Calling a CICS command that is itself not threadsafe forces a switch back to the QR TCB, so the benefit depends on which commands are used.

The danger is declaring a program threadsafe when it is not. Nothing checks. The result is rare, unrepeatable corruption of shared data under load — the hardest kind of bug to find. IBM supplies a load module scanner to look for suspect commands, but the analysis of shared storage is the programmer's.
