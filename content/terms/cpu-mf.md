---
title: "CPU MF"
params:
  expansion: "CPU Measurement Facility"
  short: "Hardware counters built into every IBM Z core, collected on z/OS as SMF 113 — the raw truth behind capacity planning."
  ref: { title: "IBM Support: Collecting CPU MF counters on z/OS", url: "https://www.ibm.com/support/pages/system/files/inline-files/Detailed_CPU_MF_Counters_Enablement_Instructions_September_2019.pdf" }
  aka: ["CPU Measurement Facility", "HIS", "Hardware Instrumentation Services", "SMF 113", "CP3KEXTR"]
  related: ["SMF", "RMF", "RNI", "LSPR", "SMT", "LPAR"]
  links:
    - title: "IBM Docs: Hardware Instrumentation Services"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=aids-hardware-instrumentation-services"
categories: ["Hardware"]
tags: ["performance", "capacity", "observability"]
---

The processor counts what it does: cycles, instructions, cache misses at each level and where they were resolved, crypto and accelerator activity, and extended counters that change with every machine generation. CPU MF makes those counters available to the operating system with negligible overhead. There is also a sampling facility for detailed diagnosis.

On z/OS they are collected by **HIS** (Hardware Instrumentation Services), a started task that writes the counters to **SMF type 113** records at each interval. Two things have to be in place: counter access authorized for the LPAR in its activation profile on the HMC/SE, and HIS started, usually automatically at IPL. z/OS running as a z/VM guest cannot collect them.

The records exist mainly for capacity work. They are the input for computing **RNI** and the LSPR workload category, so tools like zPCR (fed by IBM's CP3KEXTR extract program) can size a new machine from your real workload instead of a generic average. That is also why IBM recommends collecting them **all the time**, not only when planning an upgrade. The comparison that matters is before and after a change, and the before data cannot be collected later.
