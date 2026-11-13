---
title: "CSI"
params:
  expansion: "Consolidated Software Inventory"
  short: "The SMP/E database — VSAM data sets recording every installed product, element and fix, organised into zones."
  ref: { title: "IBM Docs: z/OS — The SMP/E zones and CSI", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=csi-smpe-zones" }
  aka: ["global zone", "target zone", "distribution zone", "SMP/E zones"]
  related: ["SMP/E", "SYSMOD", "VSAM", "ServerPac"]
  links:
    - title: "IBM Docs: The consolidated software inventory (CSI)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=work-consolidated-software-inventory-csi"
categories: ["System Services"]
tags: ["smp-e", "sysprog", "maintenance"]
---

The CSI is SMP/E's memory: a set of VSAM data sets that describe what software is installed, which elements belong to which product, what fixes have been applied, and what each SYSMOD requires. SMP/E's verbs — RECEIVE, APPLY, ACCEPT, RESTORE — are just operations against this inventory.

A CSI is divided into three **zones**:

- **Global zone** — the index: every SYSMOD that has been RECEIVEd, plus the list of all target and distribution zones; one per CSI
- **Target zone** — the libraries a running system actually executes from (one or more per CSI)
- **Distribution zone** — the backup/master copies from which target libraries are built

There can be many CSIs on one system — typically separate ones for the operating system, each middleware product, and test systems — which is how one z/OS image can maintain different software inventories independently.

When people say a product is "installed in SMP/E", they mean its FMID and elements are catalogued in a CSI. Delete the CSI (or point SMP/E at the wrong one) and the system no longer knows the product exists.
