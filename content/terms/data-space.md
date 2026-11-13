---
title: "Data Space"
params:
  expansion: "Data space and hiperspace"
  short: "An extra range of up to 2 GB of virtual storage that holds only data, which a program reaches through access registers."
  ref: { title: "Wikipedia: Dataspaces", url: "https://en.wikipedia.org/wiki/Dataspaces" }
  aka: ["hiperspace", "dataspace", "DSPSERV", "HSPSERV"]
  related: ["Access Register", "Address Space", "Virtual Storage", "VLF", "LLA", "Paging"]
  links:
    - title: "IBM Docs: What are data spaces and hiperspaces?"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=hiperspaces-what-are-data-spaces"
categories: ["Operating System"]
tags: ["internals", "memory", "zos"]
---

A 31-bit address space gives a program 2 GB, part of which is taken by the system. ESA/370 offered a way out without changing the address size: a program can create **data spaces**, each up to 2 GB, containing data only — no code runs there and no system areas are mapped in. The program addresses them with ordinary instructions in AR mode, with an **access register** selecting the space.

A **hiperspace** is the more restricted sibling: the program cannot address it directly but moves 4 KB pages between it and its own buffers through a service. Hiperspaces were designed to use the expanded storage of older machines as a fast cache.

Since 64-bit addressing arrived, a new application that needs a lot of memory simply obtains storage above the bar. But data spaces are everywhere in the system itself — **VLF** and **LLA** keep their caches in them, sort products and VSAM buffering use hiperspaces — so they turn up in dumps, RMF reports and `D A` output long after anyone stopped designing with them.
