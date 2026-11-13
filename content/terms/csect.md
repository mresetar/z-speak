---
title: "CSECT"
params:
  expansion: "Control Section"
  short: "A named block of assembler code and data — the unit the assembler and binder process and link together."
  ref: { title: "IBM Docs: HLASM — CSECT instruction", url: "https://www.ibm.com/docs/en/hla-and-tf/1.6.0?topic=statements-csect-instruction" }
  aka: ["DSECT", "RSECT", "control section"]
  related: ["HLASM", "Load Module", "AMODE and RMODE", "Copybook", "GOFF", "Binder", "Reentrant Code"]
  links:
    - title: "IBM Docs: Sections"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=modules-sections"
categories: ["Development"]
tags: ["assembler", "development"]
---

A `CSECT` is the fundamental chunk of an assembler program: everything between one `PROG CSECT` directive and the next is one control section, which the assembler translates and the binder later places into a load module. Large modules are commonly split across several CSECTs — separately assembled, then bound together — which is how external references and entry points (`EXTERNAL`, `ENTRY`) earn their keep.

The `DSECT` (dummy control section) is its sibling: a layout map of storage that occupies no space in the load module but lets you code `USING` field names against an address — the assembler's answer to the copybook, and the reason assembler and COBOL structures meet in mapping macros.

People get caught out by scope: labels are local to a CSECT, so you cannot branch into another CSECT by label, and data you want shared must be passed by address or declared external. Read a listing and CSECTs are also how you navigate — the assembler listing, the binder map and the dump are all organised by control section.
