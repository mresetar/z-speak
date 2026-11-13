---
title: "DASD"
params:
  expansion: "Direct Access Storage Device"
  short: "Mainframe disk. Pronounced “dazz-dee”, and always emulating the geometry of a 3390 drive."
  ref: { title: "IBM Docs: z/OS Basic Skills — What are DASD volumes and labels?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_151.htm" }
  aka: ["volume", "3390"]
  related: ["Data Set", "VTOC", "DFSMS", "Virtual Tape", "PAV", "CKD", "EAV", "DS8000", "SPACE", "UNIT"]
  links:
    - title: "Wikipedia: Direct-access storage device"
      url: "https://en.wikipedia.org/wiki/Direct-access_storage_device"
categories: ["Storage"]
tags: ["storage", "hardware"]
---

Physically it is a modern flash or disk array (IBM DS8000, and equivalents from Hitachi and Infinidat). Logically it still presents **3390 volumes** addressed by cylinder and track, because decades of software expects that geometry.

Each volume has a six-character **VOLSER** and a **VTOC** listing the data sets on it. Sizes are quoted in *mod* multiples — a mod-9 is about 8 GB, a mod-27 about 27 GB, and **EAV** volumes go far beyond.

You will rarely place data sets on specific volumes by hand; **DFSMS** does it by policy.

The underlying format is **CKD** (count-key-data): each track holds variable-length records, each with a count field giving its length. That is unlike the fixed-block disks of other platforms, and modern arrays emulate it, which is why capacity is still requested in **tracks** and **cylinders**. A 3390 track holds about 56 KB and a cylinder is 15 tracks, roughly 850 KB; space parameters in JCL and the choice of block size both follow from those numbers.

A volume must be initialised before use — the `ICKDSF` utility writes the label and the VTOC — and then brought **online** to a system. Volumes are reached through channels using **FICON**, and one volume can have several addresses at once (**PAV** aliases) so that I/O requests do not queue behind each other. The trap for newcomers is `UNIT` and `VOL=SER` in old JCL: they place a data set on a named volume, and on an SMS-managed system they are mostly ignored.
