---
title: "XCF"
params:
  expansion: "Cross-System Coupling Facility"
  short: "The messaging and membership service that lets systems in a sysplex talk and detect failures."
  ref: { title: "IBM Docs: z/OS Basic Skills — Cross-system Coupling Facility (XCF)", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=sysplex-cross-system-coupling-facility-xcf" }
  aka: ["XCF group", "XCF signalling", "cross-system coupling facility"]
  related: ["Parallel Sysplex", "Coupling Facility", "CTC", "CF Structure", "CFRM"]
  links:
    - title: "Wikipedia: IBM XCF"
      url: "https://en.wikipedia.org/wiki/IBM_XCF"
categories: ["System Services"]
tags: ["clustering", "internals"]
---

XCF provides groups, members, signalling paths and heartbeat monitoring. Subsystems join an XCF group to exchange state — Db2 data sharing, CICS, GRS, VTAM and the sysplex itself all rely on it.

When a member stops responding, XCF drives failure detection and partitioning (**sysplex failure management**), which is what removes a dead system before it can corrupt shared data. Messages beginning `IXC` are XCF talking to you, and they usually matter.

The configuration lives in the `COUPLExx` PARMLIB member: the sysplex name, the primary and alternate **couple data sets**, and the signalling paths — CTC devices, list structures in a Coupling Facility, or preferably both. `D XCF,SYSPLEX`, `D XCF,COUPLE`, `D XCF,PATHIN` and `D XCF,GROUP` show the state, and `SETXCF` changes it.

Each system proves it is alive by updating a status record in the couple data set. One that stops doing so for longer than the failure detection interval is declared status-missing; then either the operator is prompted or, with a sysplex failure management policy, the system is isolated and removed automatically. Losing access to the couple data sets, or to all signalling paths, takes a system out of the sysplex just as surely — the reason both are always duplicated.

Its sibling **XES** provides the services for using Coupling Facility structures; the two are usually mentioned in one breath. And XCF is present even where there is no sysplex to speak of: a single stand-alone system still runs it, as a monoplex, because the components built on its group services expect it.
