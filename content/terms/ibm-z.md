---
title: "IBM Z"
params:
  expansion: "IBM's mainframe hardware family (z Systems)"
  short: "IBM's mainframe server line — the machine everything else in this glossary runs on."
  aka: ["mainframe", "System z", "zSeries"]
  related: ["CPC", "LPAR", "z/OS", "Telum", "Redbook", "z/TPF", "z/VSE", "Fortran"]
  ref: { title: "IBM Z product page", url: "https://www.ibm.com/z" }
  links:
    - title: "Wikipedia: IBM Z"
      url: "https://en.wikipedia.org/wiki/IBM_Z"
categories: ["Hardware"]
tags: ["platform", "hardware"]
---

IBM Z is the current name of a machine lineage that runs unbroken from the System/360 of 1964. Its selling point is not raw speed but *throughput under guarantee*: enormous I/O capacity, hardware redundancy that survives component failure without an outage, and backwards compatibility so complete that binaries compiled in the 1970s still run.

The naming has changed often — System/360, System/370, System/390, zSeries, System z, IBM Z — which is why old documentation, job titles and people's habits all use different words for the same box. The "z" stands for *zero downtime*.

A physical machine is a **CPC**; you almost never run workload on the whole machine at once, you carve it into **LPAR**s.

A new generation arrives roughly every three years: z13 in 2015, z14 in 2017, z15 in 2019, z16 in 2022 and z17 in 2025. Each has a **machine type**, and within a generation there has usually been a large model and a smaller one. Since the z15 the machines fit standard 19-inch racks and data-centre power, which removed one of the old objections to housing them. **LinuxONE** is the same hardware configured and sold for Linux only.

Capacity is not described by core counts and clock speed. It is quoted as a **model capacity identifier** and a rating in **MSU** or MIPS, and the same physical machine can be bought at many capacity settings and upgraded without changing hardware. The processors are IBM's own design — **Telum** and its successor — with unusually large caches and on-chip accelerators for compression, sorting, cryptography and AI inference. The operating systems that run on it are z/OS, z/VM, Linux, z/VSE's successor and z/TPF, often several of them on one machine at once.
