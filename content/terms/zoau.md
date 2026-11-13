---
title: "Z Open Automation Utilities"
params:
  expansion: "IBM Z Open Automation Utilities (ZOAU)"
  short: "Shell commands and Python APIs for z/OS tasks, so scripts can manage data sets and jobs without JCL."
  ref: { title: "IBM Docs: IBM Z Open Automation Utilities", url: "https://www.ibm.com/docs/en/zoau" }
  aka: ["ZOAU", "zoautil"]
  related: ["z/OS UNIX", "Ansible for IBM Z", "Dependency Based Build", "Zowe", "Wazi Deploy", "Zowe CLI", "Python on z/OS", "Shell Script"]
  links:
    - title: "IBM Docs: Why Z Open Automation Utilities"
      url: "https://www.ibm.com/docs/en/zoau/1.4.x?topic=why-zoau"
categories: ["Modern Z"]
tags: ["devops", "automation", "tooling"]
---

ZOAU exposes classic z/OS operations as UNIX-style commands: `dls` to list data sets, `dcp` to copy, `dtouch` to allocate, `dgrep` to search, `jsub` to submit a job and `jls` to check it. A matching **Python** package (`zoautil_py`) gives the same operations to scripts.

Its importance is as plumbing. Ansible for IBM Z modules call it, DBB build scripts call it, and any pipeline step that needs to touch a data set can be a few lines of Python instead of a generated JCL deck.

ZOAU is installed on z/OS UNIX and needs a few environment variables — `ZOAU_HOME`, plus additions to `PATH` and `LIBPATH` — before the commands are found; a missing variable is the usual first failure. It is a separately orderable, no-charge product, and its Python package must match the installed ZOAU level. Beyond data sets and jobs it covers operator commands (`opercmd`), running MVS programs with DD names from the shell (`mvscmd` and `mvscmdauth`), and reading or converting text with the right code page.

`mvscmd` is the piece that changes how scripts are written: `mvscmd --pgm=IDCAMS --sysprint=* --sysin=...` runs a utility directly from the shell, with no job submitted and no spool output to fetch and parse afterwards. The limit is that it runs under your shell's address space and authority, so anything a batch job would need — particular job classes, scheduling, restart — still belongs in **JCL**.
