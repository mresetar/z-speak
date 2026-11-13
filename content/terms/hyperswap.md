---
title: "HyperSwap"
params:
  expansion: "HyperSwap"
  short: "Switches z/OS from its primary disks to their synchronous mirror in seconds, without stopping applications."
  ref: { title: "IBM Docs: Displaying Basic HyperSwap information", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=command-displaying-basic-hyperswap-information-hs" }
  aka: ["Basic HyperSwap", "GDPS HyperSwap", "planned swap", "unplanned swap"]
  related: ["PPRC", "GDPS", "UCB", "Parallel Sysplex", "DASD", "RAS", "Subchannel"]
  links:
    - title: "Wikipedia: HyperSwap"
      url: "https://en.wikipedia.org/wiki/HyperSwap"
categories: ["Storage"]
tags: ["storage", "availability", "disaster-recovery"]
---

With Metro Mirror every primary volume has an identical secondary. HyperSwap exploits that: when the primary storage system fails — or needs maintenance — the system briefly freezes I/O, swaps the contents of each **UCB** so that the device number now leads to the secondary volume, and resumes. Applications see a pause of a few seconds and no I/O error; data set names, volume serials and allocations are unchanged.

It turns a disk subsystem failure from a disaster-recovery event into a non-event, and it must be done for every system in the sysplex together. The swap is orchestrated by **GDPS**, or by *Basic HyperSwap* under IBM Copy Services Manager for shops without GDPS.

HyperSwap only covers the disks. It keeps running systems running; it does not restart anything at another site, and it cannot help with logical corruption, which the mirror has faithfully copied.
