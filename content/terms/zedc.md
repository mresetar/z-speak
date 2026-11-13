---
title: "zEDC"
params:
  expansion: "zEnterprise Data Compression"
  short: "Hardware-accelerated gzip-class compression on IBM Z — shrink sequential and VSAM data without burning the CPU you saved it for."
  ref: { title: "IBM Docs: zEnterprise Data Compression (zEDC) for z/OS", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=descriptions-zenterprise-data-compression-zedc-zos" }
  aka: ["zEnterprise Data Compression", "NXZ", "DFLTCC", "Integrated Accelerator for zEDC"]
  related: ["Specialty Engine", "MSU", "Data Set", "Language Environment", "Telum", "Extended Format"]
  links:
    - title: "IBM Docs: Overview and planning of zEnterprise Data Compression (zEDC)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zedc-overview-planning-zenterprise-data-compression"
categories: ["Hardware"]
tags: ["performance", "hardware", "storage"]
---

z/OS shops ship mountains of batch data between systems and keep years of it on disk and tape. **zEDC** is IBM Z's answer: a compression accelerator (the **NXZ** unit, a sibling of the zEDC NX compression the OS itself uses for its own paging) plus z/OS services that expose it through familiar APIs — the `gzjoin`/zlib-style callable services from C, COBOL and PL/I, and data set level support in DFSMS access methods.

The pitch is simple: compression at wire-and-disk speeds, billed as specialty capacity rather than general CP MIPS. A sort step or a file-transfer batch that was CPU-bound on GZIP decompression becomes a non-event, and sequential data sets shrink by the usual gzip factors — often enough to pay for the exercise in DASD alone.

What newcomers get wrong: zEDC is not a data set attribute you set and forget — the application (or the access method service, for the newer transparent forms) must actually call the compression services, and the data must be in a shape gzip tolerates. Records compressed individually waste more on per-record overhead than they save, so the design conversation is usually "compress at block level in the access method" vs "compress the whole file in the program".
