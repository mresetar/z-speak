---
title: "Capping"
params:
  expansion: ""
  short: "Deliberately limiting the processor capacity an LPAR or workload may consume — mostly to control the software bill."
  ref: { title: "IBM Docs: z/OS MVS Planning: Workload Management — Defining the capacity of a partition", url: "https://www.ibm.com/docs/en/SSLTBW_3.1.0/com.ibm.zos.v3r1.ieaw100/ieaw10046.htm" }
  aka: ["soft capping", "hard capping", "defined capacity", "DC", "group capacity", "absolute capping", "initial capping", "AbsMSUcapping", "soft cap", "capped LPAR"]
  related: ["MSU", "MLC", "LPAR", "PR/SM", "WLM", "HMC", "HiperDispatch", "Capacity on Demand", "RMF", "zIIP", "Batch Window"]
  links:
    - title: "IBM Docs: Workload management and Workload License Charges"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=participants-workload-management-workload-license-charges"
    - title: "IBM Docs: How the peak four-hour rolling average MSU value is determined"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=hdscpw-how-peak-four-hour-rolling-average-msu-value-is-determined"
categories: ["Hardware"]
tags: ["cost", "capacity", "performance"]
---

A mainframe usually has more capacity installed than its owner wants to pay software charges for. Capping is how the difference is enforced, and there are several kinds that behave very differently.

| Kind | Set where | What it limits |
|---|---|---|
| **Initial (hard) capping** | LPAR image profile | The LPAR never exceeds its weight-based share |
| **Absolute capping** | LPAR image profile | A fixed number of processors, e.g. 2.5 CPs, whatever the weights |
| **Defined capacity** (soft cap) | LPAR image profile, in MSU | The LPAR's rolling four-hour average |
| **Group capacity** | HMC, for a named group of LPARs | The combined four-hour average of the group |
| **Resource group** | WLM policy | Specific service classes inside z/OS |

**Soft capping** is the one tied to sub-capacity pricing. WLM tracks the LPAR's rolling four-hour average MSU consumption; while the average stays under the defined capacity, the LPAR may use as much as its weight allows. Once the average reaches the limit, WLM asks PR/SM to cap the LPAR, and it stays capped until the average falls again.

That mechanism is what people misread. A soft cap of 400 MSU does not mean the LPAR never runs above 400 — it can run well above for hours after a quiet period. And when the cap does engage, it arrives suddenly and holds the LPAR at the limit, usually at the worst moment: the online day following a heavy batch night. WLM then decides who suffers, by importance, so a correct WLM policy is the difference between a slow test system and a slow payment service.

Group capacity softens this by letting LPARs borrow unused allowance from each other. Under Tailored Fit Pricing, where the bill no longer follows the four-hour peak, many sites remove soft caps altogether and keep only absolute caps as a safety limit.
