---
title: "CEMT"
params:
  expansion: "CICS master terminal transaction"
  short: "The CICS operator's command line: inquire on, change and shut down a running region from a 3270 screen or the MVS console."
  ref: { title: "IBM Docs: CEMT - master terminal", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=transactions-cemt" }
  aka: ["master terminal", "main terminal", "CICS-supplied transactions", "CESN", "CESF", "CECI", "CEDF"]
  related: ["CICS", "CSD", "SIT", "MODIFY Command", "CMCI", "3270", "CICS Transaction", "CICS Abend Codes", "CICS Explorer"]
  links:
    - title: "IBM Docs: CEMT INQUIRE commands"
      url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=terminal-cemt-inquire-commands"
categories: ["Middleware"]
tags: ["cics", "operations"]
---

CEMT is a transaction like any other — four characters typed on a clear 3270 screen — but the program behind it manages the region itself. It has four verbs: `INQUIRE` (look), `SET` (change), `PERFORM` (act), `DISCARD` (remove). `CEMT I SYS` shows region-wide settings such as the default user, `CEMT I TCPIPSERVICE` finds the port a service listens on, `CEMT SET PROGRAM(PAYROLL) NEWCOPY` picks up a freshly link-edited load module, and `CEMT PERFORM SHUTDOWN` ends the region cleanly. Keywords abbreviate to the shortest unique prefix, so `I SYS` and `INQUIRE SYSTEM` are the same command.

It belongs to a family of IBM-supplied transactions whose names all start with **C**: **CESN** and **CESF** sign on and off, **CEDA** defines resources in the CSD, **CECI** runs a single `EXEC CICS` command interactively, and **CEDF** steps through a program one command at a time. Letters `C…` are reserved for CICS, which is why your own transaction IDs should never start with one.

What newcomers get wrong: a `CEMT SET` changes the *installed* copy of a resource in the running region, not its definition in the CSD. It takes effect at once and is lost at the next cold or initial start. For a permanent change, fix the definition. Every CEMT command also works from the MVS console as `F jobname,CEMT …`, and CMCI-based tools like the Zowe CICS extension run CEMT for you — you can see it in their task list.
