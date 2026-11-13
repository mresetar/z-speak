---
title: "z/OS Debugger"
params:
  expansion: "IBM z/OS Debugger (formerly Debug Tool)"
  short: "IBM's source-level debugger for COBOL, PL/I, C/C++ and assembler programs running in batch, CICS, IMS and Db2."
  ref: { title: "IBM: IBM z/OS Debugger", url: "https://www.ibm.com/products/z-debug" }
  aka: ["Debug Tool", "IBM Debug for z/OS", "TEST option", "CEETEST", "DTCN", "CADP", "Xpediter"]
  related: ["IDz", "IBM Z Open Editor", "Language Environment", "COBOL", "CICS", "Fault Analyzer", "File Manager", "zUnit", "CICS Abend Codes", "VS Code"]
  links:
    - title: "IBM Docs: Getting started with z/OS Debugger"
      url: "https://www.ibm.com/docs/en/debug-for-zos/16.0.x?topic=guide-getting-started-zos-debugger"
categories: ["Development"]
tags: ["tooling", "development", "troubleshooting"]
---

The debugger lets you stop a running mainframe program at a statement, step through it, and inspect and change variables by their source names. It works where the programs really run — a batch job, a CICS transaction, an IMS region, a Db2 stored procedure — which matters because much of a mainframe program's behaviour comes from that environment.

There are two faces. The original is a full-screen 3270 session. The modern one is remote: the program runs on z/OS while the debugger's interface is in an Eclipse-based IDE such as **IDz** or in VS Code, connected over TCP/IP.

Three things have to line up. The program is compiled with the `TEST` option so that debug information exists. The debugger is invoked through the **Language Environment** `TEST` runtime option, usually supplied in a `CEEOPTS` DD in batch. And in CICS, a debug profile (transactions `DTCN` or `CADP`) says which programs, users and terminals to trap, so you catch your own transaction and not everyone's.

The main alternative is BMC Compuware **Xpediter**. Along with **Fault Analyzer** and **File Manager**, the debugger is one of the tools sold together as IBM's Application Delivery Foundation for z/OS.
