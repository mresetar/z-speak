---
title: "BMS"
params:
  expansion: "Basic Mapping Support"
  short: "The CICS facility that defines 3270 screens as maps, so programs work with named fields instead of raw terminal data."
  ref: { title: "IBM Docs: CICS — Basic Mapping Support (BMS)", url: "https://www.ibm.com/docs/en/cics-ts/5.5.0?topic=examples-basic-mapping-support-bms" }
  aka: ["map", "mapset", "DFHMDF", "SEND MAP", "RECEIVE MAP", "symbolic map", "MAPFAIL"]
  related: ["CICS", "3270", "EXEC CICS", "Pseudo-Conversational", "Copybook", "HLASM", "CICS Transaction", "MFS", "EIB"]
  links:
    - title: "IBM Docs: BMS map set, map, and field definition"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=macros-bms-map-set-map-field-definition"
categories: ["Middleware"]
tags: ["cics", "development", "terminal"]
---

A 3270 screen is a grid of fields, each with a position, a length and attributes such as protected, numeric or bright. BMS lets a developer describe that layout once, as a **map**, using three assembler macros: `DFHMSD` for a mapset, `DFHMDI` for a map within it, and `DFHMDF` for each field.

The definition is assembled twice. One pass produces the **physical map**, a load module CICS uses to build and interpret the data stream. The other produces the **symbolic map**, a copybook for the application in which every named field appears with suffixes: `L` for the length entered, `A` for its attribute, `I` for input and `O` for output data.

The program then issues `EXEC CICS SEND MAP` to display a screen and `RECEIVE MAP` to read what the user typed, moving data to and from those fields. If the user pressed a key without entering anything, the `MAPFAIL` condition is raised — the first error every CICS programmer meets.

BMS ties presentation closely to the program, which is what modernisation projects work around: either by wrapping the screens so that they can be driven as a service, or by separating the business logic so that it can be called without any map.
