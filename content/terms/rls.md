---
title: "RLS"
params:
  expansion: "VSAM Record-Level Sharing"
  short: "A VSAM mode in which a system address space does the locking and buffering, so many CICS regions and batch jobs can update one file at once."
  ref: { title: "IBM Docs: Using VSAM record-level sharing", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=files-using-vsam-record-level-sharing" }
  aka: ["VSAM RLS", "record-level sharing", "SMSVSAM", "DFSMStvs", "Transactional VSAM", "TVS", "SHCDS", "MACRF=RLS"]
  related: ["VSAM", "KSDS", "CICS", "Coupling Facility", "CF Structure", "Parallel Sysplex", "Data Sharing", "SMS Classes", "MRO"]
categories: ["Storage"]
tags: ["vsam", "sysplex", "cics"]
---

Ordinary VSAM leaves sharing to the application. If two address spaces update the same file, nothing in VSAM stops them overwriting each other, which is why sites traditionally gave each file to one CICS region — a **file-owning region** — and routed every request through it. That region is a bottleneck and a single point of failure.

**Record-level sharing** moves the control into the system. An address space called **SMSVSAM** runs on each z/OS image, opens the data sets, keeps the buffers and takes locks on individual records. The locks and a shared cache live in **Coupling Facility** structures, so every system in the sysplex sees the same picture. Any CICS region on any system can then open the file directly, and losing one region or one system does not make the data unavailable.

A data set becomes eligible through SMS — its storage class names a cache set — and through attributes set with IDCAMS, notably `LOG`, which says whether it is recoverable. CICS opens the file in RLS mode when its file definition says so; a batch program asks with `RLS=` on the DD statement.

The catch is batch. CICS can back out an incomplete update because it logs; a plain batch job cannot, so it may read a recoverable RLS data set but not update it while CICS has it open. **DFSMStvs** (Transactional VSAM) fills that gap by giving batch jobs logging and commit through RRS. Without it, the nightly pattern of closing files to CICS for batch update remains.
