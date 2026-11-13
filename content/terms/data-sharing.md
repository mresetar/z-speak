---
title: "Data Sharing"
params:
  expansion: "Db2 data sharing"
  short: "Several Db2 subsystems on different z/OS systems reading and updating the same databases at once, as one group."
  ref: { title: "IBM Docs: Db2 13 — Db2 data sharing", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=concepts-db2-data-sharing" }
  aka: ["data sharing group", "member", "SCA", "group attach", "retained locks", "IMS data sharing"]
  related: ["Db2 for z/OS", "Parallel Sysplex", "Coupling Facility", "CF Structure", "IRLM", "Buffer Pool", "DDF", "VIPA", "RLS", "Db2 Log"]
  links:
    - title: "IBM Docs: Db2 13: Introduction to Db2 data sharing"
      url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=db2-data-sharing"
categories: ["Middleware"]
tags: ["db2", "sysplex", "availability"]
---

Without data sharing, one Db2 subsystem owns its data, and when that subsystem or its z/OS system is down, so are the applications. In a **data sharing group**, several Db2 **members** — normally on different systems of a Parallel Sysplex — share one catalog and one set of databases, all with full read and write access.

The Coupling Facility makes it possible. A **lock structure** lets the members' IRLMs detect conflicts across systems, **group buffer pools** hold changed pages so that every member sees current data, and a list structure called the **SCA** carries group-wide status.

Availability is the main benefit. A member can be stopped for maintenance while the others carry the work, so software upgrades roll through the group without an outage; and if a member fails, the rest continue, with only the data it was actually updating held by *retained locks* until it restarts. Capacity can be added by adding a member.

It is not free. Every inter-system lock and page registration costs Coupling Facility time, and applications should connect to the group, not to a named member, to benefit. IMS and VSAM have their own equivalents of the same idea.
