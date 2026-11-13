---
title: "System Utilities"
params:
  expansion: "IEBGENER, IEBCOPY, IDCAMS, IEFBR14 and friends"
  short: "The small IBM-supplied programs that batch JCL calls to copy, compare, list and delete things."
  ref: { title: "IBM Docs: z/OS Basic Skills — Guide to z/OS utility program functions", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zdatamgmt/zsysprogr_utilities_guide.htm" }
  aka: ["IEBGENER", "IEFBR14", "IDCAMS"]
  related: ["JCL", "Data Set", "VSAM", "DFSORT"]
  links:
    - title: "Wikipedia: Support programs for OS/360 and successors"
      url: "https://en.wikipedia.org/wiki/Support_programs_for_OS/360_and_successors"
categories: ["Development"]
tags: ["batch", "tooling"]
---

The names follow a 1960s convention — `I` for IBM, then the owning group: `IEB` data set utilities, `IEH` system utilities, `IEF` job management, `IDC` access method services.

The ones worth recognising:

| Program | What it does |
|---|---|
| `IEFBR14` | Nothing at all — two instructions. Used when the `DD` statements alone should create or delete data sets |
| `IEBGENER` | Copy a sequential data set; the classic "cat" of JCL |
| `IEBCOPY` | Copy PDS members and compress a PDS |
| `IDCAMS` | Access method services: define, delete, list and repro VSAM clusters, GDGs and catalogs |
| `IEBCOMPR` | Compare two data sets |
| `IEHLIST` | List a VTOC or PDS directory |

`IEFBR14` deserves the fame: it exists purely so a step can run with no program logic, letting the JCL's `DISP` parameters do the work. Its name is the assembler instruction that returns immediately — `BR 14`.
