---
title: "Pseudo-Conversational"
params:
  expansion: "Pseudo-conversational programming"
  short: "The CICS design in which a program ends after every screen and a new task starts when the user responds."
  ref: { title: "IBM Docs: CICS — Pseudoconversational processing", url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=users-pseudoconversational-processing" }
  aka: ["pseudoconversational", "conversational", "RETURN TRANSID", "EIBCALEN", "EIBAID", "pseudo-conversation"]
  related: ["CICS", "BMS", "CICS Transaction", "EXEC CICS", "Channels and Containers", "TSQ", "3270", "MFS", "EIB"]
  links:
    - title: "IBM Docs: Pseudoconversational transactions"
      url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=restrictions-pseudoconversational-transactions"
categories: ["Middleware"]
tags: ["cics", "development", "fundamentals"]
---

A person looking at a screen takes seconds or minutes to respond. A program that simply waits — a **conversational** program — keeps its task, storage and any locks for all that time, and a few thousand such users would exhaust the region.

The pseudo-conversational design avoids waiting altogether. The program sends a screen and ends with `EXEC CICS RETURN TRANSID('ABCD') COMMAREA(state)`. Nothing is running while the user thinks. When they press Enter, CICS starts a new task for transaction `ABCD` and gives the program the saved state. To the user it feels like one conversation; to CICS it is a series of unrelated, very short tasks.

The program therefore has to work out where it is each time it starts. `EIBCALEN` equal to zero means this is the first entry and there is no state yet. `EIBAID` says which key was pressed. Whatever must be remembered travels in the COMMAREA, in a channel, or in a temporary storage queue.

Two consequences shape CICS applications. Database locks cannot be held across screens, so updates must re-read and verify the data before changing it. And because each interaction is self-contained, the style converts readily into stateless service calls — the same discipline web applications later rediscovered.
