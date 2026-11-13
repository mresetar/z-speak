---
title: "Cataloged Procedure"
params:
  expansion: "PROC"
  short: "Reusable JCL kept in a library and called by name, with parameters — the closest JCL gets to a function."
  ref: { title: "IBM Docs: z/OS Basic Skills — What are JCL procedures?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zjcl/zjclc_jclEXECwhatRprocs.htm" }
  aka: ["PROC", "procedure"]
  related: ["JCL", "DD Statement", "JES", "JCL Symbol", "EXEC Statement"]
  links:
    - title: "IBM Docs: Cataloged and in-stream procedures"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=symbols-cataloged-in-stream-procedures"
categories: ["Development"]
tags: ["batch", "jcl"]
---

Instead of repeating twenty lines in every job, you put them in a member of a **PROCLIB** and call it:

```jcl
//STEP1 EXEC COBRUN,PROG=PAYCALC,LOADLIB=PROD.LOADLIB
```

Symbolic parameters (`&PROG`) are substituted at conversion time, and a job can override any DD in the procedure. An **instream** procedure (between `PROC` and `PEND` inside the job) is the local variant.

Compile-link-go procedures shipped by IBM and by vendors are the usual first encounter — and reading the expanded JCL in the job output is how you find out what actually ran.

Where procedures are found is the first thing to learn. JES searches the libraries in its own **PROCLIB** concatenation unless the job names its own with a `JCLLIB ORDER=` statement, which is how developers test a private copy without touching the production library. The same name in two libraries means the first one found wins, silently.

Overrides have exact rules. To change a DD you code `//stepname.ddname DD ...` after the `EXEC`, and overrides must appear in the same order as the steps in the procedure; an override naming a step or DD that does not exist is added as a new DD rather than rejected. Parameters on `EXEC` can be aimed at one step (`PARM.COB=`) or apply to all. Since procedures can call other procedures, up to fifteen levels deep, the only reliable picture is the expanded listing in `JESJCL`, where `XX` marks lines that came from a procedure and `X/` lines that were overridden.
