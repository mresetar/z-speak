---
title: "KSDS"
params:
  expansion: "Key-Sequenced Data Set (and the other VSAM organisations)"
  short: "The indexed kind of VSAM file, with records kept in key order; its siblings are the ESDS, RRDS and linear data set."
  ref: { title: "IBM Docs: Defining the VSAM key-sequenced data sets (KSDS)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=programs-defining-vsam-key-sequenced-data-sets-ksds" }
  aka: ["ESDS", "RRDS", "VRRDS", "linear data set", "DEFINE CLUSTER", "RBA"]
  related: ["VSAM", "Alternate Index", "CI and CA Splits", "System Utilities", "Catalog", "CICS", "Access Method", "RLS"]
  links:
    - title: "IBM Docs: Key-sequenced data sets"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=types-key-sequenced-data-sets"
categories: ["Storage"]
tags: ["storage", "data", "vsam"]
---

VSAM offers four ways of organising a data set, chosen when it is defined with IDCAMS:

| Type | Records are found by | Typical use |
|---|---|---|
| **KSDS** | A key field inside the record, through an index | Master files, anything looked up by account or policy number |
| **ESDS** | Position — the relative byte address — in arrival order | Logs and journals; records are only ever added at the end |
| **RRDS** | Relative record number, in numbered slots | Tables addressed by a calculated number |
| **LDS** | Nothing — it is a byte stream in 4 KB pages | Storage for Db2 table spaces and zFS file systems |

The KSDS is the one applications mean when they say "a VSAM file". It consists of a **data component** and an **index component** under one cluster name, and is defined with the key's length and offset, for example `KEYS(10 0)`. Programs can read it sequentially in key order, directly by key, or start at a key and browse onward — the pattern behind every CICS inquiry screen.

Keys are unique and cannot be changed in place, and inserts into the middle are what cause **CI and CA splits**. A second key over the same records requires an **alternate index**.
