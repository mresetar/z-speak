---
title: "Virtual Storage"
params:
  expansion: "Virtual, real and auxiliary storage"
  short: "“Storage” on the mainframe means memory, not disk. Say “DASD” when you mean disk."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is virtual storage?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_81.htm" }
  aka: ["storage", "real storage", "auxiliary storage"]
  related: ["Address Space", "AMODE and RMODE", "Paging", "DASD", "z/Architecture", "Data Space", "Storage Key", "Common Storage", "The Line and the Bar", "REGION"]
  links:
    - title: "IBM Docs: Virtual storage overview"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=overview-virtual-storage"
categories: ["System Services"]
tags: ["internals", "fundamentals"]
---

This is the vocabulary trap newcomers hit first. **Virtual storage** is the address space a program sees. **Real storage** ("central storage") is physical RAM. **Auxiliary storage** is the paging space on disk. A "storage shortage" message is about memory pressure; disk is always **DASD**.

Each address space gets its own virtual storage, historically split by the 16 MB **line** (24-bit) and the 2 GB **bar** (31-bit), with 64-bit space above the bar. Common areas — CSA/ECSA below the bar — are shared and finite, and a program leaking there damages the whole system rather than only itself.

The mechanics are the usual ones. Virtual storage is divided into 4 KB **pages**; real storage into **frames**; and a page not in use can be written to a **slot** in a page data set and brought back on demand. z/OS also supports 1 MB and 2 GB **large pages**, which reduce the cost of address translation for big users such as Db2 buffer pools and Java heaps. On current machines, paging is something to avoid rather than rely on, and **storage-class memory** or simply more RAM has replaced most of it.

Limits are set per address space. `REGION` on the JOB or EXEC statement caps storage below the bar, and `MEMLIMIT` caps storage above it; the default for `MEMLIMIT` is often small, which surprises people running Java. The related abends are `S878` and `S80A` (not enough virtual storage), while a real shortage shows as system messages about **auxiliary storage** filling up, which can stop the whole system.
