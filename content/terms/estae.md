---
title: "ESTAE"
params:
  expansion: "Extended Specify Task Abnormal Exit (recovery routines and RTM)"
  short: "A recovery routine a program registers so that it gets control when it abends, and can clean up, record the error, and retry or let the abend continue."
  ref: { title: "IBM Docs: Planning for ESTAE-type recovery routines and FRRs", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=environment-planning-estae-type-recovery-routines-frrs" }
  aka: ["recovery routine", "ESTAEX", "FRR", "functional recovery routine", "RTM", "SDWA", "ARR", "ESPIE", "percolation", "retry"]
  related: ["ABEND", "Dump", "LOGREC", "TCB", "SLIP", "Language Environment", "Cross-Memory", "RAS"]
categories: ["Operating System"]
tags: ["internals", "troubleshooting", "availability"]
---

On z/OS a failing program is not simply killed. The **Recovery Termination Manager** (RTM) first looks for recovery routines that the program, or the code that called it, set up in advance, and gives them a chance to act. This design is a large part of why a subsystem can lose one transaction without losing the whole address space.

A task-level routine is established with the `ESTAE` or `ESTAEX` macro. When an abend occurs, RTM calls the most recently established routine and passes it an **SDWA** (system diagnostic work area) holding the abend code, the PSW and the registers at the time of error. The routine typically records diagnostic data, releases resources, and then chooses: **retry**, resuming at a point it names as if the error had been handled, or **percolate**, passing the abend to the next older routine. If every routine percolates, the task ends.

System code that runs disabled, locked or as an SRB uses **FRRs** (functional recovery routines) instead, and PC routines can have an **ARR**. `ESPIE` is a narrower facility that intercepts only program interrupts.

Application programmers meet this indirectly. Language Environment establishes its own ESTAE so that it can turn abends into conditions and print a traceback; CICS does the same to convert a program check into an `ASRA`. One consequence: the dump or message you see may come from a recovery routine rather than from the original failure, and a recovery routine that retries blindly can hide an error or loop on it.
