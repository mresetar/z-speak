---
title: "Storage Subpool"
params:
  expansion: ""
  short: "A number from 0 to 255 on every storage request that decides where the storage lives, who owns it, which key protects it and when it is freed."
  ref: { title: "IBM Docs: z/OS MVS — Storage subpools", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=summary-storage-subpools" }
  aka: ["subpool", "GETMAIN", "FREEMAIN", "STORAGE OBTAIN", "STORAGE RELEASE", "SP 0", "subpool 252", "LSQA", "CPOOL", "IARV64", "VSM"]
  related: ["Virtual Storage", "Common Storage", "Address Space", "Storage Key", "REGION", "The Line and the Bar", "TCB", "ABEND", "IPCS", "Language Environment", "HLASM"]
  links:
    - title: "IBM Docs: Virtual storage management"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zmpaasg-virtual-storage-management"
categories: ["Operating System"]
tags: ["internals", "storage", "troubleshooting"]
---

A program gets working storage by asking the system for it — `GETMAIN` in older code, `STORAGE OBTAIN` in newer, `IARV64` above the bar — and gives it back with `FREEMAIN` or `STORAGE RELEASE`. Every request carries a **subpool number**, and the number is shorthand for a set of attributes: private or common area, storage key, fetch-protected or not, pageable or fixed, and which task owns the storage.

| Subpools | What they are |
|---|---|
| 0–127 | Ordinary private storage for problem-state programs; 0 is the default |
| 229, 230, 249 | Private storage for authorized code, at the top of the region |
| 231, 241 | **CSA** — common storage visible to every address space |
| 239, 245 | **SQA** — fixed common storage for system control blocks |
| 251, 252 | Where loaded program modules live |
| 253–255 | **LSQA** — the address space's own system control blocks |

Ownership is the attribute that matters most in practice. Storage in the low subpools belongs to a task and is released automatically when that task ends, so a batch program that never frees anything still cleans up. Common-area subpools belong to nobody: storage obtained there stays until someone frees it or the system is IPLed, which is how "CSA creep" happens.

Application programmers rarely see any of this. COBOL, PL/I, C and Java sit on Language Environment, which gets large pieces from the system and hands out heap and stack itself. Subpools become visible when something goes wrong: an `S878` or `S80A` abend says a request could not be satisfied and its reason code says from which area, and IPCS `VERBX VSMDATA` breaks an address space's storage down by subpool and key to show what grew.
