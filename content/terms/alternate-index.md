---
title: "Alternate Index"
params:
  expansion: "VSAM alternate index (AIX) and path"
  short: "A second index over a VSAM data set, letting programs find records by a field other than the primary key."
  ref: { title: "IBM Docs: Defining alternate indexes", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sets-defining-alternate-indexes" }
  aka: ["AIX", "PATH", "BLDINDEX", "upgrade set", "alternate key"]
  related: ["KSDS", "VSAM", "System Utilities", "COBOL", "CICS", "CI and CA Splits", "Db2 Index", "IMS Secondary Index"]
  links:
    - title: "IBM Docs: Alternate Indexes"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=database-alternate-indexes"
categories: ["Storage"]
tags: ["storage", "data", "vsam"]
---

A KSDS is keyed by one field. To look up the same customer records by surname as well as by customer number, you build an alternate index. It is itself a KSDS: its key is the alternate field, and each of its records lists the primary keys of the base records holding that value. Alternate keys may be unique or, unlike the primary key, non-unique.

Three IDCAMS steps create one. `DEFINE ALTERNATEINDEX` describes it, `DEFINE PATH` creates the name through which programs will access the base data by the alternate key, and `BLDINDEX` reads the base cluster and loads the index. A program opens the **path**, not the index — in COBOL the file has an `ALTERNATE RECORD KEY` and the JCL carries an extra DD for each path.

Whether the index stays current is a definition choice. An index in the **upgrade set** is updated automatically whenever the base cluster changes, at the price of extra I/O on every insert. One that is not goes stale and must be rebuilt.

The usual accident is reloading or reorganising the base cluster and forgetting that its alternate indexes must be rebuilt with it.
