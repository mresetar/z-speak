---
title: "DFSMSrmm"
params:
  expansion: "Data Facility Storage Management Subsystem - removable media manager"
  short: "The tape librarian of z/OS — tracks every cartridge and virtual volume: where it is, what's on it, when it expires."
  ref: { title: "IBM Docs: z/OS DFSMSrmm", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=descriptions-dfsmsrmm" }
  aka: ["RMM", "tape management"]
  related: ["Virtual Tape", "DFSMS", "DFSMShsm", "DFSMSdss", "GDPS", "3592", "TS7700", "Tape Label"]
  links:
    - title: "IBM Docs: Managing Removable Media with DFSMSrmm"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=introduction-managing-removable-media-dfsmsrmm"
categories: ["Storage"]
tags: ["storage", "tape", "operations"]
---

Tape has no catalog and no VTOC; a data set written to a cartridge is findable only if something remembers which volume it went to. **DFSMSrmm** is that something: a inventory database of every removable volume — physical cartridges and virtual tape volumes alike — recording contents, expiry dates, locations (vault, rack, offsite) and checkout status, and controlling whether a JCL job is *allowed* to write over a tape at all.

Its main job is **retention management**: expiration dates and vital-record specifications decide when a volume becomes scratch and can be reused. That makes RMM the enforcement point of the shop's retention policy — and the thing auditors ask about. Every mount, scratch and expire leaves SMF/audit trails; the daily housekeeping runs as the `EDG`-prefixed started tasks, and `EDG` messages are what operators see.

Without a tape management system you get the classic failure: the offsite box full of cartridges nobody can identify. On many sites RMM coexists with or has replaced vendor products (CA 1, Control-M/Tape...), and the concepts — volume, data set, retention, vault — map one to one.
