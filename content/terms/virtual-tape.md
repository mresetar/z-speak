---
title: "Virtual Tape"
params:
  expansion: "Virtual Tape Library / Tape Volume Cache"
  short: "Tape volumes emulated on disk — sequential datasets for backup, archive and bulk interchange."
  ref: { title: "IBM Docs: IBM TS7700 Virtual Tape Library", url: "https://www.ibm.com/docs/en/ts7700-virtual-tape" }
  aka: ["VTL", "cartridge"]
  related: ["DFSMS", "DFSMShsm", "DFSMSrmm", "DASD", "GDG", "3592", "OAM", "TS7700", "UNIT", "Tape Label"]
  links:
    - title: "Wikipedia: Virtual tape library"
      url: "https://en.wikipedia.org/wiki/Virtual_tape_library"
categories: ["Storage"]
tags: ["storage", "backup"]
---

Applications still write to "tape" — `UNIT=TAPE`, a volume serial, a mount request — but a virtual tape system such as the IBM TS7700 satisfies it from a disk cache, optionally destaging to real cartridges or replicating to another site.

Tape has survived because sequential bulk workloads (nightly dumps, archives, data exchange with other institutions) suit it, and because the offline copy is a good answer to ransomware. **DFSMSrmm** or a vendor tape manager tracks the inventory and retention.

Inside a virtual tape server each volume is a file in a disk **cache**. If the server has real tape behind it, volumes migrate out of the cache over time, and reading an old one means a **recall** that can take minutes — the reason a restore job sometimes sits waiting on a mount that looks instant on paper. Two or more servers can form a **grid** that replicates volumes between sites, which has largely replaced trucks carrying cartridges to a vault.

z/OS sees the server as a tape library with a large number of virtual drives, managed through **SMS** and **OAM**; an ACS routine decides which data sets go there. Because virtual volumes are cheap, the old practice of stacking many files on one cartridge matters less, but tape rules still apply: a tape data set cannot be shared by two jobs at once, and a volume is not reusable until the tape manager returns it to **scratch** status.
