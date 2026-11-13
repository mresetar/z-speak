---
title: "ISPF"
params:
  expansion: "Interactive System Productivity Facility"
  short: "The green-screen menu, editor and file manager most z/OS work still happens in."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is ISPF?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatisispf.htm" }
  aka: ["ISPF/PDF", "PDF", "SPF"]
  related: ["TSO/E", "SDSF", "Data Set", "IDz", "VS Code"]
  links:
    - title: "Wikipedia: ISPF"
      url: "https://en.wikipedia.org/wiki/ISPF"
categories: ["System Services"]
tags: ["interactive", "tooling"]
---

ISPF is a full-screen application framework on top of TSO, but in practice it means three things people use every day: **option 2** the editor, **option 3.4** the data set list, and **option 6** the command line. Its edit macros, line commands and split-screen model are muscle memory for anyone who has worked on z/OS for a while.

It is also a UI toolkit: many in-house and vendor tools are ISPF dialogs written in REXX or COBOL with panel definitions. Newer alternatives — IDz, VS Code with Zowe Explorer — read the same data sets, but ISPF is still the lowest common denominator that is always there.

A few habits explain most of the screen. The **primary command** line at the top takes commands such as `FIND`, `CHANGE`, `SAVE` and `SUBMIT`; the **line command** area at the left of each row takes short codes such as `I` (insert), `D` (delete), `C`/`A` (copy and after) and block forms like `DD`. Function keys do the navigating: PF3 ends and saves, PF7 and PF8 scroll, PF2 and PF9 split and swap screens. `=3.4` jumps straight to an option from anywhere.

The trap for newcomers is how saving works. Leaving the editor with PF3 saves; `CANCEL` is the way out without saving. A member in edit holds a lock, so a session abandoned in edit blocks batch jobs that need the data set exclusively. ISPF itself is built from data sets allocated to DD names in the logon procedure — `ISPPLIB` for panels, `ISPSLIB` for skeletons, `ISPMLIB` for messages, `ISPTLIB` for tables, plus the user's **profile** data set that remembers settings.
