---
title: "zHPF"
params:
  expansion: "High Performance FICON for IBM Z"
  short: "A leaner I/O protocol over FICON channels that packs a whole request into one message, raising the I/O rate each channel can sustain."
  ref: { title: "IBM Docs: ZHPF statement (IECIOSxx)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=parameters-zhpf" }
  aka: ["High Performance FICON", "HPF", "transport mode", "TCW", "command mode", "ZHPF=YES"]
  related: ["FICON", "Channel Subsystem", "DS8000", "EXCP", "zHyperLink", "PAV", "Db2 for z/OS", "PARMLIB"]
  links:
    - title: "IBM Docs: High Performance FICON (zHPF) exploitation (z/OS 2.3)"
      url: "https://www.ibm.com/docs/en/zos/2.3.0?topic=information-high-performance-ficon-zhpf-exploitation"
categories: ["Hardware"]
tags: ["hardware", "io", "performance"]
---

Classic FICON carries the same conversation that channels have always had with control units: a channel program is a chain of commands — seek, search, read — sent and acknowledged one at a time. That is called **command mode**, and each exchange costs time in the channel and in the storage system.

zHPF introduces **transport mode**. The whole request is described in one transport control word and sent as a single message; the control unit carries it out and returns the data with one status. Fewer round trips mean lower response time and, above all, far more I/O operations per second through the same channel — which often postpones the need for more channels.

It requires support at every point on the path: the channel, any switches, the storage system (as a licensed feature on a **DS8000**) and z/OS, where it is enabled with `ZHPF=YES` in the `IECIOSxx` PARMLIB member and displayed with `D IOS,ZHPF`. When any link in the chain lacks it, I/O quietly falls back to command mode.

The access methods use it automatically where it applies — Db2, VSAM, PDSE, zFS and extended-format data sets all benefit — so no application changes. It is normally on everywhere, and is noticed mainly when a new device or a migration turns out not to support it.
