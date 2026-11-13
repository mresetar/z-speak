---
title: "Channel Subsystem"
params:
  expansion: "Channel subsystem (CHPID, FICON, ESCON)"
  short: "Dedicated I/O processors that move data independently of the CPU — the reason mainframe I/O throughput is what it is."
  ref: { title: "IBM Docs: z/OS Basic Skills — Hardware connectivity on the mainframe", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.znetwork/znetwork_57.htm" }
  aka: ["channel"]
  related: ["IBM Z", "DASD", "HCD", "OSA-Express", "PCHID", "FICON", "SAP", "zHyperLink", "HSA", "CTC", "IOCP"]
  links:
    - title: "Wikipedia: Channel I/O"
      url: "https://en.wikipedia.org/wiki/Channel_I/O"
categories: ["Hardware"]
tags: ["hardware", "io", "performance"]
---

On most platforms the processor supervises I/O. On IBM Z it hands a **channel program** to the channel subsystem and goes back to work; **SAPs** (System Assist Processors) run the transfer and post an interrupt when it is done. This is the structural reason a mainframe sustains I/O rates that would saturate a comparable server.

A **CHPID** is a channel path identifier — one physical port as the machine sees it. **FICON** is the current fibre-connection protocol to storage (successor to the older **ESCON**), and **zHPF** is its higher-performance variant. Paths to a device are grouped so that any of them can carry the traffic; losing one is not an outage.

The map of channels, control units and devices is defined in **HCD** and lives in the **IODF**.
