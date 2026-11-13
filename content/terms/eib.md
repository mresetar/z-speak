---
title: "EIB"
params:
  expansion: "EXEC Interface Block"
  short: "The control block CICS gives every task, holding the transaction ID, terminal, time, the key the user pressed and the result of the last command."
  ref: { title: "IBM Docs: EIB response and function codes reference", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=reference-eib-response-function-codes" }
  aka: ["EXEC interface block", "DFHEIBLK", "EIBTRNID", "EIBRESP", "EIBRESP2", "EIBTRMID", "EIBTASKN", "DFHAID"]
  related: ["EXEC CICS", "CICS", "Pseudo-Conversational", "Channels and Containers", "BMS", "CICS Transaction", "COBOL", "CICS Abend Codes"]
categories: ["Middleware"]
tags: ["cics", "development", "internals"]
---

Every CICS task has an **EXEC interface block**, and every program running under it can read the fields. The CICS translator adds the definition (`DFHEIBLK`) to a COBOL program's linkage section automatically, so the fields can be used by name without any declaration.

Some fields describe the task: `EIBTRNID` is the transaction code that started it, `EIBTRMID` the terminal, `EIBTASKN` the task number that appears in messages and traces, `EIBDATE` and `EIBTIME` when it began. Others describe the latest interaction. `EIBAID` holds the attention key the user pressed — Enter, a PF key, Clear — and is compared with constants from the `DFHAID` copybook. `EIBCPOSN` is the cursor position. `EIBCALEN` is the length of the COMMAREA passed to the program: zero means none was passed, which is how a pseudo-conversational program recognises that this is the first time through.

After each command, CICS sets `EIBRESP` and `EIBRESP2` (the condition and a more detailed reason), `EIBFN` (which command it was) and `EIBRCODE`. In practice programs code `RESP(ws-field)` on the command and compare the result with `DFHRESP(NORMAL)`, `DFHRESP(NOTFND)` and so on, which reads the same information more conveniently.

Two cautions. The EIB is read-only in spirit: programs should never store into it. And testing `EIBCALEN` before touching the COMMAREA is not optional — addressing a COMMAREA that was not passed is a classic cause of an ASRA on the first execution of a new transaction.
