---
title: "Dynamic Allocation"
params:
  expansion: "Dynamic allocation (SVC 99, DYNALLOC)"
  short: "Allocating a data set while a program is running, by request to the system, where JCL would have used a DD statement."
  ref: { title: "IBM Docs: Requesting dynamic allocation functions", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-requesting-dynamic-allocation-functions" }
  aka: ["SVC 99", "DYNALLOC", "text unit", "BPXWDYN", "ALLOCATE", "FREE", "TSO ALLOC"]
  related: ["DD Statement", "DISP", "TSO/E", "REXX", "Catalog", "GRS", "SVC", "Control Block"]
categories: ["Operating System"]
tags: ["internals", "jcl", "data"]
---

A batch job states its data sets in advance with DD statements. Long-running servers and interactive users cannot: a TSO user decides which data set to edit after logging on, and Db2 opens table spaces as queries arrive. They use **dynamic allocation** — a request to the same system component that processes DD statements, made at run time.

The interface is **SVC 99**, the `DYNALLOC` macro. A program builds a request block and a list of **text units**, each a key and a value corresponding to a DD parameter: data set name, disposition, DD name, unit, space and so on. Verbs cover allocation, unallocation, concatenation and information retrieval. Failures come back as an error and information reason code, such as `0210` (data set in use by another job) or `1708` (not found in the catalog).

Few people code text units by hand. The TSO `ALLOCATE` and `FREE` commands are front ends to it; REXX and z/OS UNIX programs use the `BPXWDYN` service with a readable string like `alloc dd(in) da('MY.DATA') shr`; COBOL can allocate through environment variables, and C through `fopen`.

Two differences from JCL catch people out. Allocation happens when the request is made, so a missing or locked data set is discovered mid-run rather than before the job starts — the program must handle the failure. And the allocation persists until it is freed or the task ends, so a server that forgets to free data sets holds enqueues that block batch jobs.
