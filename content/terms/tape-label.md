---
title: "Tape Label"
params:
  expansion: "Tape labels, volume serials and scratch tapes"
  short: "The header records at the start of a tape that identify the volume and each file on it, so the system can check the right tape was mounted."
  ref: { title: "IBM Docs: Using magnetic tape labels", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=volumes-using-magnetic-tape-labels" }
  aka: ["standard label", "SL", "NL", "BLP", "VOL1", "HDR1", "scratch tape", "scratch volume", "LABEL=", "EXPDT", "RETPD", "tape mark"]
  related: ["Virtual Tape", "DFSMSrmm", "3592", "TS7700", "DD Statement", "UNIT", "GDG", "OAM"]
categories: ["Storage"]
tags: ["tape", "storage", "operations"]
---

A tape has no VTOC and no catalog of its own contents. What identifies it is a set of **labels** written on the tape itself. With IBM **standard labels** (`SL`), the tape begins with a `VOL1` record holding the six-character volume serial, and each file is wrapped in header labels (`HDR1`, `HDR2`) and trailer labels (`EOF1`, `EOF2`) recording the data set name, the record attributes, a creation date and an expiry date, with **tape marks** separating the parts.

When a job asks for a tape, the system reads the labels and verifies that the volume serial and data set name are the ones requested before letting the program proceed. `LABEL=(2,SL)` asks for the second file on the volume. Other label types exist: `NL` (no labels) for tapes from other platforms, ISO/ANSI labels (`AL`), and `BLP` — bypass label processing — which skips every check and is therefore restricted by the security system.

A **scratch** tape is one whose contents are no longer wanted and which may be overwritten. A job that writes a new tape data set normally asks for "any scratch volume"; a job that names a volume wants a **specific** one. Which volumes are scratch is decided by the **tape management system** — DFSMSrmm or a vendor product — from the retention rules, including `EXPDT` and `RETPD` in the JCL.

All of this still applies to virtual tape, where the "volume" is a file in a disk cache. The labels, the serial numbers and the scratch pool are emulated faithfully, because the software above expects them.
