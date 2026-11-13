---
title: "SDSF"
params:
  expansion: "System Display and Search Facility"
  short: "Where you look at running jobs, held output, the system log and console commands."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is SDSF?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatissdsf.htm" }
  aka: ["SDSF DA", "SDSF ST", "spool browser"]
  related: ["JES", "SYSOUT", "ISPF", "MCS Console", "Health Checker", "Zowe Explorer", "SYSLOG"]
  links:
    - title: "Wikipedia: SDSF"
      url: "https://en.wikipedia.org/wiki/SDSF"
categories: ["System Services"]
tags: ["operations", "tooling"]
---

The panels you will use constantly: **DA** (active address spaces), **ST** (status of your jobs), **H** (held output), **LOG** (syslog), **O** (output queue). From them you browse job output, cancel a job, purge spool, or issue an operator command with `/`.

SDSF also has REXX and Java APIs, which is how a lot of automation reads job results. On sites without SDSF, the vendor equivalents are IOF or (E)JES — the concepts map one to one.

Working in SDSF is mostly filtering and action characters. `PREFIX` and `OWNER` decide which jobs are listed — an empty list is far more often a filter than a missing job. Next to a row you type an action: `S` to browse the output, `?` to list its individual data sets, `SJ` to see the JCL, `C` to cancel, `P` to purge, and `XDC` to copy output to a data set. Columns can be overtyped to change a job's class or priority.

Beyond jobs there are panels for the system itself: `INIT` for initiators, `SYS` for the members of the sysplex, `ENQ` for contention, `CK` for Health Checker results and `ULOG` for the responses to commands you issued.

What you may see and do is controlled by profiles in the SAF `SDSF` class, so the same panel looks different to an operator and to a developer.

Remote tools provide the same view without a terminal: the Jobs tree in Zowe Explorer and `zowe zos-jobs` list jobs and fetch spool files through z/OSMF.
