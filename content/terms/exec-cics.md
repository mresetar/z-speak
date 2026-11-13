---
title: "EXEC CICS"
params:
  expansion: "CICS command-level application programming interface"
  short: "The commands a program embeds to ask CICS for services — LINK, READ FILE, SEND MAP, SYNCPOINT — the same in COBOL, PL/I, C and assembler."
  ref: { title: "IBM Docs: Programming languages and the CICS API", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=development-programming-languages-cics-api" }
  aka: ["CICS API", "EXEC CICS LINK", "CICS translator", "EIB", "JCICS", "SPI"]
  related: ["CICS", "Channels and Containers", "Unit of Work", "COBOL", "Language Environment", "CEMT", "TSQ", "TDQ", "BMS", "Pseudo-Conversational"]
  links:
    - title: "IBM Docs: EXEC CICS command format and programming considerations"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=reference-exec-cics-command-format-programming-considerations"
categories: ["Development"]
tags: ["cics", "development", "api"]
---

A CICS program does not open files, listen on sockets or manage threads itself. It asks CICS to, with commands written inline in the source: `EXEC CICS READ FILE('CUSTFILE') INTO(CUST-REC) RIDFLD(CUST-KEY) END-EXEC` in COBOL, and the same shape in PL/I, C and assembler. `LINK` and `XCTL` call other programs. `SEND MAP` and `RECEIVE MAP` drive the 3270 screen through BMS. `START` schedules a transaction. `SYNCPOINT` and `SYNCPOINT ROLLBACK` end a unit of work. Because every language has the same command set, a COBOL program can `LINK` to a C or Java program, and CICS handles the call.

The compiler does not understand `EXEC CICS`. A **translator**, either a separate step or integrated into the compiler with the `CICS` option, turns each command into a call to the CICS interface stub linked into your load module. At run time the program gets the **EIB** (EXEC Interface Block), with fields like `EIBTRNID`, `EIBCALEN` and `EIBRESP`. Code `RESP(ws-resp)` on each command and check it, rather than using the old `HANDLE CONDITION` gotos. Java uses the **JCICS** classes (`Program.link()`, `Container.put()`), and the `EXEC CICS INQUIRE`/`SET` commands that manage the region itself are the separate **SPI** (system programming interface).

The habits newcomers bring from batch are the ones that break. No COBOL `OPEN`/`READ` of files. No `STOP RUN`: end with `EXEC CICS RETURN` or `GOBACK`. No waiting for a user while holding storage and locks. Classic CICS screens are **pseudo-conversational**: the program sends a screen, issues `RETURN TRANSID('ABCD')` with its state in a COMMAREA or channel, and ends. When the user presses Enter, a fresh task starts. That is how one region serves thousands of terminals.
