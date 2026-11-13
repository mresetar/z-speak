---
title: "z/TPF"
params:
  expansion: "Transaction Processing Facility"
  short: "A specialised, extremely high-volume transaction OS — airline reservations, card networks."
  ref: { title: "IBM Docs: IBM z/Transaction Processing Facility", url: "https://www.ibm.com/docs/en/ztpf" }
  aka: ["TPF", "Airline Control Program", "ACP"]
  related: ["z/OS", "IBM Z", "z/VSE"]
  links:
    - title: "Wikipedia: Transaction Processing Facility"
      url: "https://en.wikipedia.org/wiki/Transaction_Processing_Facility"
categories: ["Operating System"]
tags: ["transactions", "legacy"]
---

z/TPF trades generality for throughput: tens of thousands of transactions per second per system, with latency measured in milliseconds. Airline reservation systems, hotel booking networks and major card switches run on it.

You will rarely meet it unless you work in travel or payments, but it explains why "the mainframe" sometimes means something quite different from z/OS.

It descends from the airline reservation systems of the 1960s. The control program written for them became ACP, the Airline Control Program, was renamed TPF in 1979 when banks and others adopted it, and became z/TPF in 2005 with 64-bit addressing and a development toolchain based on Linux and GCC.

The design is spare. A transaction is a small, short-lived piece of work represented by an entry control block; applications are written in C, C++ or assembler; and the database is made of fixed-size records addressed directly, with a layer called TPFDF to give them structure. There is no batch in the z/OS sense and little that is general-purpose — which is where the speed comes from.

The skills are rare and concentrated in a small number of companies. You may hear z/TPF mentioned together with **ALCS**, a related airline transaction monitor that provides a similar environment on top of z/OS.
