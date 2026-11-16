---
title: "Internal Reader"
params:
  expansion: ""
  short: "The JES facility that lets a program submit a job by writing JCL records to a special SYSOUT data set."
  ref: { title: "IBM Docs: JES2 — INTRDR initialization statement", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reader-parameter-description-intrdr" }
  aka: ["INTRDR", "internal reader data set", "SUBMIT", "SYSOUT=(A INTRDR)", "/*EOF", "STCINRDR", "TSOINRDR", "job submission"]
  related: ["JES", "JCL", "SYSOUT", "JOB Statement", "Initiator", "TSO/E", "Batch Scheduler", "FTP", "z/OSMF", "System Utilities", "RACF Class", "HASP"]
  links:
    - title: "IBM Docs: JES2 command $T INTRDR"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=section-t-intrdr-control-internal-readers"
    - title: "IBM Docs: z/OS jobs REST interface — Submit a job"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=interface-submit-job"
categories: ["System Services"]
tags: ["batch", "jes", "fundamentals"]
---

Jobs once entered the system through a card reader. The internal reader is the software replacement: a program allocates a SYSOUT data set that names `INTRDR` as its writer, writes 80-byte JCL records to it, and JES treats what arrives as an input job stream.

```jcl
//SUBMIT   EXEC PGM=IEBGENER
//SYSUT1   DD DISP=SHR,DSN=PROD.JCL.LIB(NIGHTLY)
//SYSUT2   DD SYSOUT=(A,INTRDR)
//SYSPRINT DD SYSOUT=*
//SYSIN    DD DUMMY
```

Nearly every way of submitting a job ends here. The TSO `SUBMIT` command, ISPF's `SUB`, the batch scheduler, FTP with `FILETYPE=JES`, the z/OSMF jobs REST interface and Zowe all hand their JCL to an internal reader. Started tasks and TSO logons go through dedicated ones too, which is why they appear in JES as jobs with `STC` and `TSU` numbers.

The job is passed to JES when the data set is closed or when a `/*EOF` record is written, so one step can submit many jobs. `/*DEL` cancels the job being written instead.

A job submitted this way does not run anonymously. If the JOB statement names no `USER`, it inherits the identity of whoever wrote the records — so a job submitted by a production scheduler runs with the scheduler's authority unless the JCL says otherwise. Naming someone else's user ID without their password requires `SURROGAT` authority in RACF. Reviewing who can write JCL into libraries that privileged address spaces submit from is a standard audit point for exactly this reason.
