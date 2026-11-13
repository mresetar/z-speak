---
title: "IMS Status Code"
params:
  expansion: "DL/I status code in the PCB"
  short: "The two-character code IMS puts in the PCB after every DL/I call; blanks mean success, and the program must test it each time."
  ref: { title: "IBM Docs: IMS 15.5 — DL/I status codes", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=codes-dli-status" }
  aka: ["GE", "GB", "II", "QC", "QD", "AI", "PCB status", "U3303", "IMS abend code"]
  related: ["DL/I", "PSB", "Segment", "IMS", "SQLCODE", "IMS Region", "Checkpoint/Restart", "HDAM and HIDAM"]
categories: ["Middleware"]
tags: ["ims", "troubleshooting", "development"]
---

IMS reports the outcome of a database or message call by setting a **status code** in the **PCB** that the call used — two characters at a fixed position in the PCB mask the program defines. It does not abend for ordinary conditions, so a program that fails to look carries on with whatever was in its I/O area before the call.

Blanks mean the call succeeded. A few others are part of normal logic. `GE`: segment not found for a get or position not found for an insert. `GB`: end of database reached on a `GN`. `GA` and `GK`: an unqualified get moved to a different level or segment type — informational. `II`: an insert found the segment already there. For message processing, `QC` means there are no more messages on the queue and `QD` no more segments in the current message, which is how a transaction program knows it is done.

Others indicate program or definition errors. Codes beginning with `A` are mostly about the call itself: `AD` an invalid function code, `AK` an invalid field name in a segment search argument, `AJ` a malformed SSA, `AI` a data set that could not be opened — often a JCL or allocation problem. `DJ` and `DA` come from replacing or deleting without a prior get-hold, or changing a key field.

Most installations route unexpected codes to a standard error routine that displays the PCB — database name, segment level, status, key feedback area — and ends with a user abend. Separately, IMS issues its own **abend codes** such as `U0456` (program stopped) or `U3303` (database unavailable), which are a different list from the status codes.
