---
title: "Channels and Containers"
params:
  expansion: "CICS channels and containers"
  short: "CICS's way to pass data between programs: named containers of any size, grouped in a channel, with code-page conversion built in."
  ref: { title: "IBM Docs: Transferring data between programs using channels", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=applications-transferring-data-between-programs-using-channels" }
  aka: ["CICS channel", "container", "COMMAREA", "PUT CONTAINER", "GET CONTAINER"]
  related: ["CICS", "EXEC CICS", "COBOL", "Copybook", "EBCDIC", "z/OS Connect", "TSQ", "EIB", "CICS Transaction Gateway"]
  links:
    - title: "IBM Docs: Transferring data between programs using channels"
      url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=applications-transferring-data-between-programs-using-channels"
categories: ["Development"]
tags: ["cics", "development"]
---

For decades CICS programs passed data in a **COMMAREA**: one block of storage, at most 32 KB, whose layout both programs agreed on through a shared copybook. It still works, and most existing code uses it. But the size limit and the single flat layout are the reasons it was replaced.

A **container** is a named block of data (up to 16 characters, case-sensitive) with no fixed size limit. A **channel** is a named set of containers. A program builds one with `EXEC CICS PUT CONTAINER(…) CHANNEL(…)` and passes it on with `EXEC CICS LINK PROGRAM(…) CHANNEL(…)`. The called program reads the containers it cares about, updates them, adds more, and returns. Each side reads only what it needs, so new fields can be added without breaking every caller.

The feature that matters for mixed-language applications is container **type**. A `BIT` container is passed as raw bytes. A `CHAR` container is text, and CICS converts its code page on `GET` — EBCDIC for the COBOL program, UTF-8 for the Java program that linked to it. Put text in `CHAR` containers and binary structures in `BIT` ones. Getting this backwards is the classic source of scrambled data.

Channels are also how CICS's own web support passes data: a JSON request that arrives through CICS or z/OS Connect is transformed into a language structure and handed to the target program in a container.
