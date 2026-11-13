---
title: "SETROPTS"
params:
  expansion: "RACF SETROPTS command (system-wide RACF options)"
  short: "The command that sets RACF's global options: password rules, which classes are active, auditing, and the refresh of in-storage profiles."
  ref: { title: "IBM Docs: Using the SETROPTS command", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=options-using-setropts-command" }
  aka: ["SETR", "SETROPTS LIST", "RACLIST", "RACLIST REFRESH", "GENERIC REFRESH", "CLASSACT", "PROTECTALL", "ERASE", "password rules", "SETROPTS GENCMD"]
  related: ["RACF", "RACF Class", "RACF Profile", "User Attributes", "RACF Group", "SAF", "SMF", "ESM"]
categories: ["Security"]
tags: ["security", "configuration", "sysprog"]
---

Most RACF commands change one profile. **SETROPTS** changes how RACF behaves for the whole system, and its settings are stored in the RACF database so they survive an IPL and apply to every system sharing that database. `SETROPTS LIST` shows them, and an auditor's review starts there.

The options fall into groups. **Class control:** `CLASSACT` activates a class, `GENERIC` allows generic profiles in it, and `RACLIST` loads all of a class's profiles into memory for fast checking. **Password policy:** minimum length and content rules, change interval, history, the number of invalid attempts before a user ID is revoked, and whether mixed-case passwords and password phrases are allowed. **Protection defaults:** `PROTECTALL(FAILURES)` makes any data set without a covering profile inaccessible, turning RACF from "open unless protected" into default-deny; `ERASE` overwrites deleted data. **Auditing:** which classes and which privileged users' actions are logged to SMF.

The option newcomers must learn first is **refresh**. For a class that is RACLISTed, a new or changed profile is written to the database but the in-storage copy is unchanged until `SETROPTS RACLIST(classname) REFRESH` is issued. Generic data set profiles similarly need `SETROPTS GENERIC(DATASET) REFRESH` to take effect for users already working. "I ran the PERMIT and it still fails" is almost always a missing refresh — or a user who must log off and on again because group connections are picked up at logon.

Issuing SETROPTS needs the `SPECIAL` attribute for most options and `AUDITOR` for the audit ones, a deliberate split.
