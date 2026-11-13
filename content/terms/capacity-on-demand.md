---
title: "Capacity on Demand"
params:
  expansion: "On/Off CoD, CBU, CIU"
  short: "Extra processor capacity already installed in the machine, unlocked temporarily when you need it."
  ref: { title: "IBM Z — Capacity on Demand", url: "https://www.ibm.com/it-infrastructure/z/capabilities/capacity-on-demand" }
  aka: ["CoD", "CBU", "dark capacity", "CPE", "LICCC", "On/Off CoD", "System Recovery Boost", "Flexible Capacity"]
  related: ["MSU", "CPC", "GDPS", "Specialty Engine", "LSPR", "RAS", "SAS"]
  links:
    - title: "IBM Docs: Introducing z/OS Capacity Provisioning"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=started-introducing-zos-capacity-provisioning"
categories: ["Hardware"]
tags: ["capacity", "cost"]
---

Mainframes ship with more physical cores than you have paid to use. Activating them is a licence action, not an installation: minutes, not a procurement cycle.

- **On/Off CoD** — temporary extra capacity for a peak (year end, a promotion), billed for the period used
- **CBU** (Capacity Backup Upgrade) — pre-paid capacity you may activate at a disaster-recovery site when the primary is lost, and which you are expected to test
- **CIU** (Customer Initiated Upgrade) — a permanent upgrade activated online

The consequence for planning is that "we need more CPU" is usually a pricing conversation rather than a hardware one.

Each offering exists on the machine as an installed **record**, ordered in advance through IBM's Resource Link and then activated from the HMC or by an API call. A machine can hold several records, and more than one can be active at once. Other types you may meet: **CPE** (Capacity for Planned Event), used to cover a planned outage or data centre move, and on recent generations **Flexible Capacity for Cyber Resiliency**, which allows capacity to be shifted between sites for longer periods than a test.

The hardware charge is only part of the cost. Extra general-purpose capacity raises the machine's MSU rating, and software licensed by capacity can become more expensive while the record is active, so the decision to switch it on usually involves the people who manage software contracts. And temporary really is temporary: records expire, tests under CBU are limited in number and length, and the added engines must be given to LPARs — by changing weights or bringing logical processors online — before any workload benefits.
