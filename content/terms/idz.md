---
title: "IDz"
params:
  expansion: "IBM Developer for z/OS"
  short: "An Eclipse-based IDE for COBOL, PL/I and JCL, with editing, debugging and code analysis."
  ref: { title: "IBM Docs: IBM Developer for z/OS", url: "https://www.ibm.com/docs/en/developer-for-zos" }
  aka: ["RDz", "IBM Developer for z/OS Enterprise Edition"]
  related: ["ISPF", "Zowe", "COBOL", "Copybook", "z/OS Debugger", "zUnit", "CICS Explorer", "VS Code"]
  links:
    - title: "IBM Docs: Overview of IBM Developer for z/OS"
      url: "https://www.ibm.com/docs/en/developer-for-zos/15.0.x?topic=overview-developer-zos"
categories: ["Modern Z"]
tags: ["tooling", "development"]
---

IDz gives mainframe languages what other languages have had for years: syntax awareness, jump-to-definition through copybooks, refactoring aids, an interactive debugger, and program-understanding views that map call graphs of code nobody has documented.

The lighter alternative is **IBM Z Open Editor** in VS Code, usually paired with **Zowe Explorer**. Which one a shop uses often depends on how deep the debugging and analysis needs go — but either way the point is the same: developers stop being limited to a 3270 screen.

The product has been renamed often enough to confuse searches: WebSphere Developer for zSeries, Rational Developer for System z (**RDz**), then IDz, and it is now delivered as part of **IBM Developer for z/OS Enterprise Edition** and the **IDzEE** bundle that also contains the debugger, ZUnit and the build toolkit. Older colleagues will still say "RDz".

It is a client and a server. The Eclipse client on the workstation connects to a host component — the **RSE daemon**, or z/OSMF and Zowe-based connections in newer levels — which is what actually lists data sets, submits jobs and reads output. If the host side is not installed and its started tasks are not running, the client cannot do much. The **Remote Systems** view replaces ISPF option 3.4, and **property groups** tell the editor where copybooks and include libraries are so that syntax checking matches what the compiler will see.
