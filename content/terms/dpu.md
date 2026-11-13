---
title: "DPU"
params:
  expansion: "Data Processing Unit (IBM Integrated DPU, the z17 I/O engine)"
  short: "An I/O processor built into every Telum II chip that takes over protocol work I/O cards used to do on their own."
  ref: { title: "IBM Redbooks: IBM z17 Technical Introduction", url: "https://www.redbooks.ibm.com/abstracts/sg248580.html" }
  aka: ["Data Processing Unit", "I/O engine", "integrated DPU"]
  related: ["Telum", "Network Express", "Channel Subsystem", "SAP", "PCHID"]
categories: ["Hardware"]
tags: ["hardware", "io"]
---

Each Telum II processor chip in z17 carries eight processor cores, an AI accelerator, and one **DPU**. Earlier machines put a custom ASIC and firmware on every I/O card to run the network or storage protocol. The DPU moves that work onto the processor chip itself, next to the caches, which IBM describes as a complete refactoring of the I/O subsystem. There is less hardware per card, less latency between the I/O and the data, and less power.

The first visible user is **Network Express**. Its ports are managed by the DPU, which is why one card can play OSA, RoCE and coupling roles. As a z/OS person you mostly notice the result — new CHPID and function types, cheaper and more consolidated I/O features — rather than the DPU itself.

Do not confuse it with the **SAP**. SAPs are ordinary processor cores set aside to run the channel subsystem, starting and tracking I/O for every LPAR, and they have been there for decades. The DPU is separate silicon for protocol processing. It is not a PU you buy or characterize, it runs no customer code, and it adds nothing to MSU capacity.
