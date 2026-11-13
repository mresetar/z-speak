---
title: "WLM"
params:
  expansion: "Workload Manager"
  short: "Allocates CPU and I/O by business goal rather than by fixed priority."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is workload management?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatiswlm.htm" }
  aka: ["service class", "goal mode", "WLM policy"]
  related: ["SMF", "RMF", "SRM", "zIIP", "Address Space", "Parallel Sysplex", "IRD", "Dispatcher", "Enclave", "SAS"]
  links:
    - title: "Wikipedia: Workload Manager"
      url: "https://en.wikipedia.org/wiki/Workload_Manager"
categories: ["System Services"]
tags: ["performance", "zos"]
---

You define **service classes** with goals — "90% of these transactions in 0.3 seconds", "this batch gets velocity 40" — and an **importance** ranking. WLM continuously measures, then moves dispatching priority, storage and I/O priority around to meet the goals, taking resource from less important work when they conflict.

It also drives capping, initiator management, enclave dispatching for zIIP-eligible work, and sysplex routing weights. A badly defined WLM policy is a common root cause of "the mainframe is slow" — everything classified as important means nothing is.

The policy has a few moving parts. **Classification rules** look at each unit of work — its subsystem type, job name, user ID, transaction name, and so on — and assign a service class. A service class can have several **periods**, so that work which uses more than a set amount of resource drops to a lower goal: short queries stay fast, long ones age down. **Report classes** change nothing about priority but let you measure a group of work separately. Work that matches no rule falls into a default, and for started tasks that default can be far too generous or far too low.

Goals come in three kinds: **response time**, **execution velocity** (how often work that wants to run actually can, for work with no clear end), and **discretionary** (run when nothing else needs the capacity). The policy is edited in an ISPF application or z/OSMF, stored in the WLM **couple data set**, and activated across the sysplex with one command. WLM only makes choices when resources are short — on an idle machine every goal is met.
