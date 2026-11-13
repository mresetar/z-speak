---
title: "PR/SM"
params:
  expansion: "Processor Resource/Systems Manager"
  short: "The firmware hypervisor that creates and isolates LPARs. Always on, never installed."
  ref: { title: "IBM Redbook: Partitioning Implementations (LPAR / PR/SM)", url: "https://www.redbooks.ibm.com/redbooks/pdfs/sg247039.pdf" }
  aka: ["PR/SM hypervisor"]
  related: ["LPAR", "CPC", "z/VM", "DPM", "IRD", "MSU", "HMC"]
  links:
    - title: "Wikipedia: PR/SM"
      url: "https://en.wikipedia.org/wiki/PR/SM"
categories: ["Hardware"]
tags: ["virtualization", "hardware"]
---

PR/SM (pronounced "prism") is a Type-1 hypervisor built into the machine's firmware. There is no product to license or install — if you have an IBM Z, you are already running on PR/SM, because even a single-partition machine is one LPAR.

It handles processor dispatching between LPARs, memory partitioning and I/O path virtualization. For a *second* level of virtualization — hundreds of Linux guests inside one LPAR — you run **z/VM** on top.

What you actually configure is an **image profile** per LPAR on the HMC: how many logical processors of each type it has, whether they are dedicated or shared, its memory, and its **weight**. Among LPARs sharing processors, the weight is a guaranteed share under contention, not a limit — an LPAR may use more whenever others leave capacity idle.

Limits are a separate set of controls, and they are easy to confuse: a hard cap at the weight, a *defined capacity* soft cap expressed in MSUs and enforced over a rolling four-hour average, group capacity across several LPARs, and an absolute cap in fractions of a processor. Because software bills follow them, capping settings are as much a financial decision as a technical one.

The isolation between partitions is certified to a high Common Criteria level, which is what allows production, test and even different companies' workloads to share one machine. A large model supports up to 85 LPARs.

**HiperDispatch** refines the dispatching, and **DPM** is an alternative, simplified way of defining partitions for Linux-only machines.
