---
title: "HDAM and HIDAM"
params:
  expansion: "Hierarchical Direct and Hierarchical Indexed Direct Access Methods"
  short: "The two main IMS database organisations: HDAM finds a root by hashing its key, HIDAM through an index."
  ref: { title: "IBM Docs: IMS — HDAM, PHDAM, HIDAM, and PHIDAM databases", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=types-hdam-phdam-hidam-phidam-databases" }
  aka: ["HDAM", "HIDAM", "PHDAM", "PHIDAM", "HALDB", "randomizer", "OSAM", "HISAM"]
  related: ["IMS", "Segment", "DL/I", "PSB", "Fast Path", "VSAM", "KSDS", "IMS Status Code", "IMS Secondary Index"]
  links:
    - title: "IBM Docs: IMS 15.5: Converting a database from HIDAM to HDAM"
      url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=types-converting-database-from-hidam-hdam"
categories: ["Middleware"]
tags: ["ims", "database", "storage"]
---

Both organisations store segments with direct pointers from parent to child and from twin to twin. They differ in how the root segment is found.

**HDAM** passes the root key through a **randomizing routine** that computes where the record should be stored. A direct read is therefore close to a single I/O, with no index to search or maintain. The price is that roots are not in key sequence, so "read every customer in order" is not something the database can do efficiently.

**HIDAM** keeps a separate index database on the root key. Direct access costs a little more, but roots can be processed sequentially by key.

The choice follows from the application: purely random access by key suits HDAM; anything that also runs through the data in key order suits HIDAM.

The names with a `P` — **PHDAM** and **PHIDAM** — are the partitioned forms, known together as **HALDB**. A database is divided into as many as 1,001 partitions that can be managed, reorganised and recovered independently, which removes the old size limits and allows reorganisation while the database remains online.

The data sets underneath are OSAM or VSAM. Older organisations such as HISAM exist but are rare; the very high-volume alternative is the **Fast Path** DEDB.
