---
title: "GDG"
params:
  expansion: "Generation Data Group"
  short: "A named series of data set versions where you reference by relative age, not by name."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is a generation data group?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_175.htm" }
  aka: ["generation data set", "GDS"]
  related: ["Data Set", "JCL", "Catalog", "DISP", "Checkpoint/Restart", "Sequential Data Set", "Tape Label", "Image Copy"]
  links:
    - title: "IBM Docs: Generation data groups"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=considerations-generation-data-groups"
categories: ["Storage"]
tags: ["storage", "batch"]
---

Define `PROD.DAILY.TRANS` with a limit of, say, 30 generations. Each run creates `(+1)`; the previous run's output is `(0)` and the one before that `(-1)`. Physically they are `…​.G0041V00`, `.G0042V00`, and old generations roll off automatically when the limit is reached.

This is how daily and monthly batch cycles keep history without any JCL change between runs — and it is why a rerun that creates `(+1)` twice can quietly push a still-needed generation off the end.

A GDG is two things: the **base**, a catalog entry created with IDCAMS `DEFINE GDG` that holds the limit and options, and the **generation data sets** themselves. The options matter. `SCRATCH` deletes a generation when it rolls off, `NOSCRATCH` merely uncatalogs it and leaves the data on disk. `EMPTY` removes *all* generations when the limit is reached rather than just the oldest — rarely what anyone wants. Classic GDGs hold up to 255 generations; **GDGE** (extended) raises that to 999.

Relative numbers are resolved once per job, not per step. Within a single job `(+1)` means the same new generation in every step, and it only becomes `(0)` when the job ends. Coding just the base name with no generation number concatenates every generation, newest first — a convenient way to read a month of daily files and an easy way to read far more data than you meant to.
