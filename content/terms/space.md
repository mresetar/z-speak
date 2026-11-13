---
title: "SPACE"
params:
  expansion: "SPACE parameter, extents and the x37 abends"
  short: "The JCL parameter that says how much disk a new data set may take, in a first piece and a limited number of further pieces."
  ref: { title: "IBM Docs: SPACE parameter", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-space-parameter" }
  aka: ["extent", "primary allocation", "secondary allocation", "B37", "D37", "E37", "RLSE", "out of space", "AVGREC"]
  related: ["DD Statement", "Data Set", "DASD", "VTOC", "PDS", "SMS Classes", "Extended Format", "Record Format", "ABEND"]
categories: ["Storage"]
tags: ["jcl", "storage", "batch"]
---

A z/OS data set does not grow freely. When it is created you state a size: `SPACE=(CYL,(50,10),RLSE)` asks for 50 cylinders at once (the **primary** amount) and permission to take 10 more at a time (the **secondary**) when it fills. Each piece is an **extent**. The unit can be tracks (`TRK`), cylinders (`CYL`), blocks, or — with `AVGREC` — a number of records, which is the friendliest form.

The limits explain the famous abends. A basic sequential data set or PDS may have at most 16 extents on a volume; PDSEs, extended-format and VSAM data sets allow about 123. When a data set needs space and cannot get it, the job ends with **B37** (no more extents, or no room on the volume), **D37** (no secondary amount was specified) or **E37** (a PDS, or a multi-volume data set, could go no further). The disk farm may be nearly empty; what ran out was this data set's permission to grow.

For a PDS a third number reserves **directory blocks** — `SPACE=(CYL,(5,1,20))` — and running out of those also stops new members. `RLSE` returns unused space when the data set is closed, which matters when estimates are generous.

With SMS, a **data class** can supply the space values, and attributes such as *space constraint relief* and *extended format* let the system reduce the primary amount or spread it over volumes rather than fail. That is why modern JCL often omits SPACE altogether, and old JCL is full of carefully tuned numbers.
