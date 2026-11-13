---
title: "RACF Group"
params:
  expansion: "RACF group, connect and group authorities"
  short: "A named collection of RACF users, used to grant access to many people at once and to own profiles and delegate administration."
  ref: { title: "IBM Docs: RACF groups", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=accountability-racf-groups" }
  aka: ["group profile", "CONNECT", "ADDGROUP", "LISTGRP", "default group", "superior group", "SYS1", "group-SPECIAL", "universal group", "list-of-groups checking", "owner"]
  related: ["RACF", "RACF Profile", "User Attributes", "RACF Class", "SETROPTS", "High-Level Qualifier", "OMVS Segment", "ESM"]
categories: ["Security"]
tags: ["security", "access-control"]
---

Granting access person by person does not scale and cannot be audited. In RACF you **permit a group** to a resource and then **connect** users to the group. When someone changes job, their connections change and no resource profile needs touching.

Groups form a tree. Every group except the top one, `SYS1`, has a **superior group**, and every group and user profile has an **owner**, which may be a user or a group. The tree is mostly about administration rather than access: an administrator with the **group-SPECIAL** attribute can manage users and profiles within the scope of that group and those below it, which is how a central security team delegates to departments.

Every user has a **default group** and may be connected to many more. With **list-of-groups checking** (`SETROPTS GRPLIST`), which is the normal setting, an access check considers all of a user's groups at once. Each connection also carries a **group authority** — `USE`, `CREATE`, `CONNECT` or `JOIN` — that governs what the user may do to the group itself, such as creating data set profiles under its name or connecting other users.

Groups also tie into naming. The high-level qualifier of a data set must be a user ID or a group name, so a group like `PAYROLL` commonly exists both to hold the people and to own the `PAYROLL.**` data set profiles. For z/OS UNIX a group can carry a **GID** in an OMVS segment.

The commands are `ADDGROUP`, `ALTGROUP`, `CONNECT`, `REMOVE` and `LISTGRP`. A traditional group holds at most 5,957 users; a **universal group** removes that limit.
