---
title: "Interrupt"
params:
  expansion: "Interruption (the six classes of z/Architecture interrupts)"
  short: "The hardware event that takes control from a running program and hands it to z/OS: I/O finished, a timer expired, a program failed or asked for a service."
  ref: { title: "IBM Docs: Interrupt processing", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=process-interrupt-processing" }
  aka: ["interruption", "interrupt handler", "FLIH", "SLIH", "external interrupt", "I/O interrupt", "machine check"]
  related: ["PSW", "SVC", "Problem State", "Wait State", "TCB", "z/Architecture", "Channel Subsystem"]
categories: ["Operating System"]
tags: ["internals", "architecture", "fundamentals"]
---

A processor runs one instruction after another until something more urgent happens. On IBM Z that "something" is an **interrupt**, and there are six classes: **I/O** (a device has finished or needs attention), **external** (a timer, the operator's interrupt key, a signal from another processor), **program** (the running program did something invalid, or reached an event being monitored), **supervisor call** (the program executed an `SVC` instruction), **machine check** (the hardware detected a fault) and **restart**.

The mechanism is the same for all of them. The hardware stores the current **PSW** in a fixed location as the old PSW and loads a new one from another fixed location; the new PSW points at a z/OS routine called a **first-level interrupt handler**. That routine saves the registers of the interrupted work, decides what the interrupt means and passes it on. When it has finished, the dispatcher chooses what runs next — not necessarily the program that was interrupted.

Code can run **disabled** for I/O and external interrupts by setting mask bits in the PSW, which is how the system protects its most delicate sequences. Disabled code must be short, because nothing else can happen on that processor meanwhile.

For a programmer the visible cases are program interrupts, which z/OS turns into `S0Cx` abends, and SVC interrupts, which are simply how system services are requested. A system that takes no interrupts at all is in a disabled wait.
