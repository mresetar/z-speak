---
title: "UCB"
params:
  expansion: "Unit Control Block"
  short: "The control block representing one I/O device — and, informally, the device address itself."
  ref: { title: "IBM Docs: Unit control block (UCB)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=software-unit-control-block-ucb" }
  aka: ["device address", "unit address"]
  related: ["DASD", "Channel Subsystem", "HCD", "Virtual Storage", "PAV", "Control Block", "UNIT", "Control Unit", "Subchannel"]
  links:
    - title: "Wikipedia: Unit Control Block"
      url: "https://en.wikipedia.org/wiki/Unit_Control_Block"
categories: ["System Services"]
tags: ["internals", "io"]
---

Every device z/OS knows about — a DASD volume, a tape drive, a console, a network adapter — has a UCB carrying its address, status and paths. "What's the UCB?" in practice means "what's the device number?", written as four hex digits like `0A80`.

They used to live below the 16 MB line, and running out of them was a real constraint on how many devices a system could have; UCBs above the line lifted it. `D U,DASD,ONLINE` lists them, and device numbers are how storage and operations teams refer to volumes in conversation.

The device number and the UCB are defined in the **IODF**; at IPL, z/OS builds a UCB for every device described there. A UCB records, among other things, the volume serial currently mounted, whether the device is online, allocated or reserved, and which channel paths lead to it. Device numbers are just labels chosen by the installation, and need not match between systems or bear any relation to the physical position of the device.

A base UCB handles one I/O request at a time, so requests for a busy volume queue in the operating system — visible as **IOS queue time** in performance reports. **PAV** and **HyperPAV** add alias UCBs so that several requests to one volume run at once. Device numbers were limited to four hex digits, about 65,000 devices; **subchannel sets** let alias and secondary devices live in separate sets with the same number, written with a leading digit as in `1A800`.
