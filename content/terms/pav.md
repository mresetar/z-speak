---
title: "PAV"
params:
  expansion: "Parallel Access Volumes"
  short: "Alias device addresses that let z/OS run several I/Os to the same disk volume at once instead of queueing them one at a time."
  ref: { title: "IBM Docs: HyperPAV based dynamic PAV alias management", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=definition-hyperpav-based-dynamic-pav-alias-management" }
  aka: ["HyperPAV", "SuperPAV", "alias", "IOSQ"]
  related: ["UCB", "DASD", "WLM", "RMF", "zHyperLink", "HCD", "Control Unit", "Subchannel"]
  links:
    - title: "IBM Docs: Using parallel access volumes for secondary devices"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=performance-using-parallel-access-volumes-secondary-devices"
categories: ["Storage"]
tags: ["storage", "io", "performance"]
---

z/OS represents a volume by one **UCB**, and a UCB can have only one I/O in flight. On a real disk that was physics; on a storage system holding the volume on flash it is an artificial bottleneck, visible in RMF as **IOSQ time** — I/Os waiting in the operating system before they are even started.

PAV removes it with **alias** addresses: extra device numbers that point at the same volume, each able to carry its own I/O. Three generations exist. *Static* PAV bound aliases to a volume in the configuration; *dynamic* PAV let **WLM** move them to where the queues were; **HyperPAV** keeps a pool of aliases per logical control unit and assigns one for the duration of a single I/O. **SuperPAV** lets a busy control unit borrow aliases from its neighbours.

Aliases are defined in the I/O configuration but never appear as volumes — you cannot allocate to one. HyperPAV is the normal setting today, and high IOSQ time now usually means too few aliases in the pool.
