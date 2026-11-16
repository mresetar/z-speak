---
title: "REGION"
params:
  expansion: "REGION parameter and region size"
  short: "The JCL parameter that limits how much virtual storage a job step may obtain, and the usual suspect behind S878 and S80A abends."
  ref: { title: "IBM Docs: REGION parameter", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-region-parameter" }
  aka: ["region size", "REGION=0M", "IEFUSI", "SMFLIMxx", "S878", "S80A", "S822"]
  related: ["Virtual Storage", "The Line and the Bar", "JOB Statement", "EXEC Statement", "Address Space", "ABEND", "Common Storage", "Exit"]
categories: ["Operating System"]
tags: ["jcl", "memory", "batch"]
---

Every job step runs in an address space with far more virtual storage than it should be allowed to use. `REGION` on the JOB or EXEC statement sets the limit for storage **below the bar**: `REGION=64M` asks for up to 64 MB. The value covers two areas with one number — the private area below the 16 MB line and the extended private area above it — following rules that are less obvious than they look: a value up to 16M limits the area below the line and leaves a default above it, while a larger value limits the area above.

`REGION=0M` means "as much as is available", and is common for Db2, CICS and Java work. It is not unlimited: an installation exit, **IEFUSI**, or the newer SMFLIMxx PARMLIB member can cap or override what any job asks for, which is why the same JCL behaves differently at two sites.

Storage **above the bar** is controlled separately by `MEMLIMIT`. A job with a huge REGION can still fail to get 64-bit storage if MEMLIMIT is zero or small.

The symptoms are specific. `S878` and `S80A` mean a program asked for more than the region allows; `S822` means the region itself could not be obtained at step start. The fix is sometimes a larger REGION and sometimes a program that never frees storage — raising the limit only postpones the second kind.

In CICS and IMS, "region" also means the address space itself, a different use of the word.
