---
title: "PPRC"
params:
  expansion: "Peer-to-Peer Remote Copy"
  short: "Disk-to-disk replication between storage systems; in its synchronous form, Metro Mirror, no write completes until both sites have it."
  ref: { title: "Wikipedia: Peer to Peer Remote Copy", url: "https://en.wikipedia.org/wiki/Peer_to_Peer_Remote_Copy" }
  aka: ["Metro Mirror", "Global Copy", "PPRC-XD", "synchronous mirroring"]
  related: ["HyperSwap", "GDPS", "Global Mirror", "XRC", "FlashCopy", "DASD", "DS8000", "Subchannel"]
  links:
    - title: "IBM Docs: Peer-to-Peer Remote Copy (PPRC)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=copy-peer-peer-remote-pprc"
categories: ["Storage"]
tags: ["storage", "disaster-recovery", "availability"]
---

PPRC is the family of replication functions in which the primary storage system itself sends updates to a secondary one, with no host software in the data path. The name survives in commands and messages; the marketing names are what people say.

**Metro Mirror** is synchronous PPRC. A write is not reported complete to the application until the secondary has it, so the two copies are always identical and the recovery point is zero. The price is added response time on every write, which limits it to metropolitan distances — roughly up to 300 km. **Global Copy** is the asynchronous, non-consistent variant, used for migration and as a building block of **Global Mirror**.

Identical copies are what make **HyperSwap** possible. Mirroring is not a backup, though: a deletion or a corrupt update is replicated to the other site just as faithfully as a good one.
