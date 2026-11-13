---
title: "Dispatcher"
params:
  expansion: "z/OS dispatcher (work unit dispatching)"
  short: "The part of z/OS that picks the next unit of work for each processor, in priority order, every time one stops or is interrupted."
  ref: { title: "IBM Docs: Dispatching of work", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=functions-dispatching-work" }
  aka: ["dispatching", "dispatching priority", "DP", "ready queue", "time slice", "preemption"]
  related: ["TCB", "WLM", "SRM", "HiperDispatch", "Interrupt", "zIIP", "Enclave", "Address Space"]
categories: ["Operating System"]
tags: ["internals", "performance", "zos"]
---

Whenever a processor becomes free — the running work waits for I/O, finishes, or is interrupted — the dispatcher chooses what it runs next. Units of work are **TCBs** and **SRBs**; each belongs to an address space or an enclave, and each has a **dispatching priority**. The dispatcher takes the highest-priority work that is ready. A ready unit of higher priority **preempts** lower-priority work, so nothing important waits for a time slice to run out.

The dispatcher does not decide the priorities. **WLM** does, adjusting them every few seconds so that service classes meet their goals; in older terms this was the job of SRM. The dispatcher simply obeys the numbers it is given, which is why a mis-set WLM policy shows up as dispatching problems.

Several refinements matter in practice. Work eligible for a **zIIP** is dispatched there when one is free, and may spill to a general processor if not. **HiperDispatch** keeps work on the same physical processors so that cache contents stay useful. And an LPAR's logical processors are themselves dispatched by PR/SM onto physical ones, so there are two levels of dispatching, and a z/OS system can be delayed by a layer it cannot see.

In performance reports the dispatcher appears as **CPU delay** — work that was ready but not running. A program that is "slow" while using little CPU is often not being dispatched, rather than doing anything wrong.
