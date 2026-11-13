---
title: "VTOC"
params:
  expansion: "Volume Table of Contents"
  short: "The directory of data sets on a single DASD volume."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is a VTOC?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_171.htm" }
  aka: ["DSCB", "format-1 DSCB", "VTOC index"]
  related: ["DASD", "Data Set", "Catalog", "CKD", "DFSMSdss", "SPACE"]
  links:
    - title: "Wikipedia: Volume Table of Contents"
      url: "https://en.wikipedia.org/wiki/Volume_Table_of_Contents"
categories: ["Storage"]
tags: ["storage", "internals"]
---

Every volume carries its own VTOC, made of **DSCB** records describing each data set's extents and attributes; an optional **VTOC index** speeds up searches. The catalog tells you *which* volume; the VTOC tells you *where on it*.

Practical relevance: a full VTOC blocks new allocations even when free space remains, and `x37` space abends are frequently about extents and fragmentation rather than raw capacity.

The DSCBs come in numbered formats. The format-4 describes the VTOC itself, a format-1 (format-8 on extended-address volumes) describes one data set and its first three extents, and format-3 records hold any further extents. ISPF option 3.4 with a volume serial, `IEHLIST LISTVTOC` and the DFSMSdss reports all read them.

The size of the VTOC is fixed when the volume is initialised with `ICKDSF`, and it limits how many data sets the volume can hold — which is why a volume full of small data sets can run out of VTOC long before it runs out of tracks.

Catalog and VTOC are independent, and they can disagree. A data set that is in a VTOC but in no catalog is *uncataloged* and can be reached only by naming its volume; a catalog entry pointing at a volume where the data set no longer exists produces a "data set not found" error at allocation. Both are routine clean-up work for storage administrators.
