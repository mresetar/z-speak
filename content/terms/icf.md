---
title: "ICF"
params:
  expansion: "Internal Coupling Facility"
  short: "Processor capacity reserved to run a Coupling Facility as an LPAR on the same machine as the z/OS images."
  ref: { title: "IBM Docs: Internal Coupling Facility (ICF)", url: "https://www.ibm.com/docs/en/systems-hardware/zsystems/3931-A01?topic=considerations-internal-coupling-facility-icf" }
  aka: ["internal CF"]
  related: ["Coupling Facility", "Parallel Sysplex", "Specialty Engine", "CP", "CFCC"]
  links:
    - title: "IBM Docs: Standalone or internal coupling facility"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=planning-standalone-internal-coupling-facility"
categories: ["Hardware"]
tags: ["hardware", "sysplex", "capacity"]
---

A Coupling Facility needs processor capacity to run its control code (**CFCC**), and there are two ways to house it. An **ICF** is a processor core designated for running a CF inside an LPAR of the same CPC as the z/OS images that use it — the "internal" CF. The alternative is an *external* CF: a separate machine (historically a dedicated CF frame) linked by coupling links.

Like zIIPs and IFLs, ICF capacity is priced far below CPs, and it runs nothing but CFCC. It is the default choice: a parallel sysplex's lock, cache and list structures live in CF LPARs defined with ICF capacity, keeping structure access local and fast.

What surprises newcomers: an internal CF LPAR consumes real silicon and real power, but almost never shows up in software bills — the cost conversation for sysplex sizing is about structure sizes and CFCC utilisation, not MSUs.
