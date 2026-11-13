---
title: "QSAM"
params:
  expansion: "Queued Sequential Access Method"
  short: "The everyday access method for sequential data — the system blocks, deblocks and buffers; the program just asks for the next record."
  ref: { title: "Wikipedia: Queued Sequential Access Method", url: "https://en.wikipedia.org/wiki/Queued_Sequential_Access_Method" }
  aka: ["BSAM", "Basic Sequential Access Method", "GET/PUT"]
  related: ["Access Method", "DCB", "Record Format", "Data Set", "BPAM", "Sequential Data Set"]
  links:
    - title: "IBM Docs: Queued Sequential Access Method"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=methods-queued-sequential-access-method"
categories: ["Storage"]
tags: ["storage", "batch", "internals"]
---

With QSAM a program issues `GET` and `PUT` and deals in **logical records**. The access method reads whole blocks ahead of the program, hands records out one at a time, and on output packs records into blocks and writes them when a buffer fills. Almost every batch program that reads a flat file — COBOL, PL/I, the sort, the utilities — is using QSAM.

**BSAM** is the "basic" sibling: the program issues `READ` and `WRITE` for whole **blocks**, does its own deblocking, and must `CHECK` each I/O for completion. It exists for programs that need control — utilities, compilers, anything that repositions with `NOTE` and `POINT`.

"Queued" refers to the queue of buffers the system manages, not to any kind of message queue. And because the last block is only written when the data set is closed, a program that abends without closing its QSAM output can lose the tail of the file.
