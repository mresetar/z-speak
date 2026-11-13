---
title: "Dump"
params:
  expansion: "Storage dumps (ABEND dump, SVC dump, stand-alone dump)"
  short: "A copy of storage taken when something fails; z/OS has several kinds, for applications, for the system, and for a system that is dead."
  ref: { title: "IBM Docs: Types of system dumps", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=aids-types-system-dumps" }
  aka: ["SYSUDUMP", "SYSABEND", "SYSMDUMP", "SADMP", "transaction dump", "CEEDUMP", "DAE", "SYS1.DUMP"]
  related: ["IPCS", "ABEND", "SLIP", "LOGREC", "Fault Analyzer", "Language Environment", "DD Statement", "Wait State", "Control Block", "ESTAE"]
  links:
    - title: "Wikipedia: Core dump"
      url: "https://en.wikipedia.org/wiki/Core_dump"
categories: ["System Services"]
tags: ["troubleshooting", "sysprog", "internals"]
---

Which dump you get depends on what failed and what was asked for.

| Dump | Taken when | Read with |
|---|---|---|
| **SYSUDUMP / SYSABEND** | A job step abends and has a DD of that name | Your eyes — formatted and printed |
| **SYSMDUMP** | As above, but unformatted | IPCS |
| **CEEDUMP** | Language Environment handles a failure | Your eyes — a traceback of the calling chain |
| **SVC dump** | A system component's recovery routine, a SLIP trap or the operator's `DUMP` command requests it | IPCS |
| **Transaction dump** | A subsystem or program asks for a dump of its own address space | IPCS |
| **Stand-alone dump** | The system has stopped; the operator IPLs a special dump program | IPCS |

The first group is requested in JCL: without a `SYSUDUMP`, `SYSABEND` or `SYSMDUMP` DD statement, an abending step produces no dump. Application programmers will most often be given the CEEDUMP or a report from a product such as Fault Analyzer.

SVC dumps are written to pre-allocated or dynamically allocated dump data sets, and **dump analysis and elimination** (DAE) suppresses repeats of a dump already taken for the same symptom.

A dump is a snapshot, not a history. What led up to the failure is in the system trace inside the dump, in logrec, and in the system log — so the evidence is the dump together with those records.
