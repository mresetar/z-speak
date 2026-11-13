---
title: "OMVS Segment"
params:
  expansion: "OMVS segment of a RACF user or group profile (UID, GID, UNIXPRIV)"
  short: "The part of a RACF profile that gives a user or group its z/OS UNIX identity: a numeric UID or GID, a home directory and a shell."
  ref: { title: "IBM Docs: The OMVS segment in user profiles", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=profiles-omvs-segment-in-user" }
  aka: ["UID", "GID", "UID(0)", "superuser", "BPX.SUPERUSER", "BPX.DAEMON", "BPX.UNIQUE.USER", "AUTOUID", "HOME", "PROGRAM", "FSP", "file security packet", "ICH408I UNIX"]
  related: ["z/OS UNIX", "RACF", "RACF Class", "RACF Group", "User Attributes", "zFS", "Started Task", "OpenSSH", "RACF Profile"]
categories: ["Security"]
tags: ["security", "unix", "access-control"]
---

z/OS UNIX identifies users the UNIX way, by number. The numbers live in RACF: a user profile's **OMVS segment** holds the **UID**, the home directory and the initial program (normally the shell), and a group profile's OMVS segment holds the **GID**. `ALTUSER FRED OMVS(UID(1205) HOME('/u/fred') PROGRAM('/bin/sh'))` sets one up, and `LISTUSER FRED OMVS` shows it.

Anything that uses a UNIX service needs one — and that is wider than it sounds. TCP/IP sockets are a UNIX service, so batch jobs, started tasks and CICS regions that use the network need an OMVS segment, as does the user's **default group**. A missing segment produces message `ICH408I` with "OMVS segment not defined" and an error from the first UNIX call. Rather than assigning thousands by hand, sites let RACF generate them automatically (`BPX.UNIQUE.USER` with `AUTOUID`).

File access then follows UNIX rules: each file has an owner UID, a group GID, permission bits and optional access control lists, checked by RACF.

**UID 0** is the superuser and bypasses those checks. Giving it out freely is the commonest z/OS UNIX audit finding, and RACF offers better tools. `BPX.SUPERUSER` in the `FACILITY` class lets a named user switch to superuser when needed and leaves a trace. The `UNIXPRIV` class grants single abilities, such as mounting file systems or reading any file, without full power. And several users sharing one UID — especially zero — makes ownership and audit records ambiguous, so UIDs should be unique.

Servers that change identity, such as the SSH daemon, additionally need `BPX.DAEMON` and a program-controlled environment.
