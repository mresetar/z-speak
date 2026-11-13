---
title: "MLC"
params:
  expansion: "Monthly License Charge"
  short: "The traditional IBM software pricing model on Z — billed on capacity, which is why MSUs and zIIPs dominate cost conversations."
  ref: { title: "IBM Docs: Monthly license charge (MLC) software pricing", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=framework-monthly-license-charge-mlc-software-pricing" }
  aka: ["sub-capacity pricing", "software pricing", "SCRT", "Tailored Fit Pricing"]
  related: ["MSU", "Specialty Engine", "zIIP", "CPC"]
  links:
    - title: "IBM Docs: Sub-capacity pricing planning tasks"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=pricing-sub-capacity-planning-tasks"
categories: ["Modern Z"]
tags: ["cost", "capacity"]
---

**MLC** is how IBM's core z/OS software — z/OS itself, CICS, Db2, IMS, MQ — has traditionally been charged: a price per MSU of capacity, defined per product, per machine. At full capacity the bill is fixed and predictable; with **sub-capacity pricing** (IBM's "workload license charges", measured via **SCRT** reports from SMF data) you pay for the rolling four-hour-average MSUs each LPAR actually used — which is why the **R4HA** number in capacity meetings is a financial figure, not a technical one.

The consequence shapes mainframe architecture. Anything that reduces measured MSUs — zIIP offload, capping LPARs, shifting batch peaks — saves real money, and vendors advertise "zIIP-eligible" as a pricing feature. IBM's newer **Tailored Fit Pricing** replaces per-MSU billing with a contracted consumption envelope, trading the peak-sensitivity for predictability.

The newcomer confusion is usually direction: on distributed platforms, licensing follows cores you bought; on Z it follows capacity you *used* (sub-capacity) or defined, so "we have spare cycles" does not mean "it's free", and an unplanned batch spike can be visible on an invoice.
