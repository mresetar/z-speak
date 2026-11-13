---
title: "ACF2"
params:
  expansion: "Access Control Facility 2"
  short: "Broadcom's security manager for z/OS, an alternative to RACF built around compiled access rules and protection by default."
  ref: { title: "Wikipedia: ACF2", url: "https://en.wikipedia.org/wiki/ACF2" }
  aka: ["CA ACF2", "logonid", "LID", "access rule", "rule set", "UID string"]
  related: ["ESM", "RACF", "Top Secret", "SAF", "RACF Profile", "User Attributes", "High-Level Qualifier", "zSecure"]
categories: ["Security"]
tags: ["security", "access-control"]
---

ACF2 does the same job as RACF and plugs into the same **SAF** interface, so applications cannot tell which one is installed. The administration model is quite different.

Its founding principle, when it appeared in 1978, was **protection by default**: a data set that no rule mentions cannot be accessed by anyone but its owner. RACF at the time protected only what had been explicitly defined, and this difference won ACF2 many security-conscious customers.

Users are **logonid** records, whose privileges are flags such as `SECURITY`, `ACCOUNT` and `AUDIT`. Data set access is written as **rule sets**, one per high-level qualifier, each a list of lines saying which data set name patterns may be read, written, allocated or executed by which users. Rule lines identify users by matching against the **UID string** — a site-designed concatenation of fields such as department, job function and logonid — so a single line can grant access to "everyone in department 42". Rules are text that is compiled and stored; other resources have resource rules organised by type.

Skills transfer between the security products at the level of concepts but not of commands. An administrator moving between them needs to relearn the tooling, and converting a site from one to another is a substantial project.
