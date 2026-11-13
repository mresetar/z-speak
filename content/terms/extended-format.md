---
title: "Extended Format"
params:
  expansion: "Extended-format data sets"
  short: "A variant of sequential and VSAM data sets that unlocks striping, compression, encryption and sizes beyond 4 GB."
  ref: { title: "IBM Docs: Processing extended-format sequential data sets", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sets-processing-extended-format-sequential-data" }
  aka: ["DSNTYPE=EXTREQ", "striping", "extended addressability", "compressed data set", "EF"]
  related: ["SMS Classes", "DFSMS", "VSAM", "zEDC", "Pervasive Encryption", "Data Set", "EXCP", "EAV", "SPACE", "Sequential Data Set"]
  links:
    - title: "IBM Docs: Restrictions on defining extended-format data sets"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sets-restrictions-defining-extended-format-data"
categories: ["Storage"]
tags: ["storage", "sms", "performance"]
---

An extended-format data set looks the same to an application as an ordinary one but is stored with a little extra control information in each block, which lets the system do things the basic format cannot. It must be SMS-managed, and is normally requested through a **data class** — or with `DSNTYPE=EXTREQ` or `EXTPREF` in JCL.

What it enables is the reason to care:

- **Striping** — a sequential data set is spread across several volumes and read or written on all of them in parallel, for throughput.
- **Compression** — transparent to the program, including hardware-assisted **zEDC** compression.
- **Extended addressability** — VSAM data sets larger than 4 GB.
- **Data set encryption** — the pervasive-encryption function requires extended format.

Because the feature set has grown, many sites now make extended format the default for new data sets.

The limits are few but real. The data set must be read and written through the standard access methods, so old programs that issue their own channel programs cannot use it, and tools that copy data sets must understand the format to preserve its attributes.
