---
title: "Data Set"
params:
  expansion: "Data set (not “dataset”, and not a file)"
  short: "The traditional MVS unit of stored data — a named, pre-allocated, record-structured container."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is a data set?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_datasetintro.htm" }
  aka: ["DSN", "DSNAME"]
  related: ["DASD", "VSAM", "PDS", "Catalog", "DD Statement", "Record Format", "Access Method", "DCB", "SPACE", "Sequential Data Set"]
  links:
    - title: "Wikipedia: Data set (IBM mainframe)"
      url: "https://en.wikipedia.org/wiki/Data_set_(IBM_mainframe)"
categories: ["Storage"]
tags: ["storage", "fundamentals"]
---

A data set is not a byte stream. It has a **record format** (`RECFM=FB`, `VB`, `U`), a **record length** (`LRECL`), a block size, and space allocated in tracks or cylinders up front. Programs read records, not bytes.

Names are up to 44 characters in dot-separated **qualifiers**, uppercase: `PROD.PAYROLL.MASTER.G0042V00`. The first qualifier (the **HLQ**) usually drives both security rules and storage placement, so naming standards are a real design decision, not cosmetics.

The main kinds: **sequential** (PS), **partitioned** (PDS/PDSE, a one-level directory of members), and **VSAM** for keyed and record-oriented access. Separately, z/OS UNIX files in **zFS** behave like ordinary UNIX files — two storage worlds in one operating system.

Creating one is called **allocation**, and you state the size in advance: a primary amount and a secondary amount that can be taken a limited number of times as **extents**. When those run out the job abends with `B37`, `D37` or `E37` — "out of space" even though the disk has plenty free. `RECFM=FB` means fixed-length records grouped into blocks; `VB` means variable-length, each with a four-byte prefix; `U` is undefined, used for load modules. There are no line-end characters inside a record.

Access is controlled twice over. `DISP` on the DD statement decides whether you share the data set or hold it exclusively for the life of the job, and RACF decides whether you may open it at all. A data set is found through the **catalog**, which records the volume it is on. Names follow rules — each qualifier one to eight characters, starting with a letter or national character — and in TSO a name without quotes has your user ID added in front, a small trap that produces many "data set not found" messages.
