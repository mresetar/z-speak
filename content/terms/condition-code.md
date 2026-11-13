---
title: "Condition Code"
params:
  expansion: "Condition code and return code"
  short: "The per-step result code (CC 0000, 0004, 0008…) a batch program leaves behind, and what JCL steps key their IF/COND decisions on."
  ref: { title: "IBM Docs: z/OS MVS JCL Reference — COND parameter", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=parameter-examples-cond" }
  aka: ["CC", "completion code", "COND code"]
  related: ["JCL", "JES", "ABEND", "SDSF", "EXEC Statement"]
  links:
    - title: "IBM Docs: COND parameter"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-cond-parameter"
categories: ["Development"]
tags: ["batch", "jcl"]
---

Every batch step ends with a **condition code** — a small integer the program set on exit. The convention: `0000` went fine, `0004` is a warning worth looking at, `0008` and above mean something failed. You see it in SDSF and in the job log as `CC 0008`, and it is the number that decides what happens next.

JCL can gate subsequent steps on it, either with `COND=(4,LT)` on EXEC or, in modern JCL, the much more readable `IF (RC > 4) THEN … ELSE … ENDIF` construct. Because programs and IBM utilities set these codes by convention (IDCAMS alone has dozens), shops write their job streams around the specific values their steps return.

The classic mistake is assuming nonzero means the job died — a condition code is a *normal* end of step that the next step's logic or the operator must handle. Only an **ABEND** (S0C4, S322, …) means the step was terminated abnormally, and even that the `IF/COND` logic can trap and continue from.
