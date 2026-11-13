---
title: "User Attributes"
params:
  expansion: "RACF user attributes (SPECIAL, OPERATIONS, AUDITOR and others)"
  short: "Flags on a RACF user ID that grant system-wide powers — administering security, reaching all data, or auditing."
  ref: { title: "IBM Docs: RACF — User attributes", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=users-user-attributes" }
  aka: ["SPECIAL", "OPERATIONS", "AUDITOR", "ROAUDIT", "REVOKED", "PROTECTED", "RESTRICTED", "UID 0"]
  related: ["RACF", "RACF Profile", "SAF", "ESM", "z/OS UNIX", "Started Task", "Systems Programmer", "MFA", "RACF Group", "SETROPTS"]
  links:
    - title: "IBM Docs: The AUDITOR attribute"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=attributes-auditor-attribute"
categories: ["Security"]
tags: ["security", "access-control", "governance"]
---

Most of what a user may do is decided resource by resource, through profiles. A handful of attributes on the user ID itself cut across that.

| Attribute | What it gives |
|---|---|
| **SPECIAL** | Full control of the RACF database: define users, change any profile, set system options. The security administrator |
| **OPERATIONS** | Access to almost all data sets, unless a profile explicitly excludes the user. Intended for storage management |
| **AUDITOR** | Control of what is logged, and the right to list everything. **ROAUDIT** is the read-only version |
| **PROTECTED** | The ID has no password, so nobody can log on with it. Correct for started tasks and other technical IDs |
| **RESTRICTED** | The ID gets no access through universal access settings — only what it is explicitly permitted |
| **REVOKED** | The ID is disabled, by an administrator or after too many wrong passwords |

SPECIAL, OPERATIONS and AUDITOR also exist at **group** level, limited to the resources that group owns, which is how administration is delegated.

They are deliberately separate powers. SPECIAL does not in itself grant access to data, although its holder could grant it to themselves — leaving a trace that the AUDITOR sees.

The z/OS UNIX equivalent is **UID 0**, superuser, which is better given indirectly through `BPX.SUPERUSER` so that it is assumed only when needed. Every audit begins by listing the holders of these attributes; the expected answer is a very short list of named individuals.
