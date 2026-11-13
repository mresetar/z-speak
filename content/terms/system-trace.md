---
title: "System Trace"
params:
  expansion: "System trace, master trace and component trace (CTRACE)"
  short: "The always-on, in-storage traces of z/OS: recent system events, recent messages and each component's own diagnostic records."
  ref: { title: "IBM Docs: Component trace", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=information-component-trace" }
  aka: ["CTRACE", "component trace", "master trace", "TRACE ST", "SYSTRACE", "CTnccc00", "external writer"]
  related: ["GTF", "Dump", "IPCS", "SLIP", "LOGREC", "MCS Console", "Systems Programmer"]
categories: ["System Services"]
tags: ["troubleshooting", "internals", "sysprog"]
---

z/OS keeps several traces running permanently in memory so that when something fails, the recent past is already recorded in the dump. Nobody needs to have "turned tracing on" beforehand, which is the difference from **GTF**.

The **system trace** records low-level events for each processor: interrupts, SVC calls and returns, dispatches, program calls, I/O starts and completions. Its buffers wrap continuously, holding perhaps a few seconds on a busy system. In IPCS the `SYSTRACE` subcommand formats it, and reading backwards from the failing entry is a standard technique for seeing what a task did just before an abend. `TRACE ST` changes the buffer size and options.

The **master trace** holds the most recent console messages, so a dump contains the messages that preceded the problem even if nobody saved the log.

**Component trace** is a framework that individual components use for their own records — XCF, GRS, the logger, z/OS UNIX, TCP/IP, RRS and many more. Each has a name (`SYSXCF`, `SYSGRS`, `SYSOMVS`, `SYSTCPIP`), a default set of options in a `CTnccc00` PARMLIB member, and the `TRACE CT` command to change them. Most keep a small trace in storage all the time; for more detail the trace can be sent to data sets through an **external writer**. IPCS formats them with `CTRACE COMP(name)`.

IBM support usually asks for a specific component trace with specific options, and the trap is capturing it too late: the buffers wrap, so the dump must be taken at the moment of failure.
