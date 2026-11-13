---
title: "Network Express"
params:
  expansion: "IBM Network Express adapter (z17)"
  short: "The z17 network card that merges OSA-Express, RoCE Express and long-reach coupling into one adapter, driven by the on-chip DPU."
  ref: { title: "IBM Docs: z/OS Communications Server support for Network Express", url: "https://www.ibm.com/docs/en/zos/3.2.0?topic=hs-zos-communications-server-support-network-express-feature-z17" }
  aka: ["EQDIO", "OSH", "NETH", "NETD", "Network Express SR", "Network Express LR"]
  related: ["OSA-Express", "SMC-R and SMC-D", "DPU", "Coupling Links", "Communications Server", "PCHID"]
categories: ["Hardware"]
tags: ["hardware", "network"]
---

Up to z16, a mainframe had separate cards for separate network jobs. **OSA-Express** carried ordinary TCP/IP to the LAN, **RoCE Express** carried RDMA traffic for SMC-R, and **Coupling Express LR** carried sysplex traffic over distance. z17 folds all three onto one hardware platform, Network Express, in 10G and 25G short-reach and long-reach variants, two ports per card. The card itself is simpler because the protocol work moved into the processor chip's **DPU**, which manages the ports.

For OSA-style traffic it uses a new architecture, **EQDIO** (Enhanced Queued Direct I/O), with a new CHPID type, **OSH** (OSA Hybrid). OSH supports everything the old OSD/QDIO type did. For RDMA, **NETH** functions can share a port with an OSH CHPID, so SMC-R and plain TCP/IP travel over the same physical link. **NETD** hands a port's whole PCIe function straight to one partition, typically Linux, instead of the DPU.

The practical catch for z/OS is that this is not just a faster OSA. Network Express supports only EQDIO, so a TCP/IP profile written for OSD interfaces needs new `INTERFACE` definitions, and migrating from z16 is a network change as well as a hardware one. Only the older OSA-Express7S 1.2 cards, carried forward, still speak classic QDIO.
