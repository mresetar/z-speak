---
title: "HSA"
params:
  expansion: "Hardware System Area"
  short: "Memory the machine keeps for its own firmware and I/O configuration, outside every LPAR — 884 GB fixed on z17."
  ref: { title: "IBM Redbooks: IBM z17 (9175) Technical Guide", url: "https://www.redbooks.ibm.com/abstracts/sg248579.html" }
  aka: ["Hardware System Area"]
  related: ["CPC", "PCHID", "HCD", "Channel Subsystem", "LPAR", "PR/SM"]
  links:
    - title: "IBM Docs: Hardware system area (HSA)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=hardware-system-area-hsa"
categories: ["Hardware"]
tags: ["hardware", "memory", "io"]
---

Before any LPAR is activated, the machine needs memory for itself: firmware (LIC), PR/SM, and above all the control blocks that describe the I/O configuration. There is one **subchannel** for every device each LPAR can reach, across every channel subsystem. At power-on reset the active IOCDS is loaded into the HSA, and the channel subsystem runs from it. No partition can address this memory.

On older machines the HSA size depended on how big the I/O configuration might become, and running out meant a disruptive power-on reset before you could add devices. Recent generations make it a **fixed** size, reserved on top of the memory you buy — 884 GB on z17. That is deliberately generous, so dynamic I/O changes through HCD never hit a ceiling. The z17 guide's point is that there is nothing left to plan.

Where it shows up in practice is the difference between installed and usable memory, and in dynamic I/O reconfiguration. When the configuration in the HSA and the one z/OS believes is active get out of step, dynamic changes are refused until they are resynchronized — a problem with its own recovery procedure in the z/OS documentation.
