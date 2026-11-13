---
title: "z/OS UNIX"
params:
  expansion: "z/OS UNIX System Services"
  short: "The certified UNIX inside z/OS: a POSIX file system, shell and processes, alongside classic MVS."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is z/OS UNIX?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconc_whatiszunix.htm" }
  aka: ["USS", "OMVS", "OpenEdition"]
  related: ["z/OS", "zFS", "Zowe", "MVS", "Python on z/OS", "Git on z/OS", "CICS Bundle", "OMVS Segment", "Kerberos", "OpenSSH", "C/C++"]
  links:
    - title: "Wikipedia: UNIX System Services"
      url: "https://en.wikipedia.org/wiki/UNIX_System_Services"
categories: ["Operating System"]
tags: ["unix", "zos"]
---

Full POSIX: `/bin`, `/etc`, `/u/userid`, `fork()`, pipes, `vi`, `ssh`. Files live in **zFS** file systems mounted into one hierarchy. You reach the shell by typing `OMVS` under TSO, or — far more comfortably — by `ssh`.

This is where anything written in the last twenty years runs: Java, Liberty, Node.js, Python, Git, Zowe, z/OS Connect. The friction points are the ones you would expect from bridging two worlds — EBCDIC versus ASCII file tagging, and UNIX permission bits sitting next to **RACF** profiles.

Historically called OpenEdition, then OS/390 UNIX; the abbreviation **USS** is still everywhere, even though IBM stopped using it.

Every user who touches it needs an **OMVS segment** in their security profile, giving a numeric UID, a home directory and an initial program; a TSO user without one gets an error on the first UNIX call. Superuser is UID 0, but z/OS prefers finer-grained permissions through the `UNIXPRIV` class and `BPX.*` profiles, so that few people need it. Processes are **dubbed** address spaces: any batch job or started task becomes a UNIX process the moment it uses a UNIX service, which is why TCP/IP programs in plain batch still need an OMVS segment.

Text encoding is the daily friction. Files can carry a **tag** recording their code page, and with automatic conversion switched on (`_BPXK_AUTOCVT`) tools read ASCII and EBCDIC files alike; untagged files written by ported tools are the usual source of garbage on screen. The kernel is configured in the `BPXPRMxx` PARMLIB member, which also lists the file systems mounted at IPL. Batch access goes through `BPXBATCH`, and data sets and UNIX files can be copied in both directions with `cp` and `OCOPY`.
