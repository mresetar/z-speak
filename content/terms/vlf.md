---
title: "VLF"
params:
  expansion: "Virtual Lookaside Facility"
  short: "A z/OS service that keeps frequently used named objects in data spaces so that components can avoid repeated I/O."
  ref: { title: "IBM Docs: The virtual lookaside facility (VLF)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-virtual-lookaside-facility-vlf" }
  aka: ["COFVLFxx", "VLF class", "virtual lookaside facility"]
  related: ["LLA", "Data Space", "PARMLIB", "Started Task", "RACF", "Catalog", "CLIST"]
  links:
    - title: "IBM Docs: Virtual lookaside facility"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=concepts-virtual-lookaside-facility"
categories: ["Operating System"]
tags: ["performance", "sysprog", "internals"]
---

VLF is a general-purpose cache that other components plug into. It runs as a started task, holds objects in **data spaces**, and hands them back on request by name. Each exploiter owns a **class**, declared in PARMLIB member `COFVLFxx` with a storage limit.

The users are what matter. **LLA** stores copies of frequently loaded modules. TSO/E stores compiled CLISTs and REXX execs from named libraries. RACF caches group and user security information, and the catalog address space can keep catalog records there.

VLF is an optimisation and nothing depends on it for correctness: if it is stopped, exploiters go back to doing the I/O. That makes its effect easy to overlook — a system where the VLF task failed to start runs correctly and just more slowly, with slower program fetch and logons.
