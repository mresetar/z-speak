---
title: "HCD"
params:
  expansion: "Hardware Configuration Definition"
  short: "The tool that defines which devices the machine has, producing the IODF that z/OS and the hardware both read."
  ref: { title: "IBM Docs: z/OS HCD", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-hcd" }
  aka: ["IODF", "HCM", "zDAC"]
  related: ["Channel Subsystem", "IPL", "DASD", "Systems Programmer", "PCHID", "HSA", "IOCP", "UNIT", "Control Unit", "Subchannel"]
  links:
    - title: "IBM Docs: What HCD offers you"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=it-what-hcd-offers-you"
categories: ["Hardware"]
tags: ["sysprog", "configuration"]
---

Everything attached — every device address, control unit, channel path and LPAR access rule — is described in an **IODF** built through HCD's ISPF dialog (or **HCM**, its graphical front end). The hardware gets its copy as an **IOCDS**; z/OS reads the same definitions at IPL.

Modern practice is **dynamic activation**: add a device to a running system and activate the change without an IPL. Getting an IODF wrong is one of the few ways to make a machine unbootable, so change control around it is strict.

A site keeps two kinds of IODF. The **work IODF** is the one you edit; **building a production IODF** validates it and freezes it, and only a production IODF can be activated or IPLed from. They are VSAM data sets named `hlq.IODFnn`, and the two-digit suffix is what `LOADxx` points at. One IODF usually describes every machine and every LPAR at the site, so a change for one system is visible in the definitions for all.

There are two halves to a dynamic change, and they can be done separately: the **hardware** side (channel subsystem) and the **software** side (z/OS device definitions). In a sysplex the software change is activated on each system. The hardware side can only grow into space reserved in advance in the **HSA**, which on current machines is fixed and generous. For a new machine IBM's **CHPID Mapping Tool** assigns physical ports (PCHIDs) to the channel paths you defined, and its output is fed back into HCD.
