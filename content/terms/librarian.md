---
title: "Librarian"
params:
  expansion: "CA Librarian"
  short: "A source library manager from the pre-Git era, storing programs in a master file with change history and its own include statement."
  ref: { title: "Wikipedia: The Librarian (version control system)", url: "https://en.wikipedia.org/wiki/The_Librarian_(version_control_system)" }
  aka: ["The Librarian", "-INC", "master file", "ADR"]
  related: ["Panvalet", "Endevor", "Copybook", "PDS", "COBOL"]
categories: ["Development"]
tags: ["development", "governance", "legacy"]
---

The Librarian, from Applied Data Research, solved the same problem as its rival **Panvalet** in much the same way: source code is taken out of card decks and PDS members and kept in a **master file** that only the product updates. Each module carries a history, updates are applied as changes against sequence numbers, earlier levels can be reconstructed, and access to modules is controlled.

Control statements begin with a hyphen in column one. The one application programmers meet is `-INC name`, which includes another module — the Librarian equivalent of `COPY`. As with Panvalet, a compile begins with a step that extracts the module and expands its includes into a temporary data set for the compiler.

The product passed to Computer Associates and then Broadcom. It is rarer than Panvalet or Endevor today, but the pattern is the same when you find it: a shop whose source has never lived in ordinary libraries, and whose programs contain statements no compiler understands. The name can also confuse VSE people, for whom "Librarian" is the system's own library utility.
