---
title: "CICS Abend Codes"
params:
  expansion: "CICS transaction abend codes (ASRA, AEI0, AICA and others)"
  short: "The four-character codes CICS gives when it ends a transaction abnormally; ASRA, a program check, is the one everybody meets first."
  ref: { title: "IBM Docs: Transaction abend codes: AEYD, AICA, ASRA, ASRB, and ASRD", url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=dtac-transaction-abend-codes-aeyd-aica-asra-asrb-asrd" }
  aka: ["transaction abend", "ASRA", "ASRB", "AICA", "AEY9", "AEI0", "AEIx", "AKCT", "AZI6", "APCT", "ATNI", "DFHAC2206"]
  related: ["CICS", "ABEND", "Program Check", "CICS Transaction", "EXEC CICS", "CEMT", "Fault Analyzer", "Dump", "z/OS Debugger"]
categories: ["Middleware"]
tags: ["cics", "troubleshooting", "beginner"]
---

When a program fails under CICS, the region does not abend; the **transaction** does. CICS backs out its uncommitted updates, writes message `DFHAC2206` or similar with a four-character **abend code**, optionally takes a transaction dump, and tells the user. Codes beginning with `A` are CICS's own; applications can issue their own with `EXEC CICS ABEND ABCODE()`.

The ones worth knowing by heart: **ASRA** — the program took a program check, the CICS form of `S0C4` or `S0C7`; message `DFHSR0001` or `DFHAP0001` gives the underlying code and the offset. **ASRB** — an operating system abend happened inside the task. **AICA** — the task ran too long without giving up control and was judged to be looping. **AEIx and AEYx** — an `EXEC CICS` command raised a condition the program did not handle: `AEI0` is `PGMIDERR` (program not found or disabled), `AEIM` `NOTFND`, `AEIL` `DSIDERR`, `AEY9` a command issued for a facility, typically Db2 or MQ, whose connection is not available. **APCT** — a program could not be loaded. **AKCT and ATNI** — a terminal read timed out or the session failed. **AZI6** and its relatives — a linked region or connection failed.

For ASRA the method is the same as for any program check: find the offset of the failing instruction, look it up in the compiler listing, and inspect the fields involved. `CEDF`, a debugger, or a product such as Fault Analyzer shortens this considerably.

The `AEIx` family is usually avoidable. A program that tests `RESP` after each command handles `NOTFND` itself and never abends for it.
