---
title: "JCL Symbol"
params:
  expansion: "JCL symbols and symbolic parameters"
  short: "A named placeholder in JCL — &NAME — replaced by a value before the job runs, so one job or procedure can serve many cases."
  ref: { title: "IBM Docs: JCL Reference — What are JCL symbols?", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=symbols-what-are-jcl" }
  aka: ["symbolic parameter", "SET statement", "&SYSUID", "system symbol", "temporary data set", "&&TEMP"]
  related: ["JCL", "Cataloged Procedure", "EXEC Statement", "JOB Statement", "DD Statement", "PARMLIB"]
  links:
    - title: "IBM Docs: Using symbols on certain JCL statements"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=jcl-using-symbols-certain-statements"
categories: ["Development"]
tags: ["batch", "jcl"]
---

`// SET ENV=TEST` defines a symbol, and `DSN=PAY.&ENV..MASTER` uses it, becoming `PAY.TEST.MASTER`. The two periods are not a typo: the first ends the symbol name, the second is the real separator. Leaving one out is the most common JCL symbol mistake, and produces `PAY.TESTMASTER`.

Procedures are where symbols matter most. A `PROC` statement declares **symbolic parameters** with default values, and the `EXEC` statement that calls the procedure overrides them — which is how one compile procedure handles any program name and library. Substitution happens when the JCL is interpreted, so the job log shows both the original statement and the resolved one, marked `IEFC653I SUBSTITUTION JCL`.

Two limits catch people. Symbols are not replaced inside in-stream data — the lines after `DD *` — unless the DD says `SYMBOLS=JCLONLY`. And **system symbols** such as `&SYSNAME` are available to batch JCL only where the installation allows it for the job class.

A name with two ampersands, `&&TEMP`, is something else entirely: a temporary data set that exists only for the life of the job.
