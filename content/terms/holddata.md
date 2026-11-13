---
title: "HOLDDATA"
params:
  expansion: "SMP/E exception SYSMOD data (++HOLD statements)"
  short: "Statements telling SMP/E that a fix must not be applied yet — because it is in error, or needs an action first."
  ref: { title: "IBM Docs: SMP/E — HOLDDATA", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=types-holddata" }
  aka: ["++HOLD", "PE", "PTF in error", "HOLDSYSTEM", "HOLDERROR", "Enhanced HOLDDATA", "BYPASS"]
  related: ["SMP/E", "PTF", "APAR", "SYSMOD", "CSI", "ServerPac"]
  links:
    - title: "IBM Docs: How to process HOLDDATA"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=holddata-how-process"
categories: ["System Services"]
tags: ["maintenance", "sysprog", "smp-e"]
---

A PTF can be perfectly built and still be something you should not blindly apply. HOLDDATA is how that knowledge reaches SMP/E. A `++HOLD` statement names a SYSMOD and a reason, and SMP/E then refuses to `APPLY` or `ACCEPT` it until the reason is resolved or explicitly bypassed.

There are three kinds. An **error hold** marks a PE — a PTF in error, found defective after release — and lifts automatically once you also apply the PTF that fixes it. A **system hold** travels inside the PTF and says something must be done: take an `ACTION`, read documentation, `IPL`, apply a dependent fix in another product. A **user hold** is one you set yourself.

Error holds are discovered after the PTFs ship, so the HOLDDATA on your system ages. Good practice is to receive the current **Enhanced HOLDDATA** from IBM immediately before every apply, and to run `REPORT ERRSYSMODS` to learn whether anything already installed has since been found in error.

System holds are cleared with `BYPASS(HOLDSYSTEM(…))`. That operand is a signature saying you have read the hold text and done what it asks — not a switch for making the apply go through.
