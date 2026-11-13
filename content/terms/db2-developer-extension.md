---
title: "Db2 Developer Extension"
params:
  expansion: "IBM Db2 for z/OS Developer Extension"
  short: "The VS Code extension for connecting to Db2 for z/OS — run SQL, browse objects and edit routines from an editor."
  aka: ["Db2 for z/OS Developer Extension"]
  related: ["Db2 for z/OS", "IBM Z Open Editor", "IDz", "EXPLAIN", "VS Code"]
  ref: { title: "Db2 Developer Extension (VS Code Marketplace)", url: "https://marketplace.visualstudio.com/items?itemName=IBM.db2forzosdeveloperextension" }
categories: ["Development"]
tags: ["db2", "sql", "tooling"]
---

The Db2 Developer Extension is the modern way to run SQL against Db2 for z/OS from a workstation: define a connection profile (host, port, database, credentials — typically over a Db2 REST/ODBC path set up by your DBA), then execute statements and scripts, inspect tables, and get SQLCODE results inline in VS Code.

It succeeds SPUFI and the old Db2 for z/OS Developer add-ins as the day-to-day tool for anyone writing or debugging SQL — including the embedded SQL inside COBOL or PL/I that Z Open Editor keeps open in the next tab. Where results were once read as a TSO report, they now land in a table view you can sort and export.

Worth knowing what it is not: it is a client. The SQL still runs on the mainframe subsystem, access still goes through Db2's own security and z/OS security, and static SQL in production still has to be bound the traditional way.
