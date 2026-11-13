---
title: "DCB"
params:
  expansion: "Data Control Block"
  short: "The control block in a program that describes a data set to an access method — and the JCL parameter that fills in what the program left out."
  ref: { title: "Wikipedia: Data Control Block", url: "https://en.wikipedia.org/wiki/Data_Control_Block" }
  aka: ["DCB parameter", "DCB merge", "ACB"]
  related: ["Access Method", "Record Format", "DD Statement", "QSAM", "VTOC", "ABEND", "Control Block"]
  links:
    - title: "IBM Docs: Data Control Block (DCB)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=blocks-data-control-block-dcb"
categories: ["Storage"]
tags: ["storage", "jcl", "internals"]
---

A program that uses a non-VSAM data set contains a DCB naming the DD it will open, the access method it will use, and — optionally — the record format, record length and block size. VSAM uses the equivalent **ACB**.

"Optionally" is the important word. At OPEN, the system completes the DCB in a fixed order known as the **DCB merge**: values coded in the program win, then values from the `DD` statement's `DCB=` (or `RECFM=`, `LRECL=`, `BLKSIZE=`), then values from the data set label in the VTOC. This is how one utility can copy files of any shape — it codes nothing and lets JCL and the label decide.

It is also the source of classic failures. If the attributes that end up merged contradict each other or the data, the result is an `S013` at open or an `S001` on the first read. And coding `DCB=` on a DD for an existing data set does not convert anything; it merely overrides how this one job interprets the bytes.
