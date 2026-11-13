---
title: "SMT"
params:
  expansion: "Simultaneous multithreading"
  short: "Two hardware threads sharing one core — more total throughput on zIIPs and IFLs, at the cost of each thread running slower."
  ref: { title: "IBM Redbooks: IBM z17 (9175) Technical Guide", url: "https://www.redbooks.ibm.com/abstracts/sg248579.html" }
  aka: ["simultaneous multithreading", "MT mode", "PROCVIEW CORE", "MT_ZIIP_MODE"]
  related: ["zIIP", "IFL", "SAP", "HiperDispatch", "CPU MF", "MSU"]
  links:
    - title: "Wikipedia: Simultaneous multithreading"
      url: "https://en.wikipedia.org/wiki/Simultaneous_multithreading"
categories: ["Hardware"]
tags: ["hardware", "performance"]
---

A core spends much of its time waiting, mostly for data from memory or a distant cache. With SMT, a single core runs two instruction streams at once, sharing execution units, caches and address-translation buffers, so while one thread waits the other can use the idle hardware. The core gets more work done in total, but each thread is slower than it would be alone.

On IBM Z it is used where throughput matters more than single-thread speed. On z/OS that means **zIIPs**: set `PROCVIEW CORE` in `LOADxx` and `MT_ZIIP_MODE=2` in `IEAOPTxx`, with HiperDispatch on. Linux on **IFLs** uses it under z/VM or KVM, and **SAPs** run SMT by default. General-purpose CPs on z/OS run one thread per core, because that is where software is priced and where the speed of a single transaction matters most.

What changes once SMT is on is measurement. CPU time for the same unit of work varies with what the other thread is doing, and "one processor" in a report may now mean a core or a thread. RMF and SMF report MT capacity and productivity factors, drawn from CPU MF counters, to turn thread time back into core capacity. Anyone doing zIIP capacity planning or chargeback needs to know which view they are looking at.
