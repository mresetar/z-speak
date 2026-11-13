---
title: "FlashCopy"
params:
  expansion: "IBM FlashCopy point-in-time copy"
  short: "A storage-system function that makes an instant point-in-time copy of a volume or data set without the host moving any data."
  ref: { title: "Wikipedia: FlashCopy", url: "https://en.wikipedia.org/wiki/FlashCopy" }
  aka: ["point-in-time copy", "fast replication", "snapshot", "FCESTABL"]
  related: ["DFSMSdss", "DFSMShsm", "DASD", "Global Mirror", "PPRC", "Db2 for z/OS", "Safeguarded Copy", "DS8000", "REORG", "Image Copy"]
  links:
    - title: "IBM Docs: What is FlashCopy?"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=flashcopy-what-is"
categories: ["Storage"]
tags: ["storage", "backup", "availability"]
---

When a FlashCopy relationship is established, the disk subsystem records a bitmap and the target is usable within seconds as a copy of the source *as it was at that instant*. Tracks are physically copied in the background, or — with the no-copy option — only when the source is about to be overwritten.

You seldom ask for it by name. **DFSMSdss** uses it automatically for a `COPY` when source and target are in the same storage system ("fast replication"), **DFSMShsm** uses it for fast-replication backups, and Db2's `BACKUP SYSTEM` relies on it. Typical uses are taking a consistent backup without stopping the workload for hours, and cloning production data for testing.

A FlashCopy is not a backup on its own: it lives in the same box as the source. It protects against logical damage and gives you something stable to dump to tape, not against losing the storage system.
