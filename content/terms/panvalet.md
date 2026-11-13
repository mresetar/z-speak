---
title: "Panvalet"
params:
  expansion: "CA Panvalet"
  short: "A long-established source library manager that keeps programs and copy code in its own protected library instead of in PDS members."
  ref: { title: "Wikipedia: Panvalet", url: "https://en.wikipedia.org/wiki/Panvalet" }
  aka: ["PAN", "++INCLUDE", "PAN#1", "Pansophic"]
  related: ["Librarian", "Endevor", "Copybook", "PDS", "COBOL", "JCL"]
categories: ["Development"]
tags: ["development", "governance", "legacy"]
---

In 1969 there was no version control, and source code lived on card decks and in PDS members that anyone could overwrite. Panvalet, from Pansophic Systems, offered a single library file holding every program, JCL member and copy member, with a directory recording each member's language, **level number**, status — test, production, disabled — and last change. Members are stored compressed, changes are made through the product so that they are counted and logged, and production members can be locked.

Because the source is not in a PDS, compilers cannot read it directly. A compile step first extracts the member with the `PAN#1` utility into a temporary data set. Shared code is pulled in with a `++INCLUDE name` statement in place of a COBOL `COPY`, and expanded during that extract.

Now a Broadcom product, Panvalet survives at sites with decades of source in it. Seeing `++INCLUDE` in a COBOL program is the telltale sign — and the first thing to deal with when that code is migrated to Git, since standard compilers and editors do not know the statement.
