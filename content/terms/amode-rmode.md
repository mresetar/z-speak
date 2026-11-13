---
title: "AMODE and RMODE"
params:
  expansion: "Addressing mode / Residency mode"
  short: "How wide a program's addresses are, and where in storage it may be loaded — 24-, 31- or 64-bit."
  ref: { title: "IBM z/Architecture Principles of Operation (SA22-7832)", url: "https://publibfp.dhe.ibm.com/epubs/pdf/a227832c.pdf" }
  aka: ["above the line", "below the line"]
  related: ["z/Architecture", "Virtual Storage", "Load Module", "HLASM", "The Line and the Bar", "Binder", "C/C++"]
  links:
    - title: "IBM Docs: Addressing mode and residency mode"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=addressing-mode-residency-mode"
categories: ["Development"]
tags: ["internals", "development"]
---

**AMODE** is how a program forms addresses while running; **RMODE** is where the loader may place it. `AMODE(31),RMODE(ANY)` is the normal setting for modern code. `RMODE(24)` forces a module **below the line** — into the scarce first 16 MB — which is why an old module can fail to load on a busy system even though there is plenty of memory.

The **line** is 16 MB (the 24-bit limit) and the **bar** is 2 GB (the 31-bit limit). Programs can switch AMODE at run time, and mixed-mode call chains are common in old code — a source of subtle corruption when a 31-bit caller passes an address to a 24-bit callee that quietly truncates it.

The values are set when the program is built. The compiler or assembler records a default in each object module, and the **binder** decides the final attributes of the load module from its options and from the modules it combines — the most restrictive setting wins, so one old `RMODE(24)` routine linked in drags the whole module below the line. `AMODE(64)` exists for code that addresses storage above the bar directly; most 64-bit exploitation is by products and by Java rather than by application code.

In practice you meet the terms in three places. In binder output and in ISPF's member list for a load library, where the attributes are shown per module. In COBOL, where the `DATA(24)` and `DATA(31)` and `RMODE` options control where working storage is obtained, important when calling old subroutines. And in abends: `S0C4` after a call between programs with different modes is often an address that lost its top bits. The high-order bit of a 31-bit address word being used as a flag is the historical reason 31 bits, not 32, was the limit.
