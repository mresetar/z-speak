---
title: "Control Unit"
params:
  expansion: "Control unit (CU) and logical control unit (LCU)"
  short: "The device controller between channels and devices; today a function inside a storage system or tape library, not a separate box."
  ref: { title: "IBM Docs: Defining the control unit characteristics", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=units-defining-control-unit-characteristics" }
  aka: ["CU", "CUADD", "control unit image", "3990", "2107", "CNTLUNIT", "LSS"]
  related: ["Channel Subsystem", "FICON", "PCHID", "HCD", "IOCP", "DASD", "DS8000", "UCB", "PAV", "Subchannel"]
categories: ["Hardware"]
tags: ["hardware", "io", "storage"]
---

In the classic picture of mainframe I/O there are three layers: a **channel** in the processor, a **control unit** that understands a family of devices, and the **devices** themselves. The channel sends commands; the control unit translates them into what the disk or tape drive must physically do. Thirty years ago a control unit was a cabinet of its own — a 3990 for disk, a 3174 for terminals.

Today the layer survives as a definition. A storage system such as a DS8000 presents many **logical control units**, each addressing up to 256 devices; a tape library presents control units for its drives; an OSA adapter is defined as one too. The I/O configuration still names each control unit (`CNTLUNIT` in IOCP terms), its type, the channel paths that reach it — up to eight — and the range of unit addresses behind it. A logical control unit is selected by its **CUADD** value, which on a DS8000 corresponds to a logical subsystem.

The definitions matter because they shape performance and limits. All I/O to devices in one logical control unit shares the same set of channel paths. Alias addresses for **PAV** are defined within a logical control unit and can only serve base volumes in it. And the 256-device limit per LCU is why a large storage system is divided into dozens of them.

In practice you meet the term in HCD panels, in RMF reports that summarise I/O queueing by LCU, and in messages about paths to a control unit going offline — usually the first sign of a cabling or switch problem.
