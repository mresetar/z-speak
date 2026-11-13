---
title: "Natural"
params:
  expansion: "Natural (Software AG fourth-generation language)"
  short: "Software AG's programming language and environment, normally paired with the Adabas database and common in public-sector systems."
  ref: { title: "Wikipedia: NATURAL", url: "https://en.wikipedia.org/wiki/NATURAL" }
  aka: ["Natural for Mainframes", "Natural for z/OS", "Software AG Natural", "NaturalONE", "DDM", "data definition module", "Natural Construct", "Predict", "4GL"]
  related: ["Adabas", "COBOL", "CICS", "TSO/E", "Db2 for z/OS", "VSAM", "Copybook", "IDMS", "Datacom"]
categories: ["Development"]
tags: ["language", "database", "legacy"]
---

**Natural** is a fourth-generation language from Software AG, introduced in 1979, built to make database applications quicker to write than in COBOL. It is closely tied to **Adabas**, and "Adabas/Natural" is spoken of as one platform. Outside the IBM-centric world it is very common: government agencies, universities and insurers in Europe and the Americas run large Natural estates.

Programs are written in an English-like, statement-oriented style in which database access is part of the language: `READ EMPLOYEES BY NAME` or `FIND EMPLOYEES WITH CITY = 'ZAGREB'` opens a processing loop over the matching records, with no separate cursor handling. Fields are known through **DDMs** (data definition modules), views of a database file generated from its definition. Natural also reads Db2, VSAM and sequential files. Applications are split into object types — programs, subprograms, **maps** (screens), copycode, data areas — stored in **libraries** within a Natural system file, not in ordinary data sets.

It is a whole environment, not just a compiler. Source is compiled to an intermediate form that the Natural **nucleus** executes, and that nucleus runs under a host — CICS, TSO, IMS TM, Software AG's own Com-plete, or batch. Developers traditionally worked in Natural's own 3270 editor; the Eclipse-based **NaturalONE** now lets them use a workstation and Git.

The trap for someone arriving from COBOL is looking for the code in the wrong place. There may be no PDS of source and no load library: the application lives inside the Natural system file in Adabas, and is moved between environments with Natural's own utilities. Software AG has committed to supporting it for the long term, and migration projects away from it remain a steady business.
