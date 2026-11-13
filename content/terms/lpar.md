---
title: "LPAR"
params:
  expansion: "Logical Partition"
  short: "A hardware-isolated virtual machine on a CPC, with its own operating system."
  ref: { title: "IBM Redbook: Partitioning Implementations (LPAR / PR/SM)", url: "https://www.redbooks.ibm.com/redbooks/pdfs/sg247039.pdf" }
  aka: ["logical partition", "partition", "image"]
  related: ["PR/SM", "CPC", "z/OS", "IPL"]
  links:
    - title: "Wikipedia: Logical partition"
      url: "https://en.wikipedia.org/wiki/Logical_partition"
categories: ["Hardware"]
tags: ["virtualization", "hardware"]
---

An LPAR is a slice of a CPC — processors, memory and I/O paths — running its own copy of z/OS, z/VM, Linux or z/TPF. Isolation is enforced by firmware (**PR/SM**) and is certified at Common Criteria EAL5+, which is why a production LPAR and a test LPAR can safely share one machine.

A shop typically runs a handful: `PROD`, `TEST`, `DEV`, maybe a Linux one. You "IPL an LPAR" the way you boot a server. Processors can be dedicated to an LPAR or shared with weights, so unused capacity flows to whoever needs it.

Each LPAR has its own definition of what it may use. **Logical processors** are mapped onto the machine's physical ones; the number defined limits how much an LPAR can ever use, and its **weight** sets the share it is guaranteed when the machine is busy. Memory, by contrast, is not shared: it is assigned to an LPAR and stays there. I/O devices appear only if the I/O configuration grants that LPAR access, and channels can be shared between LPARs.

Limits and terms worth knowing: current machines support up to 85 LPARs. An LPAR can be **capped** so that it cannot exceed a set capacity, which matters because software charges are often based on the peak rolling four-hour average of what each LPAR consumes. And an LPAR is not a sysplex member by itself — several LPARs, on one machine or several, are joined into a sysplex by software. Newcomers also meet "the LPAR" used loosely to mean the z/OS system running in it, with its **SYSNAME**.
