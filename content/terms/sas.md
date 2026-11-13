---
title: "SAS"
params:
  expansion: "SAS on z/OS (Statistical Analysis System)"
  short: "The data-analysis language and product from SAS Institute, used on mainframes above all for performance, capacity and SMF reporting."
  ref: { title: "Wikipedia: SAS (software)", url: "https://en.wikipedia.org/wiki/SAS_(software)" }
  aka: ["SAS System", "SAS/BASE", "DATA step", "PROC SQL", "SAS data set", "SAS library", "MXG", "SAS IT Resource Management", "MICS", "WPS"]
  related: ["SMF", "RMF", "Easytrieve", "DFSORT", "Capacity on Demand", "WLM", "Db2 for z/OS", "Systems Programmer", "MSU"]
categories: ["Development"]
tags: ["language", "performance", "data"]
---

**SAS** began on IBM mainframes in the 1970s and is still installed at a great many z/OS sites. In the business at large it is a statistics and analytics platform. On the mainframe its particular importance is narrower: it is the traditional tool for turning **SMF** and **RMF** records into performance, capacity and chargeback reports.

A SAS program is a sequence of steps. A **DATA step** reads input — a raw file described with `INPUT` statements, or an existing SAS data set — and builds a table, one observation at a time, with ordinary procedural logic. A **PROC step** applies a packaged procedure to a table: `PROC SORT`, `PROC MEANS`, `PROC FREQ`, `PROC PRINT`, `PROC SQL`, and many statistical and graphical ones. Tables are kept in **SAS libraries**, which on z/OS are specially formatted data sets allocated with a DD statement or a `LIBNAME`.

It handles mainframe data well: `INPUT` understands packed decimal, binary and EBCDIC fields and variable-length records directly, which is exactly what SMF records are made of. Most sites do not write that decoding themselves. They license **MXG**, a large library of SAS code by Merrill Consultants that maps every SMF record type into SAS data sets, or a comparable product, and build their reports on top.

SAS runs in batch (`PGM=SAS` with the program in `SYSIN`), interactively under TSO, or as a server for workstation clients. It is separately licensed and priced by machine capacity, and that cost is the usual reason sites look at alternatives — moving SMF data off the platform for analysis, or tools that run existing SAS language programs.
