---
title: "CP"
params:
  expansion: "Central Processor"
  short: "A general-purpose processor core on IBM Z — the kind everything is measured, licensed and argued about."
  ref: { title: "IBM Docs: Specialty processors (CP vs zIIP/IFL/ICF)", url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=architectures-specialty-processors" }
  aka: ["central processor", "GP", "general-purpose processor"]
  related: ["CPC", "Specialty Engine", "zIIP", "MSU", "LPAR"]
categories: ["Hardware"]
tags: ["hardware", "capacity", "cost"]
---

A **CP** is a general-purpose processor core: it may execute any instruction for any workload — z/OS, Linux, Db2, CICS, batch, everything. In capacity conversations "we need two more CPs" is the baseline request, and CP capacity is what MSU counts and what MLC software is licensed against. Every LPAR's defined weight and capping applies to CPs; specialty engines are the exceptions defined against them.

Watch the three-letter collision. On IBM Z hardware, CP means Central Processor. In z/VM, **CP** means the **Control Program** — the hypervisor itself (`CP QUERY`, "CP-led" commands) — a completely different thing that shares the abbreviation. Context usually disambiguates: capacity discussions mean the processor, z/VM shops mean the control program.

The companion terms: a CPC holds many CPs; **zIIP/IFL/ICF** are CPs with firmware restrictions and lower software cost; a model's CP count and speed is the first thing anyone asks about a new machine.
