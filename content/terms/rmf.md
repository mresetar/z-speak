---
title: "RMF"
params:
  expansion: "Resource Measurement Facility"
  short: "The performance monitor that samples and reports what the system's resources are doing."
  ref: { title: "IBM Docs: z/OS RMF", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-rmf" }
  aka: ["Monitor I", "Monitor III", "RMF Postprocessor"]
  related: ["SMF", "WLM", "Paging", "MLC", "OMEGAMON", "SAS"]
  links:
    - title: "Wikipedia: Resource Measurement Facility"
      url: "https://en.wikipedia.org/wiki/Resource_Measurement_Facility"
categories: ["System Services"]
tags: ["performance", "observability"]
---

RMF has three faces: **Monitor I** for interval reports written as SMF type 70–79, **Monitor II** for point-in-time snapshots, and **Monitor III** for near-real-time delay analysis — the one you open when something is slow right now, because it shows what work is waiting *for*.

The equivalent product from BMC is CMF; reports and record types are compatible, so tooling generally works with either.

The records behind the reports are worth recognising: type 70 is processor activity, 71 paging, 72 workload activity — the per-service-class view of response times and goal achievement that WLM tuning depends on — and 73 to 78 cover channels, devices, the Coupling Facility and more. The **Postprocessor**, a batch program, turns stored SMF data into reports for any period; Monitor III is an ISPF dialog; and a Distributed Data Server feeds web front ends and the z/OSMF Resource Monitoring task.

The same data drives more than tuning. Capacity planning, sub-capacity software billing and service-level reporting all read the type 70 and 72 records, so the measurement interval and the retention of SMF data are decisions with consequences.

RMF is an optional priced feature. Since z/OS 2.5 the collection side has been split off as a separate element, the z/OS Data Gatherer, with RMF as the reporting layer on top — so a system can be gathering the data without being licensed for the reports.
