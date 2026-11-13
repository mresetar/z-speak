---
title: "Problem State"
params:
  expansion: "Problem state vs supervisor state"
  short: "The two execution modes of the processor: ordinary application code, and code allowed to run privileged instructions."
  ref: { title: "IBM z/Architecture Principles of Operation (SA22-7832)", url: "https://publibfp.dhe.ibm.com/epubs/pdf/a227832c.pdf" }
  aka: ["supervisor state", "problem program"]
  related: ["PSW", "APF Authorization", "z/Architecture", "Storage Key", "Interrupt"]
  links:
    - title: "IBM Docs: Supervisor state or problem state"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=routines-supervisor-state-problem-state"
categories: ["System Services"]
tags: ["internals", "security"]
---

Application code runs in **problem state** — privileged instructions trap. The operating system runs in **supervisor state**, where they are allowed. A bit in the **PSW** says which, and only authorized code may flip it.

The naming trips people up: a "problem program" is not a broken one. It is IBM's 1960s term for a program that solves the user's problem, as opposed to the supervisor that manages the machine. **Storage protection keys** work alongside this — key 0 is the system's, key 8 is where ordinary user programs live.

A program moves between the states only in controlled ways. An **SVC** or a **program call** enters the operating system, which runs in supervisor state on the caller's behalf and returns. An **APF-authorised** program may ask for supervisor state itself with the `MODESET` macro. There is no other route, and hardware enforces it: a privileged instruction in problem state causes a program check, seen as abend `S0C2`.

State and key are separate controls and are often confused. **State** decides which instructions may run; the **key** decides which storage may be changed. Keys 0–7 are system keys, key 8 is shared by ordinary programs, and 9–15 are used by subsystems such as CICS to protect their own storage. Code in supervisor state and key 0 can do anything, so the integrity of z/OS rests on never letting unauthorised code reach that combination — the formal commitment IBM calls **system integrity**.
