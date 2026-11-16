---
title: "TOD Clock"
params:
  expansion: "Time-of-day clock"
  short: "The hardware clock of IBM Z: a 64-bit count of microseconds since 1900 that every timestamp in the system is derived from."
  ref: { title: "IBM Docs: z/OS MVS Assembler Services Guide — Timing and communication", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-timing-communication" }
  aka: ["time-of-day clock", "STCK", "STCKE", "STCKF", "store clock", "STCKCONV", "CLOCKxx", "2042 problem", "ETOD"]
  related: ["STP", "Parallel Sysplex", "z/Architecture", "Db2 Log", "System Logger", "SMF", "PARMLIB", "IPL", "Julian Date"]
  links:
    - title: "IBM Docs: 26-character time stamp service"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=services-26-character-time-stamp-service"
    - title: "IBM Redbooks: IBM Z Server Time Protocol Guide"
      url: "https://www.redbooks.ibm.com/abstracts/sg248480.html"
categories: ["Hardware"]
tags: ["internals", "time", "fundamentals"]
---

The machine keeps time as a binary counter, not as a date. In the classic 64-bit format, **bit 51 ticks once per microsecond** and the value zero means 00:00 on 1 January 1900. The `STCK` instruction stores the eight bytes; a program that wants a readable date passes them to a service such as `STCKCONV`. In a dump, a doubleword whose first byte is between `D7` and `E9` is very often a TOD value from the 2020s.

The clock normally runs on UTC. Local time is an offset applied by z/OS, taken from `CLOCKxx` in PARMLIB or from the time network, which is why changing to summer time is an offset change and not a clock change — the TOD value itself never jumps backwards.

That property matters because so much is ordered by it. Db2 data sharing log sequence numbers, System Logger blocks, trace entries and many SMF fields are TOD values or derived from them. In a Parallel Sysplex every member must therefore see the same time, which is the job of **STP**: systems whose clocks disagree cannot stay in the same sysplex.

A 64-bit counter with this resolution wraps on **17 September 2042**. The architecture already has the answer — the 128-bit extended format stored by `STCKE`, which adds an epoch index in front and finer resolution behind — and current services and log formats use it. The remaining exposure is in older programs and file layouts that saved the eight-byte form and compare or subtract it directly.
