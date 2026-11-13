---
title: "SVC"
params:
  expansion: "Supervisor Call"
  short: "The instruction an application uses to ask the operating system for a service — the z/OS system call."
  ref: { title: "IBM z/Architecture Principles of Operation (SA22-7832)", url: "https://publibfp.dhe.ibm.com/epubs/pdf/a227832c.pdf" }
  aka: ["supervisor call", "SVC routine", "SVC number"]
  related: ["PSW", "Problem State", "HLASM", "APF Authorization", "EXCP", "Interrupt", "Dynamic Allocation"]
  links:
    - title: "Wikipedia: Supervisor Call instruction"
      url: "https://en.wikipedia.org/wiki/Supervisor_Call_instruction"
categories: ["System Services"]
tags: ["internals"]
---

`SVC 13` is ABEND, `SVC 8` is LINK, `SVC 120` is GETMAIN/FREEMAIN. The instruction causes an interrupt, the supervisor takes control in supervisor state, performs the service, and returns.

Shops and vendors can install their own **user SVCs** in the range reserved for them, which historically was a common way to give applications privileged function. It is also a classic security exposure: a badly written SVC hands supervisor state to anyone who calls it, so auditors enumerate them.

The SVC number, 0 to 255, is an index into the **SVC table**, which names the routine and its attributes. IBM owns 0–199; 200–255 are for installations and vendors. Routines are classed as **types 1 to 4 and 6**, which differ in where the code lives (the nucleus or the link pack area), whether it may be interrupted, and which locks it holds. **Extended SVCs** (ESR) pack several functions behind one number, selected by a code in a register.

Application programmers rarely write `SVC` themselves. An assembler macro such as `OPEN`, `GETMAIN` or `WTO` expands into the parameter list and the instruction, and high-level languages reach the same services through **Language Environment**. Newer services often use a **program call** (PC) instead, which avoids the interrupt and is cheaper. In a dump, an SVC interrupt code in the PSW area tells you which service the program was in when it failed — often the quickest clue to what it was trying to do.
