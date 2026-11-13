---
title: "Record Format"
params:
  expansion: "RECFM / LRECL / BLKSIZE"
  short: "How bytes are laid out inside a z/OS data set — fixed or variable, blocked or spanned — and the source of half of all first-week JCL errors."
  ref: { title: "IBM Docs: z/OS Basic Skills — Data set record formats", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=set-data-record-formats" }
  aka: ["RECFM", "LRECL", "BLKSIZE", "record length"]
  related: ["Data Set", "JCL", "VSAM", "DFSMS", "DCB", "SPACE", "Sequential Data Set", "FTP"]
  links:
    - title: "IBM Docs: Selecting record formats for Non-VSAM data sets"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=files-selecting-record-formats-non-vsam-data-sets"
categories: ["Storage"]
tags: ["data", "jcl", "beginner"]
---

z/OS sequential and PDS data sets store records, not byte streams, and `RECFM` says how record boundaries are found:

| RECFM | Meaning |
|---|---|
| `F` | Fixed — every record is exactly `LRECL` bytes |
| `FB` | Fixed, **B**locked — fixed records packed into blocks for efficiency; the default shape of batch files |
| `V` | Variable — each record carries a 4-byte length prefix (`RDW`) |
| `VB` | Variable, blocked — the workhorse for output whose length varies |
| `U` | Undefined — no enforced structure; load libraries use it |
| `FBA`/`VBA` | Fixed/variable with ANSI **printer control** characters — carriage control, hence the `1` that makes a report skip to a new page |

`LRECL` is the record length (for `V`/`VB`, including the 4-byte prefix — a common off-by-four surprise) and `BLKSIZE` is how many records share one physical block; modern devices accept `BLKSIZE=0`, meaning "choose the best". When a program's view disagrees with the data set's truth, you get `I/O error`, truncated reports, or a `S0C7` in a COBOL program reading packed numbers from misaligned records.

The newcomer reflex to unlearn: expecting files to be "just bytes" like on Unix. A copybook-mismatched record or a report written with `RECFM=FBA` to a viewer that prints control characters — these are the classic first-week mysteries.
