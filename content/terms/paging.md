---
title: "Paging"
params:
  expansion: "Page data sets / Auxiliary Storage Manager (ASM)"
  short: "How z/OS moves 4K pages between central storage and page data sets on DASD — the mechanism underneath virtual storage."
  ref: { title: "IBM Docs: z/OS Basic Skills — How paging works in z/OS", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=storage-how-paging-works-in-zos" }
  aka: ["page data set", "page-in", "page-out"]
  related: ["Virtual Storage", "Address Space", "DASD", "RMF", "Temporary Data Set"]
  links:
    - title: "IBM Docs: Auxiliary storage overview"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=overview-auxiliary-storage"
categories: ["Operating System"]
tags: ["memory", "performance", "zos"]
---

Virtual storage lets every address space see far more memory than the machine owns; **paging** is the mechanism that makes the illusion work. Central storage is carved into 4 KiB **pages**; when a program touches a page that is not resident, the **Auxiliary Storage Manager** fetches it from a **page data set** on DASD (a page-in), and evicts a victim page to make room (a page-out). The **PSW** and hardware page tables make the touch transparent; the SRM and ASM make it survivable.

Page data sets come in three flavours: **PLPA** (holds the read-only pages common to all address spaces after an IPL), **common** (shared common-area pages) and **local** (everything private to an address space — the ones that grow). They are the most I/O-critical data sets in the system, normally mirrored, and the reason "paging" and "swapping" are heard with alarm in performance meetings.

The number that matters is the paging *rate* and where it points. Steady, moderate paging is normal; heavy page-ins of private pages ("thrashing") mean the workload does not fit — a capacity problem, not a tuning problem — and RMF paging reports are where that verdict is written.
