---
title: "Coupling Links"
params:
  expansion: "Parallel Sysplex coupling links (IC, ICA SR, Coupling Express LR)"
  short: "The dedicated connections between z/OS images and Coupling Facilities — and the path STP uses to keep time in step."
  ref: { title: "IBM Redbooks: IBM Z Connectivity Handbook", url: "https://www.redbooks.ibm.com/abstracts/sg245444.html" }
  aka: ["ICA SR", "CE3 LR", "Coupling Express", "IC link", "CS5", "CL6", "timing-only link"]
  related: ["Coupling Facility", "Parallel Sysplex", "STP", "ICF", "GDPS", "Network Express", "CFCC"]
  links:
    - title: "IBM Docs: Coupling facility links"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=planning-coupling-facility-links"
categories: ["Hardware"]
tags: ["hardware", "sysplex", "network"]
---

A Coupling Facility is only as useful as the path to it: Db2 data sharing, GRS lock structures and XCF signalling all make CF requests in microseconds, many of them **synchronously** — the z/OS CPU waits for the answer. So coupling traffic runs on its own links, not over the network. There are three kinds on z17:

- **IC** (Internal Coupling). z/OS and the CF are LPARs on the same machine, and the "link" is memory to memory in firmware. It is the fastest and needs no hardware.
- **ICA SR 2.0** (Integrated Coupling Adapter Short Reach, CHPID type CS5). A PCIe fan-out in the processor drawer, for machines up to 150 m apart — typically the same data centre.
- **Coupling Express3 LR** (CHPID type CL5/CL6). Up to 10 km unrepeated and around 100 km through DWDM, for sysplexes that span sites. On z17 it runs on Network Express hardware.

The physics matters. Light in fibre adds about 10 microseconds per kilometre, round trip, to every CF request. At metro distances z/OS converts more requests from synchronous to asynchronous so CPUs are not stuck waiting, and the sysplex costs more CPU as a result. That is the real limit on stretching a sysplex across sites, and why GDPS designs think hard about distance. The same links also carry **STP** timing messages, which is why even a machine with no CF traffic may still need a **timing-only** link.
