---
title: "Access Method"
params:
  expansion: "Access method (QSAM, BSAM, BPAM, BDAM, VSAM, OAM)"
  short: "The system code that sits between a program's READ or WRITE and the channel program that actually moves the data."
  ref: { title: "Wikipedia: Access method", url: "https://en.wikipedia.org/wiki/Access_method" }
  aka: ["AM", "data management"]
  related: ["QSAM", "BPAM", "BDAM", "VSAM", "OAM", "DCB", "EXCP", "Data Set"]
  links:
    - title: "IBM Docs: Access methods"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sets-access-methods"
categories: ["Storage"]
tags: ["storage", "fundamentals"]
---

z/OS has no single "file API". A program picks an access method that matches how the data set is organised, and the access method builds the channel programs, handles blocking and buffering, and deals with errors. The choice is declared in the **DCB** (or the ACB, for VSAM).

| Access method | For |
|---|---|
| **QSAM** / BSAM | Sequential data sets and PDS members, record by record or block by block |
| **BPAM** | The directory of a PDS or PDSE |
| **BDAM** | Direct access by block address — legacy |
| **VSAM** | Keyed, entry-sequenced and relative-record clusters |
| **OAM** | Unstructured objects and tape library management |
| **EXCP** | No access method at all — the program drives the device itself |

The newcomer's trap is the word "method": these are not techniques but bodies of IBM code, loaded into your address space and called through macros such as `GET`, `PUT`, `READ` and `WRITE`. High-level languages hide them — a COBOL `READ` on a sequential file is QSAM underneath.
