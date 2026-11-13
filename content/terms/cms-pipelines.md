---
title: "CMS Pipelines"
params:
  expansion: "CMS Pipelines"
  short: "A dataflow programming tool for z/VM: programs called stages are connected so records flow from one to the next, as in a UNIX pipe."
  ref: { title: "Wikipedia: CMS Pipelines", url: "https://en.wikipedia.org/wiki/CMS_Pipelines" }
  aka: ["PIPE", "Pipelines", "stage"]
  related: ["CMS", "REXX", "z/VM", "BatchPipes", "z/OS UNIX"]
  links:
    - title: "IBM Docs: z/VM: CMS Pipelines"
      url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=cms-pipelines"
categories: ["Operating System"]
tags: ["vm", "automation", "tooling"]
---

`PIPE < profile exec a | locate /say/ | count lines | console` reads a file, keeps the lines containing "say", counts them and prints the count. Each word between the bars is a **stage** — a small built-in program — and several hundred are supplied: for reading and writing files, spool and variables, and for selecting, reformatting, sorting and joining records.

It goes further than a UNIX shell pipe in two ways. Data moves as **records**, not bytes, which suits the platform. And a stage can have several input and output streams, so a pipeline can split, process the halves differently and merge them again — a network rather than a line. Your own stages are written in REXX.

Pipelines is the normal way to do data manipulation in a CMS EXEC, and far shorter than the equivalent REXX loop. The same engine was made available on z/OS as BatchPipeWorks, part of **BatchPipes**.
