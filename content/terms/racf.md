---
title: "RACF"
params:
  expansion: "Resource Access Control Facility"
  short: "IBM's security manager — the authority on who may use which resource on z/OS."
  aka: ["Security Server"]
  related: ["SAF", "ESM", "z/OS", "SMF", "PassTicket", "Key Ring", "MFA", "RACF Profile", "User Attributes", "Digital Certificate"]
  ref: { title: "IBM Docs: z/OS Security Server RACF", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-security-server-racf" }
  links:
    - title: "Wikipedia: Resource Access Control Facility"
      url: "https://en.wikipedia.org/wiki/Resource_Access_Control_Facility"
categories: ["Security"]
tags: ["security", "access-control"]
---

RACF holds users, groups and **profiles** protecting resources — data sets by name pattern, and everything else in **general resource classes** (`FACILITY`, `SURROGAT`, `OPERCMDS`, CICS transactions, Db2 objects, and so on). Access levels run `NONE → READ → UPDATE → CONTROL → ALTER`.

Two design points make it strong. Checks are made by the operating system through **SAF**, not by each application, so a program cannot decide to skip them. And group-based permissions plus generic profiles let a whole naming convention be secured in one rule.

Commands to recognise: `LISTUSER`, `LISTGRP`, `RLIST`, `PERMIT`, `SETROPTS`. Violations land in **SMF type 80** records, which is what auditors read.

Data set profiles are either **discrete** (one exact name) or **generic**, with wildcards: `%` for one character, `*` for a qualifier or the rest of one, `**` for any number of qualifiers. The most specific matching profile wins, not the first one found, and working out which profile actually covers a name is done with `LISTDSD DA('name') GENERIC`. Each profile has a **UACC** (the access everyone gets by default) and an access list of users and groups.

A user's power comes from attributes as well as access lists. `SPECIAL` allows administering RACF itself, `OPERATIONS` gives broad access to data, and `AUDITOR` allows controlling logging — three roles deliberately separated. General resource classes are often kept in memory (`RACLIST`), so a change is not in effect until `SETROPTS RACLIST(class) REFRESH` is issued; forgetting the refresh is the classic "I permitted it and it still fails". A failed check produces message `ICH408I`, which names the user, the resource, the class and the access attempted.
