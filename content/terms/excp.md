---
title: "EXCP"
params:
  expansion: "Execute Channel Program"
  short: "The lowest-level I/O interface, where a program builds its own channel program — and the unit job statistics use to count I/O."
  ref: { title: "Wikipedia: Execute Channel Program", url: "https://en.wikipedia.org/wiki/Execute_Channel_Program" }
  aka: ["EXCP count", "EXCPVR", "channel program", "CCW"]
  related: ["Access Method", "Channel Subsystem", "SMF", "UCB", "SVC", "Subchannel"]
  links:
    - title: "IBM Docs: Execute Channel Program (EXCP) section (SMF)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=mapping-execute-channel-program-excp-section"
categories: ["Storage"]
tags: ["internals", "io", "performance"]
---

`EXCP` is a macro (SVC 0) that asks the I/O supervisor to run a **channel program** — a chain of channel command words — that the caller has built. There is no blocking, buffering or error interpretation: the program gets exactly the device operations it asked for. Access methods, sort products and database managers have used it or its successors to squeeze out performance.

Most people meet the word somewhere else. Job step messages and SMF type 30 records report an **EXCP count** per DD, and it has become the everyday unit of "how much I/O did this job do". It counts blocks transferred, not records — which is why raising the block size of a sequential file makes the count, and usually the elapsed time, drop sharply.

For VSAM and other modern access methods the reported number is an equivalent count rather than literal EXCP calls, so compare it between runs of the same job rather than across different kinds of data set.
