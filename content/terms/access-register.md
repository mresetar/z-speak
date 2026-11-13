---
title: "Access Register"
params:
  expansion: "Access register (AR mode)"
  short: "One of sixteen registers that say which address space or data space a base register refers to, letting a program reach beyond its own."
  ref: { title: "Wikipedia: Access register", url: "https://en.wikipedia.org/wiki/Access_register" }
  aka: ["AR mode", "ALET", "ASC mode", "ALET access list"]
  related: ["Data Space", "Address Space", "z/Architecture", "PSW", "HLASM", "Virtual Storage"]
  links:
    - title: "IBM Docs: Using access registers"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-using-access-registers"
categories: ["Operating System"]
tags: ["internals", "architecture", "assembler"]
---

Each general register has a companion access register. When a program runs in **AR mode** — a setting in the PSW — every storage reference is resolved in two steps: the general register supplies the address, and the matching access register supplies an **ALET**, a token that selects *which* address space or data space that address is in. An ALET of zero means "my own".

The design arrived with ESA/370 and solved a real limit: 2 GB of addressability. With access registers a program can address many 2 GB **data spaces**, or data in another address space, with ordinary instructions and without the cost of switching address spaces. ALETs index an access list that the system controls, so a program can only reach spaces it was granted.

Application programmers almost never see this; it is assembler-level plumbing used by subsystems such as Db2 and by system services. It also has an afterlife on Linux for IBM Z, which uses access registers 0 and 1 to hold the thread-local storage pointer.
