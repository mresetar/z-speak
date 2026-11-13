---
title: "REXX"
params:
  expansion: "Restructured Extended Executor"
  short: "The mainframe's scripting language — glue for TSO, ISPF, JCL generation and automation."
  ref: { title: "IBM Docs: z/OS Basic Skills — How are CLISTs and REXX used?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_tsoclistsrexx.htm" }
  aka: ["Rexx", "TSO/E REXX", "exec"]
  related: ["TSO/E", "ISPF", "CLIST", "SDSF", "JCL", "Dynamic Allocation", "Shell Script"]
  links:
    - title: "Wikipedia: Rexx"
      url: "https://en.wikipedia.org/wiki/Rexx"
categories: ["Development"]
tags: ["language", "automation"]
---

REXX is interpreted, typeless, easy to read, and available everywhere on z/OS without installing anything. It shines at gluing: issue TSO commands, drive ISPF dialogs, parse SDSF output, generate and submit JCL, edit-macro your way through a mass source change.

```rexx
/* Show data sets under a high-level qualifier */
say 'HLQ?'; parse pull hlq
address TSO "LISTC LEVEL('"hlq"')"
```

Its `PARSE` instruction is unusually good at chopping fixed-format text, which is most of what mainframe output is. **NetRexx** and **ooRexx** exist off-platform, and REXX also runs under z/VM and CMS.

Where an exec runs decides what it can do. Under **TSO/E** it can issue TSO commands and call ISPF services; in batch it runs through `IKJEFT01` or the plainer `IRXJCL`; under z/OS UNIX it can use the `SYSCALL` environment and shell commands; inside NetView or System Automation it has that product's commands. The `ADDRESS` instruction chooses which environment receives a command string. Execs live in libraries allocated to the `SYSEXEC` or `SYSPROC` DD names, and one in `SYSPROC` must begin with a comment containing the word `REXX` so that it is not taken for a CLIST.

Common stumbles: every variable is a string, and an unassigned variable evaluates to its own name in upper case, so a typing mistake becomes data rather than an error — `SIGNAL ON NOVALUE` catches it. **Stem variables** (`line.1`, `line.2`, with the count in `line.0`) stand in for arrays. And `EXECIO` is the instruction that reads and writes data sets, working through the stack or a stem.
