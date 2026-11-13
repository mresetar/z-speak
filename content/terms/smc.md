---
title: "SMC-R and SMC-D"
params:
  expansion: "Shared Memory Communications over RDMA / over Direct Memory Access"
  short: "TCP connections that quietly switch to memory-to-memory transfer, with no application change, between LPARs or across machines."
  ref: { title: "IBM Docs: Shared Memory Communications terms", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=communications-shared-memory-terms" }
  aka: ["SMC", "SMC-R", "SMC-D", "ISM", "Internal Shared Memory", "RoCE", "RDMA"]
  related: ["Communications Server", "HiperSockets", "OSA-Express", "Network Express", "Linux on IBM Z"]
  links:
    - title: "IBM Docs: Shared Memory Communications"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=system-shared-memory-communications"
categories: ["Middleware"]
tags: ["network", "performance"]
---

A TCP/IP stack spends real CPU on every packet: segmentation, checksums, acknowledgements, interrupts. SMC skips all of that for connections where both ends are IBM Z systems that can share memory. The application opens an ordinary socket. The first exchange goes over normal TCP, and if both stacks support SMC they agree on a **rendezvous** and move the data stream to shared memory, while the socket API stays unchanged. Nothing in CICS, MQ, Db2 DDF or a Java application has to change.

The two flavours differ in reach. **SMC-D** uses **ISM** (Internal Shared Memory), a virtual PCI function with no hardware at all, for LPARs on the **same** machine. **SMC-R** uses RDMA over Converged Ethernet (RoCE Express, or Network Express on z17) to write directly into the partner's memory on **another** machine. Both z/OS and Linux on IBM Z support them, and they can talk to each other.

What trips people up is that SMC is opportunistic and silent. If a connection is not eligible — wrong subnet or VLAN setup, feature not enabled in `GLOBALCONFIG`, a peer without SMC — it just stays plain TCP, and nothing fails. Netstat output shows which connections actually went SMC. Check it before claiming the benefit.
