---
title: "SYSGEN"
params:
  expansion: "System Generation"
  short: "The historical process of building an operating system tailored to one machine by assembling macros — and still the word for IMS's equivalent."
  ref: { title: "Wikipedia: System Generation (OS)", url: "https://en.wikipedia.org/wiki/System_Generation_(OS)" }
  aka: ["system generation", "Stage 1", "Stage 2", "gen", "IOGEN"]
  related: ["SMP/E", "HCD", "PARMLIB", "IMS", "MVS", "Hercules"]
categories: ["Operating System"]
tags: ["history", "sysprog", "maintenance"]
---

On OS/360 and MVS up to the 1980s, an operating system was not installed but *generated*. The systems programmer coded **Stage 1** macros describing the processor, every I/O device and the options wanted; assembling them produced **Stage 2**, a long job stream that assembled and link-edited the nucleus and libraries for exactly that configuration. Adding a disk drive could mean a partial gen and an IPL.

z/OS has no SYSGEN. Its three jobs were split up and made dynamic: I/O definition went to **HCD**, product installation and service to **SMP/E**, and system options to **PARMLIB** members read at IPL.

The word survives in two places. **IMS** still has a system definition process with Stage 1 and Stage 2 that everyone calls an "IMS gen", and people say "gen" loosely for any definition step that needs assembling. And anyone running MVS 3.8J under **Hercules** gets to do the real thing.
