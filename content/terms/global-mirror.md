---
title: "Global Mirror"
params:
  expansion: "IBM DS8000 Global Mirror"
  short: "Asynchronous, storage-based replication over unlimited distance, giving a consistent remote copy a few seconds behind production."
  ref: { title: "Wikipedia: IBM Global Mirror", url: "https://en.wikipedia.org/wiki/IBM_Global_Mirror" }
  aka: ["GM", "asynchronous mirroring", "Metro/Global Mirror", "MGM"]
  related: ["PPRC", "FlashCopy", "XRC", "GDPS", "HyperSwap"]
  links:
    - title: "IBM Docs: Global Mirror asynchronous copy for the DS8000 series"
      url: "https://www.ibm.com/docs/en/ds8870/7.3.0?topic=services-global-mirror"
categories: ["Storage"]
tags: ["storage", "disaster-recovery", "availability"]
---

Global Mirror combines two simpler functions. **Global Copy** streams updates to the remote storage system without waiting for them; periodically the primary briefly coordinates a consistency point across all volumes, and the remote site takes a **FlashCopy** of that consistent state. If production is lost, the remote site falls back to the last consistency group — typically three to five seconds old.

Because writes do not wait for the remote site, distance is not a constraint, and because the storage systems do everything, it covers z/OS, Linux and distributed volumes alike. Three- and four-site designs chain it behind Metro Mirror: synchronous nearby for continuous availability, asynchronous far away for disaster recovery.

Mind the names. *Global Mirror* is this DS8000 function; *z/OS Global Mirror* is **XRC**, a different, host-based technology that IBM is retiring.
