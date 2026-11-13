---
title: "Wait State"
params:
  expansion: "Wait state (enabled and disabled wait)"
  short: "A processor with nothing to run — normal when it is waiting for an interrupt, fatal when interrupts are disabled and a wait code is loaded."
  ref: { title: "Wikipedia: Wait state", url: "https://en.wikipedia.org/wiki/Wait_state" }
  aka: ["disabled wait", "enabled wait", "wait state code", "hard wait", "WAIT 0A2"]
  related: ["PSW", "IPL", "HMC", "ABEND", "IPCS", "XCF", "Dump", "Interrupt"]
  links:
    - title: "IBM Docs: Wait state codes in z/Architecture mode"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=introduction-wait-state-codes-in-zarchitecture-mode"
categories: ["Operating System"]
tags: ["internals", "troubleshooting", "operations"]
---

One bit in the **PSW** says whether the processor is running or waiting. An **enabled wait** is the idle state: no work is ready, interrupts are open, and the next I/O completion or timer pop will wake the CPU. An idle system spends most of its time there.

A **disabled wait** is how z/OS stops for good. When the system hits a condition it cannot recover from — most often during IPL — it loads a PSW with the wait bit on, all interrupts masked, and a **wait state code** in the address field. Nothing can wake it. The code is shown on the HMC and documented in *MVS System Codes*; for example `0A2` means XCF could not bring the system into the sysplex.

A wait state code is the system's last message, and often its only one: there may be no console and no dump. So the first step in diagnosing an IPL that "just stopped" is to read the PSW from the HMC and look up the code and its reason code.
