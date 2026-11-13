---
title: "BPAM"
params:
  expansion: "Basic Partitioned Access Method"
  short: "The access method for PDS and PDSE directories — it finds, adds and replaces members; reading the member itself is plain sequential I/O."
  ref: { title: "Wikipedia: Basic partitioned access method", url: "https://en.wikipedia.org/wiki/Basic_partitioned_access_method" }
  aka: ["BLDL", "FIND", "STOW"]
  related: ["PDS", "Access Method", "QSAM", "Load Module", "LLA"]
  links:
    - title: "IBM Docs: Basic Partitioned Access Method"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=methods-basic-partitioned-access-method"
categories: ["Storage"]
tags: ["storage", "internals"]
---

A partitioned data set is a directory plus members. BPAM is the code that works on the directory: `BLDL` and `FIND` look a member up and position to it, `STOW` adds, replaces, renames or deletes a directory entry. Once positioned, the member is read or written with BSAM `READ` and `WRITE`.

You rarely call it yourself, but it is behind everything that touches a library: ISPF's member list, the binder storing a program, and above all **program fetch**, which does a `BLDL` on every library in the search order to find a load module. That directory search is expensive enough that z/OS caches it — see **LLA**.

When JCL names a member, as in `DSN=MY.PDS(MEMBER)`, the system does the BPAM positioning for you and the program sees an ordinary sequential file through **QSAM**.
