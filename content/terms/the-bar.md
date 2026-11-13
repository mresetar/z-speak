---
title: "The Line and the Bar"
params:
  expansion: "The 16 MB line and the 2 GB bar"
  short: "The two historic boundaries in a z/OS address space, left by 24-bit and 31-bit addressing and still shaping where programs and data live."
  ref: { title: "IBM Docs: Why would you use virtual storage above the bar?", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=u6bas-why-would-you-use-virtual-storage-above-bar" }
  aka: ["16 MB line", "2 GB bar", "above the bar", "below the bar", "MEMLIMIT", "31-bit", "64-bit storage"]
  related: ["AMODE and RMODE", "Virtual Storage", "Address Space", "Common Storage", "z/Architecture", "Data Space", "Java on z/OS", "ABEND", "REGION"]
  links:
    - title: "IBM Docs: What is the 64-bit address space?"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=u6bas-what-is-64-bit-address-space"
categories: ["Operating System"]
tags: ["internals", "memory", "fundamentals"]
---

An address space has grown twice, and each step left a boundary behind. System/370 addresses had 24 bits, giving 16 MB. In 1983 MVS/XA extended them to 31 bits, or 2 GB, and the old limit became **the line**. In 2001 z/Architecture brought 64-bit addresses — 16 exabytes — and the 2 GB limit, needing a different name, became **the bar**.

Because old programs must keep working, both boundaries are still real:

- **Below the line** live programs and control blocks that use 24-bit addresses. This area is small and precious; running out of it produces `S878` and `S80A` abends even on a machine with terabytes of memory.
- **Between the line and the bar** is where most programs and their ordinary working storage reside. `REGION` on a JOB or EXEC statement governs both of these areas.
- **Above the bar** is 64-bit storage, used almost entirely for data: Java heaps, Db2 buffer pools, large in-memory tables. It is obtained by different services and limited not by `REGION` but by `MEMLIMIT`.

A program's addressing mode decides how far it can reach, which is why a single AMODE 24 module in an application can force data to be kept below the line. And a Java or Db2 workload that fails for lack of memory is far more often a `MEMLIMIT` question than a region-size one.
