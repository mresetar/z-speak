---
title: "Subsystem"
params:
  expansion: "z/OS subsystem and the subsystem interface (SSI)"
  short: "A named service provider that z/OS calls through a standard interface: JES, Db2, IMS, MQ and many vendor products are all subsystems."
  ref: { title: "IBM Docs: What is a subsystem?", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=interface-what-is-subsystem" }
  aka: ["SSI", "subsystem interface", "IEFSSNxx", "SSCT", "SETSSI"]
  related: ["JES", "Db2 for z/OS", "IBM MQ", "PARMLIB", "Started Task", "Address Space", "MODIFY Command"]
categories: ["Operating System"]
tags: ["zos", "internals", "fundamentals"]
---

"Subsystem" is used loosely for any large piece of software — the CICS subsystem, the security subsystem — but it also has a precise meaning. A formal subsystem is a name of up to four characters, defined to z/OS, behind which sits a set of routines that the system calls whenever something of interest to that subsystem happens. The mechanism is the **subsystem interface** (SSI).

JES is the **primary subsystem**: z/OS asks it, through the SSI, to handle job input, SYSOUT and job selection. **Secondary subsystems** include Db2 (`DB2P`, say), MQ, IMS and automation and monitoring products. Each tells z/OS which events it wants — a console command with its prefix, a message being issued, a data set being allocated with `SUBSYS=` on the DD statement, a task ending — and z/OS routes those events to it.

Subsystems are defined in the `IEFSSNxx` member of PARMLIB, or dynamically with the `SETSSI` command, and `D SSI` lists them. A defined subsystem is not necessarily an active one: the name can exist while the address space that does the work is down, which is why a Db2 command can be answered with "subsystem not active".

The trap for newcomers is the three meanings of one name. `DB2P` can be the subsystem name, the prefix of its started tasks, and the command prefix, and they need not match.
