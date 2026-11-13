---
title: "Telum"
params:
  expansion: "IBM Telum and Telum II processors"
  short: "The chip in current IBM Z machines, with an on-chip AI accelerator for inference inside a running transaction."
  ref: { title: "IBM — Telum on IBM Z", url: "https://www.ibm.com/products/z/telum" }
  aka: ["Telum II", "AIU", "NNPA", "Integrated Accelerator for AI"]
  related: ["IBM Z", "CPC", "Spyre Accelerator", "CPACF", "Pervasive Encryption", "DPU", "SMT", "RNI", "HiperDispatch"]
  links:
    - title: "Wikipedia: IBM Telum"
      url: "https://en.wikipedia.org/wiki/IBM_Telum"
categories: ["Hardware"]
tags: ["hardware", "ai"]
---

Telum introduced two things that matter outside the hardware team. First, a redesigned cache hierarchy where each core's large private L2 can be borrowed by neighbours as virtual L3/L4 — good for the sprawling working sets typical of batch and transaction workloads.

Second, an on-chip **AIU** (AI accelerator) that lets a model score inside a running transaction — fraud detection on a payment while the payment is still in flight, rather than in a batch sweep afterwards.

**Telum II**, shipping in the z17 from June 2025, has eight cores at 5.5 GHz and 36 MB of L2 per core, with an accelerator rated at 24 TOPS — around four times the first generation. IBM quotes over 450 billion inference operations a day at roughly one millisecond latency. Larger models go to the PCIe-attached **Spyre Accelerator** instead.
