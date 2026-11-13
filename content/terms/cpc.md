---
title: "CPC"
params:
  expansion: "Central Processor Complex"
  short: "One physical mainframe box — the frame, its processors, memory and I/O."
  ref: { title: "IBM Docs: z/OS Basic Skills — Mainframe hardware: Terminology", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zmainframe/zconc_mfhwterms.htm" }
  aka: ["CEC", "machine", "footprint"]
  related: ["CP", "IBM Z", "LPAR", "PR/SM", "HMC", "Specialty Engine"]
categories: ["Hardware"]
tags: ["hardware"]
---

The CPC is the physical unit: cabinets containing processor drawers, memory, I/O drawers and redundant power. Older documentation calls it the **CEC** (Central Electronic Complex) and the terms are used interchangeably in practice.

A single CPC hosts many logical machines. When someone says "we have two boxes", they mean two CPCs — usually in two data centres, so that a **Parallel Sysplex** can survive losing one.

Each CPC is identified by a **machine type** — 3931 for a z16, 9175 for a z17 — and a serial number, together with a model capacity identifier that states how much processor capacity is switched on. Software licences are tied to those, which is why moving a workload to another CPC is a contractual event as well as a technical one.

Inside a current machine are one to four processor drawers holding the processor chips and memory, I/O drawers for the adapter cards, and two Support Elements, all in standard 19-inch frames and managed from the HMC. Which role each physical processor plays — CP, zIIP, IFL or ICF — is assigned by licensed microcode, not by the hardware.

Bringing a CPC up is a two-stage affair: a **power-on reset** loads an I/O configuration and establishes the LPARs, and then each LPAR is activated and IPLed separately. The CPC's name, set at the HMC, is the one that appears in `D M=CPU` output and in sysplex and automation definitions.
