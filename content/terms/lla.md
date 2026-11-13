---
title: "LLA"
params:
  expansion: "Library Lookaside"
  short: "A z/OS cache of program library directories, so that finding a module in the link list needs no disk I/O."
  ref: { title: "IBM Docs: CSVLLAxx (library lookaside (LLA) list)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sys1parmlib-csvllaxx-library-lookaside-lla-list" }
  aka: ["library lookaside", "CSVLLAxx", "F LLA,REFRESH"]
  related: ["LNKLST", "VLF", "BPAM", "Load Module", "MODIFY Command", "PARMLIB"]
  links:
    - title: "IBM Docs: Starting LLA"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=list-starting-lla"
categories: ["Operating System"]
tags: ["performance", "sysprog", "operations"]
---

Loading a program means searching the directory of every library in the search order until the member is found. For the **LNKLST** that can be dozens of libraries, searched for every program fetch on the system. LLA reads those directories into its own address space once and answers the searches from memory. For modules fetched often it goes further and keeps a copy of the module itself in **VLF**.

By default it manages the link list libraries; others — a busy production load library, for instance — can be added in PARMLIB member `CSVLLAxx`.

The consequence everyone learns once: LLA does not notice when you change a library it manages. After replacing a module, the system goes on using the old directory entry until told otherwise with `F LLA,REFRESH` or a selective `F LLA,UPDATE=xx`. "I relinked it and the old version still runs" is an LLA refresh that has not been done.
