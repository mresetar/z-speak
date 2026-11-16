---
title: "MSU"
params:
  expansion: "Million Service Units per hour"
  short: "The capacity unit mainframe software is licensed by — and therefore the number everyone watches."
  ref: { title: "IBM Docs: Workload management and Workload License Charges", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=participants-workload-management-workload-license-charges" }
  aka: ["MIPS", "R4HA"]
  related: ["LSPR", "MLC", "Specialty Engine", "WLM", "SMF", "CPU MF", "SAS", "Capping"]
  links:
    - title: "IBM Docs: How the peak four-hour rolling average MSU value is determined"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=hdscpw-how-peak-four-hour-rolling-average-msu-value-is-determined"
categories: ["Hardware"]
tags: ["cost", "capacity"]
---

MSU measures work a machine or LPAR performs, and traditional **MLC** (monthly licence charge) software has historically been billed on the **rolling four-hour average** of it — so a single peak sets the bill for the month. That fact shapes real architectural decisions: shifting batch windows, capping LPARs, and moving work onto zIIPs, which do not count.

**MIPS** is the older informal unit still used in conversation; roughly, 1 MSU is on the order of a hundred MIPS, but the ratio varies by machine model and the vendor tables are what count.

Newer models — **Tailored Fit Pricing** and container pricing — bill on consumption or a fixed envelope instead, which removes some of the peak-chasing but not the need to measure.
