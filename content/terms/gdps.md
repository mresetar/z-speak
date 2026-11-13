---
title: "GDPS"
params:
  expansion: "Geographically Dispersed Parallel Sysplex"
  short: "IBM's automation layer for cross-site failover and disaster recovery of a sysplex."
  ref: { title: "IBM Docs: GDPS", url: "https://www.ibm.com/docs/en/gdps" }
  aka: ["GDPS Metro", "GDPS Global", "GDPS Continuous Availability"]
  related: ["Parallel Sysplex", "DASD", "Coupling Facility", "PPRC", "HyperSwap", "Global Mirror", "NetView", "System Automation", "Safeguarded Copy"]
  links:
    - title: "Wikipedia: GDPS"
      url: "https://en.wikipedia.org/wiki/GDPS"
categories: ["Hardware"]
tags: ["availability", "disaster-recovery"]
---

GDPS wraps disk mirroring (Metro Mirror for synchronous, Global Mirror for asynchronous distances) and sysplex automation into scripted, tested recovery. A site failure triggers a defined sequence: freeze the mirror, restart systems at the recovery site, restore workload.

The variants differ mainly in distance and data-loss tolerance: **GDPS/PPRC** for zero data loss within metro distance, **GDPS/GM** and **GDPS/XRC** for continental distances with a small RPO, **GDPS/MGM** combining both.

IBM has renamed the offerings, and both sets of names are in use: **GDPS Metro** (formerly GDPS/PPRC), **GDPS Global – GM** and **Global – XRC**, **GDPS Metro Global** for three- and four-site configurations, and **GDPS Continuous Availability** (formerly Active/Active), which replicates at the software level between two independent sysplexes any distance apart.

GDPS is delivered as a service engagement more than as a product. It runs on NetView and System Automation in dedicated **controlling systems** — the K-systems — which are deliberately kept off the mirrored disks so that they survive the failure they are meant to manage.

Two numbers frame every design: the **recovery point objective**, how much data may be lost, and the **recovery time objective**, how long until service resumes. The **freeze** function protects the first by suspending mirroring consistently at the first sign of trouble; **HyperSwap** improves the second by making a disk failure invisible to applications.

What GDPS cannot supply is confidence without rehearsal. Its scripts are only as good as the last test, which is why planned site switches are run as a regular exercise.
