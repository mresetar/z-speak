---
title: "VSAM"
params:
  expansion: "Virtual Storage Access Method"
  short: "The indexed file system of z/OS — keyed record access without a database."
  related: ["Data Set", "CICS", "Catalog", "DFSMS", "Record Format", "Access Method", "KSDS", "Alternate Index", "CI and CA Splits", "RLS", "Easytrieve"]
  ref: { title: "IBM Docs: z/OS Basic Skills — What is VSAM?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_169.htm" }
  aka: ["VSAM cluster", "VSAM file", "LDS"]
  links:
    - title: "Wikipedia: Virtual Storage Access Method"
      url: "https://en.wikipedia.org/wiki/Virtual_Storage_Access_Method"
categories: ["Storage"]
tags: ["storage", "data"]
---

Four cluster types, of which one dominates:

- **KSDS** — key-sequenced; read by primary key, alternate indexes optional. This is the one people mean.
- **ESDS** — entry-sequenced; append-only, addressed by RBA
- **RRDS** — relative record; addressed by slot number
- **LDS** — linear; a raw byte space, used underneath Db2 and zFS

Enormous amounts of business data still live in VSAM files read directly by CICS and batch COBOL. It gives you keyed access, sharing and record locking, but no schema, no SQL and no referential integrity — that logic lives in the application, which is exactly what makes VSAM-to-relational migrations hard.

`IDCAMS` is the utility for defining, copying, listing and repairing clusters.

A VSAM data set is a **cluster**: a catalog entry tying together a **data component** and, for a KSDS, an **index component**. Data is stored in **control intervals** (CIs), the unit read and written, which are grouped into **control areas** (CAs). Inserting into a full CI causes a **split**, and many splits degrade sequential performance until the file is reorganised by unloading and reloading it. Free space left in each CI and CA at load time is the tuning knob that delays this.

Sharing is governed by **SHAREOPTIONS**, and the common settings do not make concurrent updates from several address spaces safe by themselves. That is the job of CICS, which owns the file and serialises access, or of **RLS** (record-level sharing), which moves locking and buffering into a system address space using the Coupling Facility. Programs see problems as a **file status** in COBOL or a return and reason code; status 35 means the file was not found, 23 record not found, and 97 that VSAM verified the file after an improper close. An empty KSDS cannot be opened for input until it has been loaded once.
