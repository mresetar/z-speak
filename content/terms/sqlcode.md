---
title: "SQLCODE"
params:
  expansion: "SQL return code (SQLCODE, SQLSTATE and the SQLCA)"
  short: "The number Db2 returns after every SQL statement: zero for success, positive for a warning, negative for an error."
  ref: { title: "IBM Docs: Db2 13 — SQL codes", url: "https://www.ibm.com/docs/en/db2-for-zos/13.0.0?topic=codes-sql" }
  aka: ["SQLSTATE", "SQLCA", "SQL return code", "-811", "-904", "-913", "+100", "DSNTIAR", "GET DIAGNOSTICS"]
  related: ["Db2 for z/OS", "Plan and Package", "Db2 Locking", "SPUFI", "COBOL", "Stored Procedure", "Unit of Work", "DCLGEN", "SQL"]
categories: ["Middleware"]
tags: ["db2", "sql", "troubleshooting"]
---

Db2 does not abend a program when a statement fails. It fills in a structure called the **SQLCA** and returns, and the program is expected to look. The key field is **SQLCODE**: `0` means the statement worked, a positive value means it worked with a condition worth knowing about, and a negative value means it failed. **SQLSTATE** carries the same information as a five-character code standardised across database products.

A small set accounts for most of what a developer sees. `+100`: no row found, or the end of a cursor. `-803`: duplicate key. `-811`: a singleton `SELECT` returned more than one row. `-305`: a null value arrived and the program supplied no indicator variable. `-805` and `-818`: the package is missing, or was bound from a different precompile than the load module — a build and deployment problem, not a data one. `-904`: a resource is unavailable; the message names it. `-911` and `-913`: the statement was the victim of a deadlock or timeout, with or without a rollback. `-551`: not authorised. `-204`: the object name is not known.

The associated text and tokens — which table, which resource — are in other SQLCA fields. The `DSNTIAR` routine formats them into readable lines, and `GET DIAGNOSTICS` retrieves the detail in newer code.

The classic fault is not checking at all. A program that ignores SQLCODE carries on with stale host variables after a failed `SELECT`, and the wrong answer appears far from its cause. Every statement should be followed by a test, and `-911` in particular needs a deliberate decision: retry the unit of work or stop.
