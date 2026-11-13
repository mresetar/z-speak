---
title: "ABEND"
params:
  expansion: "Abnormal End"
  short: "A program or job terminating abnormally, identified by a system or user completion code."
  ref: { title: "IBM Docs: z/OS Basic Skills — Overview of an abend", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=abend-overview" }
  aka: ["S0C7", "abend code"]
  related: ["JCL", "SDSF", "COBOL", "Packed Decimal", "Fault Analyzer", "SLIP", "Dump", "REGION", "ESTAE", "Checkpoint/Restart"]
  links:
    - title: "Wikipedia: Abnormal end"
      url: "https://en.wikipedia.org/wiki/Abnormal_end"
categories: ["System Services"]
tags: ["troubleshooting", "batch"]
---

Codes come in two families. **System** codes are hexadecimal with an `S` prefix; **user** codes are decimal with a `U` prefix and are issued by the application or a product.

The ones you will meet first:

| Code | Meaning |
|---|---|
| `S0C7` | Data exception — non-numeric data in a packed decimal field |
| `S0C4` | Protection exception — bad address, the mainframe segfault |
| `S806` | Module not found — library missing from STEPLIB |
| `S822` / `S878` | Not enough region (memory) |
| `SB37` / `SD37` / `SE37` | Out of space on a data set extent |
| `S013` | Data set open failure, usually a DCB mismatch |

`S0C7` is close to a rite of passage: it almost always means uninitialised or spaces-filled data reaching a `COMP-3` field.
