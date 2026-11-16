---
title: "Julian Date"
params:
  expansion: ""
  short: "Mainframe shorthand for a date written as year plus day-of-year — 2026.320 is 16 November 2026."
  ref: { title: "Wikipedia: Ordinal date", url: "https://en.wikipedia.org/wiki/Ordinal_date" }
  aka: ["ordinal date", "yyddd", "yyyyddd", "yy.ddd", "day of year", "0cyydddF", "99365", "1999/365"]
  related: ["JCL", "DD Statement", "Tape Label", "SMF", "VTOC", "Catalog", "COBOL", "REXX", "DFSORT", "Packed Decimal", "TOD Clock"]
  links:
    - title: "IBM Docs: z/OS MVS JCL Reference — EXPDT subparameter definition"
      url: "https://www.ibm.com/docs/en/SSLTBW_3.1.0/com.ibm.zos.v3r1.ieab600/iea3b6_Subparameter_definition20.htm"
    - title: "IBM Docs: Enterprise COBOL — date intrinsic functions"
      url: "https://www.ibm.com/docs/en/cobol-zos/6.3.0?topic=functions-function-definitions"
categories: ["Development"]
tags: ["fundamentals", "data", "batch"]
---

The system has always preferred to store a date as a year and a day number from 001 to 366. It is compact, it sorts correctly, and the difference between two dates in the same year is a subtraction. The correct name is **ordinal date**; "Julian" is what everyone on the platform calls it, and it has nothing to do with the astronomers' Julian Day count or the Julian calendar.

You meet it almost immediately:

- Job logs and system messages print dates as `2026.320`.
- A data set's creation and expiry dates in the VTOC and in `LISTCAT` output are in this form.
- JCL takes it directly: `EXPDT=2027/001`.
- SMF records carry the date as packed decimal `0cyydddF`, where `c` is 0 for 19xx and 1 for 20xx.
- REXX returns it with `DATE('J')`, COBOL with `ACCEPT … FROM DAY YYYYDDD`.

Converting in your head is the hard part, because every day number after 28 February shifts by one in a leap year. Day 060 is 1 March in most years and 29 February in a leap year. Let the tools do it: COBOL has `INTEGER-OF-DAY` and `DAY-OF-INTEGER`, DFSORT converts between date forms in a control statement, and ISPF and most schedulers show a Julian calendar.

Some values are not dates at all. An expiry date of `99365`, `99366`, `1999/365` or `1999/366` means **never scratch** — the data set is not deleted or overwritten — a convention that predates the year 2000 and survived it. Two-digit `yyddd` fields in old files still need a window to decide the century, which is where most surviving date bugs live.
