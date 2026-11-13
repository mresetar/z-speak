---
title: "Specialty Engine"
params:
  expansion: "zIIP, IFL, ICF, zAAP"
  short: "Processors that run only certain workloads, priced far below general-purpose CPs."
  ref: { title: "IBM z17 announcement — Telum II and Spyre", url: "https://newsroom.ibm.com/z17" }
  aka: ["zAAP", "specialty engines"]
  related: ["CPC", "CP", "MSU", "zEDC", "Linux on IBM Z", "Coupling Facility", "zIIP", "IFL", "ICF"]
  links:
    - title: "Wikipedia: Z Application Assist Processor"
      url: "https://en.wikipedia.org/wiki/Z_Application_Assist_Processor"
categories: ["Hardware"]
tags: ["cost", "hardware", "capacity"]
---

Physically these are the same processor cores as a general-purpose **CP**; firmware restricts what may be dispatched on them. The point is licensing: software charged by MSU does not count specialty-engine capacity.

- **zIIP** — Integrated Information Processor: Java, Db2 parallel queries, TCP/IP, XML, much of z/OS Connect
- **IFL** — Integrated Facility for Linux: Linux and z/VM only
- **ICF** — Internal Coupling Facility: runs the CFCC in a Coupling Facility LPAR
- **zAAP** — retired; its Java workload folded into the zIIP

"zIIP-eligible" is a phrase you will hear in every cost conversation. Moving work onto zIIPs is one of the standard levers for reducing mainframe software bills.

Eligibility is decided by the software, not the user. A product marks portions of its work as eligible, and the dispatcher sends that work to a zIIP if one is free; if the zIIPs are busy, the work can **cross over** to a general-purpose processor, where it is charged like anything else. Performance reports therefore show how much eligible work ran on CPs, and that number is what tells you whether more zIIP capacity would pay for itself. A zIIP that is too busy can also slow the workload that depends on it.

There are rules. The number of zIIPs a machine may have is tied to the number of general-purpose engines purchased, the ratio having been relaxed on recent generations. Specialty engines run at full speed even when the general-purpose ones are **sub-capacity** models running slower. They are assigned to LPARs like any other processor, with their own weights. And IFLs cannot run z/OS at all — which is the technical basis for Linux pricing.
