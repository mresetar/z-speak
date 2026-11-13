---
title: "Shell Script"
params:
  expansion: "z/OS UNIX shell scripting (/bin/sh, tcsh and bash)"
  short: "A file of z/OS UNIX shell commands run as a program: the UNIX-side counterpart of a CLIST or REXX exec, used for builds, installs and automation."
  ref: { title: "IBM Docs: Using TSO/E commands in shell scripts", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=scripts-using-tsoe-commands-in-shell" }
  aka: ["shell", "/bin/sh", "z/OS shell", "tcsh", "bash", ".profile", "BPXBATCH script", "shebang", "tsocmd", "awk", "sed"]
  related: ["z/OS UNIX", "REXX", "CLIST", "Z Open Automation Utilities", "OpenSSH", "JCL", "Git on z/OS", "CI/CD Pipeline", "CCSID", "Python on z/OS"]
categories: ["Development"]
tags: ["language", "unix", "automation"]
---

z/OS UNIX has a shell, and with it **shell scripts**. The standard one, `/bin/sh`, is a POSIX shell descended from the Korn shell; `tcsh` is supplied as an alternative; and **bash**, which most people from Linux expect, is not part of z/OS but is readily installed from IBM's or the open-source community's ported tools. Scripts written for bash may use features the default shell lacks, so the first line — `#!/bin/sh` or `#!/bin/env bash` — matters.

The usual tools are there: `grep`, `sed`, `awk`, `find`, `sort`, pipes and redirection. What makes scripting on z/OS distinctive is the bridge to the other side of the system. `tso` and `tsocmd` run TSO commands; `cp` copies between UNIX files and data sets written as `"//'MY.DATA.SET'"`; `submit` sends JCL to JES; and **ZOAU** adds commands to allocate, list and search data sets, run MVS programs and issue operator commands. REXX execs can also be run directly as shell scripts.

Scripts are everywhere in modern z/OS work: product installation and configuration, the start-up scripts of Java servers, build steps driven by a pipeline, and anything executed over SSH by Ansible or a CI runner. In batch, a script is run with the `BPXBATCH` or `BPXBATSL` program, with its output directed to files or SYSOUT.

The pitfalls are about encoding and environment. A script file must be in the code page the shell expects — EBCDIC by default — or be correctly **tagged**; a script edited on a workstation and uploaded as binary fails with baffling syntax errors, often caused by ASCII line ends. And a script run from batch or SSH does not get the interactive login's `.profile` unless it asks for it, so paths and variables that work at the terminal are missing.
