---
title: "PSW"
params:
  expansion: "Program Status Word"
  short: "The 128-bit register holding where the processor is executing and in what state — the first thing you read in a dump."
  ref: { title: "IBM z/Architecture Principles of Operation (SA22-7832)", url: "https://publibfp.dhe.ibm.com/epubs/pdf/a227832c.pdf" }
  aka: ["program status word", "current PSW"]
  related: ["z/Architecture", "IPCS", "ABEND", "APF Authorization", "Storage Key", "Wait State", "Interrupt", "Program Check"]
  links:
    - title: "Wikipedia: Program status word"
      url: "https://en.wikipedia.org/wiki/Program_status_word"
categories: ["System Services"]
tags: ["internals", "troubleshooting"]
---

The PSW carries the instruction address, the condition code, the storage protection key, the addressing mode, interrupt masks, and the **problem state / supervisor state** bit that decides whether privileged instructions are allowed.

Two consequences you meet in practice. Debugging: when a program abends, the PSW in the dump tells you the failing instruction address, which you map back to an offset in the compiler listing. Security: the supervisor-state bit is the boundary that **APF authorization** exists to control.

There is always a *current* PSW, and for each class of interrupt a pair of fixed storage locations holding an **old** and a **new** PSW. When an interrupt occurs — an I/O completion, a program check, an SVC, a timer — the hardware stores the current PSW as the old one and loads the new one, which points at the operating system's handler. That swap is the entire mechanism by which z/OS gains control, and it is why the dump shows you the PSW "at time of error".

Reading one takes practice. In the short form shown in messages (`PSW=078D1000 8001A2C4`) the first word carries the masks, key and state, and the second the address; the high-order bit of the address word reflects the **addressing mode**. A program check leaves the address pointing *after* the failing instruction for most errors, so you subtract the instruction length. A PSW with the wait bit on and nothing enabled is a **disabled wait** — the system has stopped on purpose, and the address field holds the wait state code.
