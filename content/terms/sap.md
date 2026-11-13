---
title: "SAP"
params:
  expansion: "System Assist Processor"
  short: "Processor cores reserved to run the channel subsystem — they start and track every I/O so the CPUs running z/OS don't have to."
  ref: { title: "IBM Docs: z/OS Basic Skills — Mainframe hardware: Processing units", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=concepts-mainframe-hardware-processing-units" }
  aka: ["System Assist Processor", "IOP", "I/O processor"]
  related: ["Channel Subsystem", "Specialty Engine", "CPC", "PCHID", "DPU", "RMF"]
  links:
    - title: "IBM Docs: HMC help: System Assist Processors"
      url: "https://www.ibm.com/docs/en/help-ibm-hmc-z17?topic=d-system-assist-processors"
categories: ["Hardware"]
tags: ["hardware", "io"]
---

Every processor unit (PU) in an IBM Z machine is the same silicon, and firmware **characterizes** it for a role: CP, zIIP, IFL, ICF, spare — or SAP. A SAP runs the channel subsystem's Licensed Internal Code. When z/OS issues an I/O, it hands the request to the channel subsystem and carries on. A SAP chooses a path to the device, queues the request if the path is busy, starts it on a channel, and presents the interrupt back when it finishes. That split between processing and I/O management is a large part of why mainframe I/O scales the way it does.

Every model comes with a number of standard SAPs for all LPARs to share, and more can be ordered for I/O-heavy configurations. SAPs are invisible to the operating system, run no customer code, and do not count toward software capacity or MSUs. On z17 all SAPs but one run in SMT mode.

In performance data they appear under another name: RMF's I/O Queuing Activity report calls them **IOPs** (I/O processors) and shows their utilization and how often I/O requests were delayed. High IOP busy is rare, but it is a real bottleneck when it happens. And unrelated to the ERP company SAP, whose software may well be doing the I/O.
