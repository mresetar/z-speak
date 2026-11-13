---
title: "HASP"
params:
  expansion: "Houston Automatic Spooling Priority"
  short: "The 1960s spooling system that became JES2 — and the reason JES2 messages still begin with $HASP."
  ref: { title: "Wikipedia: Houston Automatic Spooling Priority", url: "https://en.wikipedia.org/wiki/Houston_Automatic_Spooling_Priority" }
  aka: ["$HASP", "HASP II"]
  related: ["JES", "SYSOUT", "NJE", "RJE", "MCS Console", "SDSF"]
  links:
    - title: "IBM Docs: z/OS JES2 Introduction"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=jes2-zos-introduction"
categories: ["Operating System"]
tags: ["history", "batch", "operations"]
---

HASP was written by IBM staff working at NASA's Manned Spacecraft Center in Houston to do what OS/360 did poorly: read jobs in, queue them, and print their output without tying up the machine. It was so much better than the standard facilities that it spread from site to site and was eventually adopted as a product; under MVS it was renamed **JES2**.

The name never left the code. Every JES2 message is `$HASPnnn` — `$HASP373 jobname STARTED`, `$HASP395 jobname ENDED` — its modules are named `HASPxxxx`, and its operator commands start with `$`, the HASP command character.

So when an operator says "look for the HASP message", or an automation rule keys on `$HASP100`, they are talking about JES2. The rival system, ASP, became JES3, which IBM has since withdrawn.
