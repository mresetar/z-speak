---
title: "z/OS"
params:
  expansion: "z/OS operating system"
  short: "The flagship mainframe operating system — where CICS, Db2, IMS and batch actually run."
  aka: ["OS/390", "zOS"]
  related: ["MVS", "z/OS UNIX", "JES", "WLM", "Address Space"]
  ref: { title: "IBM Docs: z/OS", url: "https://www.ibm.com/docs/en/zos" }
  links:
    - title: "Wikipedia: Z/OS"
      url: "https://en.wikipedia.org/wiki/Z/OS"
categories: ["Operating System"]
tags: ["zos", "platform"]
---

z/OS is the descendant of OS/360 → MVS → OS/390, 64-bit since z/OS 1.2. It is built around workload management, isolation between address spaces, and a security manager that mediates access to every resource.

Two personalities live in one system: the traditional MVS side (data sets, JCL, batch, subsystems) and **z/OS UNIX**, a certified UNIX with a hierarchical file system, shell and TCP/IP stack. Modern tooling — Java, Node.js, Python, Zowe, Git — lives on the UNIX side, and the interesting engineering is usually where the two meet.

A new release arrives roughly every two years — z/OS 2.5 in 2021, 3.1 in 2023, 3.2 in 2025 — with new function delivered continuously in between through the service stream. Each release is supported for about five years, and IBM supports migrating directly from either of the two previous releases, so many sites skip every other one. z/OS 2.5 left standard support on 30 September 2026, which leaves 3.1 and 3.2 as the supported releases.

What ships under the name is a large package: a **base** of elements that always come together — the control program, JES2, DFSMSdfp, Communications Server, TSO/E, ISPF, z/OS UNIX, Language Environment — and **optional features**, some priced separately, such as RACF, SDSF, DFSORT, RMF and the DFSMS components beyond the base. Everything else you think of as "the mainframe" — CICS, Db2, IMS, MQ, the compilers — is a separate product running on top.

It is ordered and installed as a **ServerPac** through z/OSMF and maintained with SMP/E. Each release needs a minimum hardware level, so operating system and machine upgrades are planned together; z/OS 3.1, for instance, requires a z14 or later. A running system is one **image**, with a system name, in one LPAR, and several images are commonly joined in a sysplex. The licence cost is tied to capacity used, not to the number of installations.
