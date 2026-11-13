---
title: "IOCP"
params:
  expansion: "Input/Output Configuration Program"
  short: "The program that turns I/O configuration statements into an IOCDS — the hardware's own definition of its channels, control units and devices."
  ref: { title: "Wikipedia: Input/Output Configuration Program", url: "https://en.wikipedia.org/wiki/Input/Output_Configuration_Program" }
  aka: ["IOCDS", "IOCP deck", "stand-alone IOCP"]
  related: ["HCD", "Channel Subsystem", "PCHID", "LPAR", "HSA", "IPL", "Control Unit"]
  links:
    - title: "IBM Docs: Input/Output Configuration Program (IOCP) support"
      url: "https://www.ibm.com/docs/en/systems-hardware/zsystems/9176-ME2?topic=operation-inputoutput-configuration-program-iocp-support"
categories: ["Hardware"]
tags: ["hardware", "io", "configuration"]
---

Before a mainframe can run anything, the channel subsystem must be told what is plugged in where. That description lives in an **IOCDS** (I/O configuration data set) on the Support Element and is loaded at power-on reset. IOCP is the program that writes it, from statements such as `RESOURCE` (the LPARs), `CHPID`, `CNTLUNIT` and `IODEVICE`.

Nobody writes those statements by hand any more. **HCD** keeps the configuration in an IODF, validates it, and generates the IOCP input and the IOCDS from it — which guarantees that the hardware's view and the operating system's view of the devices agree. The exception is a brand-new machine with no running system: its first IOCDS is built with the **stand-alone IOCP** on the Support Element, from a deck generated on another system.

An "IOCP deck" is still the usual way to exchange a configuration with IBM or a hardware vendor, and reading one is a useful skill: it is the most compact statement of what a machine is connected to.
