---
title: "Hercules"
params:
  expansion: "The Hercules System/370, ESA/390 and z/Architecture emulator"
  short: "An open-source emulator of IBM mainframe hardware, widely used by hobbyists and learners to run MVS 3.8J and Linux."
  ref: { title: "Wikipedia: Hercules (emulator)", url: "https://en.wikipedia.org/wiki/Hercules_(emulator)" }
  aka: ["Hyperion", "SDL Hercules", "TK4-", "TK5", "MVS 3.8J", "Macframe"]
  related: ["ZD&T", "MVS", "z/Architecture", "Linux on IBM Z", "SYSGEN", "3270", "z/VM"]
  links:
    - title: "SDL Hercules 4.x Hyperion documentation"
      url: "https://sdl-hercules-390.github.io/html/"
categories: ["Modern Z"]
tags: ["open-source", "learning", "tooling"]
---

Hercules is a program that behaves like a mainframe. Started by Roger Bowler in 1999, it implements the System/370, ESA/390 and z/Architecture instruction sets and emulates disks, tapes, card readers, printers and 3270 terminals as ordinary files and network connections. It runs on Linux, Windows and macOS; the actively maintained line is the SDL Hyperion fork.

What you run on it is a legal question, not a technical one. IBM's current operating systems are licensed only for IBM hardware and authorised emulators, so z/OS on Hercules is not permitted. What is freely usable are the operating systems IBM released without restriction in the 1970s — above all **MVS 3.8J** — and Linux for s390x.

MVS 3.8J is therefore the hobbyist's mainframe, distributed as turnkey systems (TK4-, and its successor TK5) that IPL in a minute with TSO, a job entry subsystem, compilers and an ISPF-like editor added by volunteers. Packages such as Macframe wrap all this for a Mac.

It is an excellent place to learn JCL, TSO, assembler and how an IPL works. It is also a 24-bit system from 1981: no z/OS UNIX, no Db2, no sysplex.
