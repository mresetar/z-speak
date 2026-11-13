---
title: "Adabas"
params:
  expansion: "Adaptable Database System"
  short: "Software AG's inverted-list database for the mainframe, almost always paired with the Natural programming language."
  ref: { title: "Wikipedia: ADABAS", url: "https://en.wikipedia.org/wiki/ADABAS" }
  aka: ["ADABAS", "Adabas & Natural", "Software AG"]
  related: ["IDMS", "Datacom", "Db2 for z/OS", "IMS", "CICS", "COBOL", "Natural"]
categories: ["Middleware"]
tags: ["database", "language", "legacy"]
---

Adabas dates from 1971 and is neither hierarchical nor, originally, relational. A database is a set of numbered **files**; a record's fields have two-character names; and any field declared a *descriptor* gets an inverted list, so searches on combinations of fields are resolved in the index before any data is read. Records are stored compressed. Two features have no direct SQL counterpart: **multiple-value fields** and **periodic groups**, which hold repeating data inside one record.

Its companion is **Natural**, a 4GL in which most Adabas applications are written — online under CICS or Software AG's own monitor, and in batch. "Adabas/Natural" is effectively one skill and one job title.

It has a strong base in public administration and finance, particularly in Europe, and those sites are a large share of today's mainframe modernisation projects. The usual difficulty is not moving the data but unpicking record designs that rely on those repeating structures.
