---
title: "XRC"
params:
  expansion: "Extended Remote Copy (z/OS Global Mirror)"
  short: "Asynchronous disk replication driven by z/OS itself: a System Data Mover reads updates from the primary disks and applies them at a remote site."
  ref: { title: "Wikipedia: Extended Remote Copy", url: "https://en.wikipedia.org/wiki/Extended_Remote_Copy" }
  aka: ["z/OS Global Mirror", "zGM", "SDM", "System Data Mover"]
  related: ["Global Mirror", "PPRC", "GDPS", "DFSMS", "STP"]
  links:
    - title: "IBM Docs: How extended remote copy (XRC) works"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=copy-how-extended-remote-xrc-works"
categories: ["Storage"]
tags: ["storage", "disaster-recovery", "legacy"]
---

XRC replicates over any distance without slowing the application. The primary control unit timestamps each write and holds a copy; a **System Data Mover** — part of DFSMS, normally running at the recovery site — reads those updates, sorts them into time-consistent groups across all volumes, and writes them to the secondary disks. The remote copy is a few seconds behind but always consistent.

Because the host does the work, XRC only ever protected z/OS data (and other data on CKD volumes that carried timestamps), and it needed real processor capacity at the recovery site. It was the basis of **GDPS** XRC configurations.

It is easy to confuse with **Global Mirror**, which reaches the same goal inside the storage systems. IBM has chosen that one: it announced z/OS 2.5 as the last release to support z/OS Global Mirror, and 2.5 left standard support in September 2026, so XRC is now something you migrate away from.
