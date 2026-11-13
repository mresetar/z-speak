---
title: "DD Statement"
params:
  expansion: "Data Definition statement"
  short: "The JCL line that binds a name inside a program to an actual data set, device or spool file."
  ref: { title: "IBM Docs: z/OS Basic Skills — What does the DD statement do?", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=concepts-jcl-statements-what-does-dd-statement-do" }
  aka: ["DD card", "ddname"]
  related: ["JCL", "Data Set", "SYSOUT", "Cataloged Procedure", "DCB", "DISP", "JOB Statement", "EXEC Statement", "Dynamic Allocation", "SPACE"]
  links:
    - title: "IBM Docs: JOBLIB DD statement"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statements-joblib-dd-statement"
categories: ["Development"]
tags: ["batch", "jcl"]
---

A COBOL program says `SELECT CUSTOMER-FILE ASSIGN TO CUSTFILE`; the JCL says what `CUSTFILE` is today:

```jcl
//CUSTFILE DD DSN=PROD.CUSTOMER.MASTER,DISP=SHR
```

That indirection is late binding done in 1964, and it is why the same load module runs against test and production data with no recompile.

`DISP` is where most mistakes happen: `SHR` share for read, `OLD` exclusive, `MOD` append, and `(NEW,CATLG,DELETE)` meaning *create it, catalog it if the step ends well, delete it if it does not*.

Common ddnames worth recognising: `SYSIN` (input stream), `SYSOUT`/`SYSPRINT` (printed output), `STEPLIB` (where to find the program), `SYSUDUMP` (dump on abend).

A DD statement can describe far more than a cataloged data set. `DD *` introduces data in the job stream itself, ended by `/*`. `DD DUMMY` makes reads return end-of-file and discards writes, handy for switching off optional output. `&&TEMP` names a temporary data set that vanishes at the end of the job. `PATH=` points at a z/OS UNIX file. For new data sets, `SPACE`, `UNIT` and the `DCB` attributes — record format `RECFM`, record length `LRECL`, block size `BLKSIZE` — say what to create, unless SMS classes supply them.

**Concatenation** joins several data sets under one DD name by leaving the name off the following lines, so the program reads them as one. It is how library search orders are built. The related failures are worth recognising: a missing DD statement is reported by the program when it opens the file (in COBOL, file status 35 or message `IEC130I`), and a mismatch between the program's idea of the record and the data set's gives abend `S013` or `S001`.
