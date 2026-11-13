---
title: "CKD"
params:
  expansion: "Count Key Data"
  short: "The mainframe disk format: variable-length records on tracks, each with a count field, an optional key, and the data."
  ref: { title: "Wikipedia: Count key data", url: "https://en.wikipedia.org/wiki/Count_key_data" }
  aka: ["ECKD", "Extended Count Key Data", "CCHHR", "FBA"]
  related: ["DASD", "VTOC", "FICON", "Record Format", "Linux on IBM Z"]
  links:
    - title: "IBM Docs: Volume layout and record formats on CKD devices"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-volume-layout-record-formats-ckd-devices"
categories: ["Storage"]
tags: ["storage", "hardware", "fundamentals"]
---

On a CKD disk the unit of storage is not a fixed 512-byte sector but a **record** on a **track**. Each record carries a count field (its address and lengths), an optional key the control unit can search on, and a data area of whatever length the writer chose. Locations are given as cylinder, head and record — `CCHHR`. This is why z/OS space is still allocated in tracks and cylinders, and why block size matters so much.

**ECKD** is the extended command set introduced with cached control units and used by everything current. The rest of the world uses fixed-block architecture (**FBA**) instead.

No one has built a real CKD disk for decades. A DS8000 stores data on flash in fixed blocks and *emulates* 3390 CKD volumes, geometry and all. Linux on IBM Z can use either: ECKD volumes through the `dasd` driver, or SCSI LUNs over FCP.
