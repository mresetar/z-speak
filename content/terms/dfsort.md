---
title: "DFSORT"
params:
  expansion: "Data Facility Sort"
  short: "The sort/merge utility — and, through its control statements, a surprisingly capable batch data transformer."
  ref: { title: "IBM Docs: z/OS DFSORT", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-dfsort" }
  aka: ["SORT", "Syncsort", "ICETOOL"]
  related: ["JCL", "System Utilities", "Data Set", "Copybook", "Sequential Data Set", "Temporary Data Set", "Easytrieve", "SAS"]
  links:
    - title: "Wikipedia: DFSORT"
      url: "https://en.wikipedia.org/wiki/DFSORT"
categories: ["Development"]
tags: ["batch", "data", "tooling"]
---

Sorting is a large fraction of what mainframe batch actually does, and DFSORT is heavily optimised for it. But most real uses are not sorts: `INCLUDE`/`OMIT` to filter, `INREC`/`OUTREC` to reformat and compute, `SUM` to aggregate, `JOINKEYS` to join two files, `OUTFIL` to split one input into many outputs.

```jcl
//SORT EXEC PGM=SORT
//SYSIN DD *
  SORT FIELDS=(1,8,CH,A)
  INCLUDE COND=(20,2,CH,EQ,C'GB')
  OUTREC FIELDS=(1,8,20,2,30,7,PD,TO=ZD)
/*
```

Plenty of "programs" in a batch suite are really a sort step with clever control cards. **ICETOOL** is the higher-level driver over it, and **Syncsort MFX** (now Precisely) is the compatible competitor — the control statements are close enough that shops swap between them.

Fields are described by position, length and format rather than by name: `(1,8,CH,A)` is eight bytes from column 1, character, ascending. Formats include `CH`, `ZD` (zoned), `PD` (packed), `BI` and `FI` (unsigned and signed binary). Positions are counted from 1 — and for variable-length records the first four bytes are the record descriptor word, so data starts in column 5, a mistake almost everyone makes once. **Symbols** let you give fields names and keep the positions in one place.

The program is invoked as `SORT` or `ICEMAN`, reads `SORTIN`, writes `SORTOUT`, and reports in `SYSOUT`; work space is obtained dynamically, and COBOL's `SORT` verb calls it internally. A plain `SORT FIELDS=COPY` is a fast, flexible copy utility. On recent machines the **Z Sort** hardware accelerator speeds up large sorts. The messages are worth reading after a run: `ICE054I` gives record counts in and out, which is the quickest check that a filter did what you meant.
