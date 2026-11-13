---
title: "SRM"
params:
  expansion: "System Resources Manager"
  short: "The z/OS dispatcher's arbiter — the component that actually decides which address spaces get CPU and storage, second by second."
  ref: { title: "IBM Docs: The system resources manager", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-system-resources-manager" }
  aka: ["System Resources Manager"]
  related: ["WLM", "MSU", "Address Space", "Virtual Storage", "Dispatcher"]
  links:
    - title: "IBM Docs: IEAOPTxx (OPT parameters)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sys1parmlib-ieaoptxx-opt-parameters"
categories: ["Operating System"]
tags: ["performance", "zos", "sysprog"]
---

WLM sets goals — velocity, response time, importance — but the code that enforces them is the **System Resources Manager**. SRM owns the dispatching decisions: it monitors CPU, paging rates and I/O, computes how well each address space is doing against its WLM-defined goals, and swaps, delays or dispatches work accordingly. Every dispatch of a task, every page-in, every swap decision passes through it.

The distinction matters in conversation: WLM is the *policy* (business goals, service classes, report classes); SRM is the *mechanism* that turns policy into a queue order. They work as a pair — WLM constantly re-evaluates, SRM constantly executes — and you will hear "SRM says" in performance tuning discussions about why one job is running hot and another is starved.

Operators meet SRM mostly through its messages and commands: `DISPLAY D,WLM`-style queries show what the pair is doing, and RMF reports translate the outcome — dispatching priority, swap counts, page-in rates — into the numbers capacity planners live on.
