---
title: "CI and CA Splits"
params:
  expansion: "Control interval and control area splits"
  short: "What VSAM does when a record must go into a block that is full: move half the contents elsewhere — correct, but costly."
  ref: { title: "IBM Docs: Control interval splits", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=considerations-control-interval-splits" }
  aka: ["control interval", "control area", "CI split", "CA split", "FREESPACE", "CISIZE", "LISTCAT"]
  related: ["KSDS", "VSAM", "Alternate Index", "System Utilities", "Record Format", "DASD"]
  links:
    - title: "IBM Docs: Control interval splits (performance)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=pc-control-interval-splits"
categories: ["Storage"]
tags: ["storage", "performance", "vsam"]
---

VSAM stores records in **control intervals** — its unit of disk I/O, typically 4 KB — and groups control intervals into **control areas**, usually a cylinder each. In a KSDS the records within a control interval, and the control intervals within a control area, are kept in key sequence.

Inserting a record where there is no room forces a rearrangement. If the control interval is full, VSAM moves about half its records to an empty control interval in the same control area: a **CI split**. If the control area has no empty control interval, VSAM allocates a new control area at the end of the data set and moves half the control intervals there: a **CA split**, which is much more expensive.

Splits are not errors and the data remains correct, but they cost I/O at the moment they occur, and afterwards the data is no longer physically in key order, which slows sequential processing.

Two tools manage them. `FREESPACE(ci-percent ca-percent)` in the definition leaves room for inserts when the file is loaded. And `LISTCAT` reports the number of splits; when it has grown, the file is reorganised — unloaded, redefined and reloaded.
