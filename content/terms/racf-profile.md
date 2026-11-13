---
title: "RACF Profile"
params:
  expansion: "RACF resource profiles (data set and general resource)"
  short: "The RACF record that protects a resource: what it covers, the default access, and the list of who may do what."
  ref: { title: "IBM Docs: Choosing between discrete and generic profiles", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=set-choosing-between-discrete-generic-profiles" }
  aka: ["generic profile", "discrete profile", "UACC", "PERMIT", "access list", "general resource class", "FACILITY class"]
  related: ["RACF", "SAF", "User Attributes", "High-Level Qualifier", "Data Set", "ESM", "CICS Transaction", "Started Task", "RACF Group", "RACF Class"]
  links:
    - title: "IBM Docs: Choosing between discrete and generic data set profiles"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=names-choosing-between-discrete-generic-data-set-profiles"
categories: ["Security"]
tags: ["security", "access-control", "fundamentals"]
---

Every access decision RACF makes comes down to finding a profile. A **data set profile** protects data sets; a **general resource profile** protects anything else — a CICS transaction, an operator command, a z/OS UNIX privilege — within a named **class** such as `TCICSTRN`, `OPERCMDS` or `FACILITY`.

A profile has a name, a **universal access** (UACC) that applies to everyone not otherwise mentioned, and an **access list** of users and groups, each with a level: `NONE`, `READ`, `UPDATE`, `CONTROL` or `ALTER` for data sets. The commands are `ADDSD` and `RDEFINE` to create profiles, `PERMIT` to change access lists, and `LISTDSD` and `RLIST` to display them.

Profiles are **discrete**, covering exactly one resource, or **generic**, using wildcards: `PAY.PROD.**` covers every data set beginning with those qualifiers. Nearly all are generic.

The rule that surprises newcomers is that only *one* profile applies — the most specific match — and access is not accumulated from broader ones. Permission in `PAY.**` counts for nothing if `PAY.PROD.**` exists and does not list you.

Two details cause most "I changed it and nothing happened" reports. Many classes are held in memory and need `SETROPTS RACLIST(class) REFRESH` after a change. And a user's group connections are read at logon, so a new group membership takes effect only at the next one.
