---
title: "z/Architecture"
params:
  expansion: "The 64-bit instruction set architecture of IBM Z"
  short: "The instruction set the machine actually executes — 64-bit since 2000, and still able to run 24-bit code from the 1960s."
  ref: { title: "IBM z/Architecture Principles of Operation (SA22-7832)", url: "https://publibfp.dhe.ibm.com/epubs/pdf/a227832c.pdf" }
  aka: ["ESA/390", "S/390"]
  related: ["IBM Z", "AMODE and RMODE", "HLASM", "PSW", "Interrupt"]
  links:
    - title: "Wikipedia: Z/Architecture"
      url: "https://en.wikipedia.org/wiki/Z/Architecture"
categories: ["Hardware"]
tags: ["hardware", "architecture"]
---

The lineage is System/360 (24-bit addressing, 16 MB) → System/370-XA and ESA/390 (31-bit, 2 GB) → z/Architecture (64-bit, introduced with the z900 in 2000). Each step was additive: the older addressing modes were kept, which is why a load module built decades ago still runs unmodified.

Distinctive features that shape everything above it: a **PSW** carrying both the instruction address and the execution state, hardware **decimal arithmetic** instructions, storage protection keys, and I/O delegated to channel processors rather than driven by the CPU.

Practically, "z/Architecture" is what you mean when you say a program is 64-bit capable, and `s390x` is what Linux calls the same thing.

A program sees sixteen 64-bit **general registers**, sixteen **floating-point registers** (supporting hexadecimal, binary and decimal floating point), **access registers** used to address other address spaces and data spaces, and **vector registers** for SIMD. **Control registers** belong to the operating system. Instructions are 2, 4 or 6 bytes long, and addressing is by base register plus displacement, which is why assembler listings talk constantly about `USING` and base registers.

It is a **big-endian** architecture, the opposite of x86 and most ARM systems, and character data on z/OS is EBCDIC — two separate facts that both affect ported software. New instructions arrive with each machine generation as **facilities**, which compilers target with an `ARCH` level; code compiled for a newer level fails with an operation exception (`S0C1`) on an older machine, a real consideration when a disaster-recovery site runs older hardware. The formal definition is IBM's *Principles of Operation*.
