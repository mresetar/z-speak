---
title: "Storage Key"
params:
  expansion: "Storage protection key"
  short: "A four-bit key on every page of real storage; a program may only update pages whose key matches the key in its PSW."
  ref: { title: "IBM Docs: Storage protection", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=summary-storage-protection" }
  aka: ["protect key", "PSW key", "key 8", "key 0", "fetch protection", "S0C4"]
  related: ["PSW", "Problem State", "ABEND", "APF Authorization", "Virtual Storage", "CICS", "Control Block", "Reentrant Code", "Program Check"]
  links:
    - title: "IBM Docs: Selecting the storage key"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=authorization-selecting-storage-key"
categories: ["Operating System"]
tags: ["internals", "security", "fundamentals"]
---

The hardware keeps a key from 0 to 15 for each 4 KB frame, and the **PSW** carries the key the running program is using. A store into a page succeeds only if the two match, or if the PSW key is 0. A fetch-protect bit can extend the same test to reading. A violation is a protection exception — the familiar `S0C4` abend.

z/OS assigns the keys by role. Key 0 is the supervisor and can write anywhere. Keys 1 to 7 belong to system components and subsystems — the job entry subsystem, data management, VTAM, IMS and Db2. Ordinary programs all run in **key 8**. So the scheme does not separate one user from another — separate address spaces do that — but stops any application from overwriting the system code and control blocks mapped into its own address space.

Keys and **supervisor state** are different privileges, and authorized code typically uses both. CICS uses the mechanism too: with storage protection active, CICS's own storage is in key 8 and user transactions run in key 9, so an application bug cannot overwrite the region's control blocks.
