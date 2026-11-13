---
title: "SLIP"
params:
  expansion: "Serviceability Level Indication Processing"
  short: "An operator command that sets a trap: when a chosen abend, message or storage event occurs, take a dump or other action."
  ref: { title: "IBM Docs: SLIP command", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-slip-command" }
  aka: ["SLIP trap", "PER trap", "IEASLPxx", "SLIP SET"]
  related: ["IPCS", "ABEND", "GTF", "MCS Console", "PARMLIB", "PSW", "Systems Programmer", "Dump", "ESTAE", "System Trace"]
  links:
    - title: "IBM Docs: Setting a SLIP trap"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=command-setting-slip-trap"
categories: ["System Services"]
tags: ["troubleshooting", "sysprog", "operations"]
---

Many problems leave no useful evidence: the program recovers from the error, or the dump is taken too late, or the damage is done by something that never fails itself. A SLIP trap lets you tell the system in advance what to watch for and what to do at that exact moment.

`SLIP SET,COMP=0C4,JOBNAME=PAYROLL,ACTION=SVCD,END` asks for an SVC dump the next time job PAYROLL gets an `0C4`, even if a recovery routine would have hidden it. Traps can also match a message ID. The more powerful kind uses the hardware's program event recording (**PER**): trap when a given storage location is altered, when an instruction in a range is executed, or on a successful branch. Actions include taking a dump, starting a trace, suppressing a dump, or stopping the system.

Traps are normally supplied by a support centre for a specific problem, and standard ones are kept in PARMLIB member `IEASLPxx`. PER traps examine every matching event, so a badly scoped one can slow a system dramatically — set them narrowly, and delete them when the dump has been captured.
