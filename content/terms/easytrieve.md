---
title: "Easytrieve"
params:
  expansion: "Easytrieve Report Generator (Broadcom)"
  short: "A compact report-writing and data-extraction language from Broadcom, in which a file layout and a few lines produce a formatted batch report."
  ref: { title: "Wikipedia: Easytrieve", url: "https://en.wikipedia.org/wiki/Easytrieve" }
  aka: ["Easytrieve Plus", "CA Easytrieve", "Easytrieve Report Generator", "EZT", "EZTPA00", "EZTRIEVE", "JOB INPUT", "Easytrieve macro"]
  related: ["COBOL", "DFSORT", "SAS", "Copybook", "Sequential Data Set", "VSAM", "Db2 for z/OS", "JCL", "File Manager"]
categories: ["Development"]
tags: ["language", "batch", "legacy"]
---

**Easytrieve** exists because writing a COBOL program for every ad hoc report is slow. It is a small, English-like language aimed at one job: read files, select and summarise records, print a report. It dates from the late 1960s, passed through Pansophic and Computer Associates, and is now a Broadcom product; most long-established sites have thousands of Easytrieve programs in production.

A program has three parts. The **library** section describes the input: `FILE` statements and field definitions giving each field's start position, length and type (`A` alphanumeric, `N` zoned, `P` packed, `B` binary). An **activity** section holds the logic — `JOB INPUT filename` reads the file automatically, record by record, with `IF` tests and assignments. A **REPORT** declaration names the sort sequence, control breaks, titles and the fields on each line, and Easytrieve does the page formatting, totals and subtotals itself.

It is usually run interpretively: the JCL executes `EZTPA00` with the source in `SYSIN`, so there is no separate compile and link, though programs can also be compiled into load modules. It reads sequential and VSAM files, IMS and Db2, can match two sorted files with synchronised processing, and can call COBOL subroutines. **Macros** hold shared file layouts, much as copybooks do.

For a newcomer the important thing is to recognise it. A batch step with `PGM=EZTPA00` and what looks like half-COBOL in the input stream is Easytrieve, and its field definitions — positions and lengths — are often the only description of a file. Much new reporting work is done instead with DFSORT's ICETOOL, SQL, or off-platform tools.
