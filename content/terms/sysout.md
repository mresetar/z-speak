---
title: "SYSOUT"
params:
  expansion: "System output"
  short: "Printed output from a job, captured on the JES spool and read on screen rather than on paper."
  ref: { title: "IBM Docs: z/OS MVS JCL Reference — SYSOUT parameter", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-sysout-parameter" }
  aka: ["spool file", "held output"]
  related: ["JES", "SDSF", "DD Statement", "AFP"]
  links:
    - title: "Wikipedia: Spooling"
      url: "https://en.wikipedia.org/wiki/Spooling"
categories: ["System Services"]
tags: ["batch", "operations"]
---

`//SYSPRINT DD SYSOUT=*` sends output to a spool class instead of a data set. Classes control what happens next: some print, most are **held** for viewing and eventually purged. Job messages (`JESMSGLG`, `JESJCL`, `JESYSMSG`) arrive the same way and are the first place to look when a job fails.

Because the spool is finite, output management (archiving to a product like CA View or IBM Content Manager OnDemand, then purging) is a standard operational job — a full spool stops batch.

The class is one letter or digit, and its meaning is entirely local: at one site `A` prints and `X` is held, at another the reverse. `SYSOUT=*` means "use the class named on `MSGCLASS` in the JOB statement", which is why most JCL uses it. An **OUTPUT** JCL statement or extra DD parameters add the detail — destination, number of copies, forms, and for page printers the AFP resources.

Size is the other thing to control. A looping program writing to SYSOUT can fill the spool for everyone, so installations set limits on lines or bytes per job; exceeding them brings a message or an abend (`S722`) depending on how JES is set up, and the `OUTLIM` parameter sets a limit for one DD. Once written, SYSOUT is no longer tied to the job step: it can be requeued, routed to another node over **NJE**, or read by a program through the SYSOUT API or a `SUBSYS` interface.
