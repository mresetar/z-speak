---
title: "EAV"
params:
  expansion: "Extended Address Volume"
  short: "A disk volume larger than the old 54 GB limit of a 3390 — up to 1 TB — made possible by a wider cylinder address."
  ref: { title: "IBM Docs: Extended address volume (EAV) considerations", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=volumes-extended-address-volume-eav-considerations" }
  aka: ["3390 Model A", "EAS", "cylinder-managed space", "EATTR", "USEEAV"]
  related: ["DASD", "VTOC", "CKD", "UCB", "PAV", "SMS Classes", "Extended Format"]
  links:
    - title: "IBM Docs: Controlling allocations to extended address volumes (EAVs)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=eavs-controlling-allocations-extended-address-volumes"
categories: ["Storage"]
tags: ["storage", "hardware", "sysprog"]
---

A 3390 volume was limited to 65,520 cylinders, about 54 GB, because a cylinder number had 16 bits. Disk subsystems could hold far more, so installations ended up with tens of thousands of small volumes, each needing a device number. An extended address volume widens the cylinder address to 28 bits, and a single volume can now be as large as 1 TB.

The volume is divided in two. The first 65,520 cylinders are **track-managed space** and behave exactly as before. Everything above is **cylinder-managed space**, where space is handed out in units of 21 cylinders and data sets are described by new VTOC record formats.

Not every data set may live up there. Whether one is eligible depends on its type and on its `EATTR` attribute — `EATTR=OPT` permits it — and the system must have EAV use switched on.

For most users the change is invisible: a data set is on a big volume and nothing else differs. It matters to storage administrators, who must check that older software tolerates the new formats, and to anyone who still thinks of a "3390-3" as the size of a disk.
