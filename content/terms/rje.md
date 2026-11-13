---
title: "RJE"
params:
  expansion: "Remote Job Entry"
  short: "Submitting batch jobs from a remote workstation and getting the printout back there — the terminal-to-host ancestor of NJE."
  ref: { title: "Wikipedia: Remote job entry", url: "https://en.wikipedia.org/wiki/Remote_job_entry" }
  aka: ["RJP", "remote workstation", "2780", "3780"]
  related: ["NJE", "JES", "HASP", "SYSOUT", "SNA", "z/OSMF"]
  links:
    - title: "IBM Docs: Remote job entry (RJE)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-remote-job-entry-rje"
categories: ["Operating System"]
tags: ["history", "batch", "network"]
---

An RJE workstation was originally a card reader and a printer at a branch office, connected to the central mainframe by a telephone line. Decks read in at the remote site entered the job queue; the output came back and printed there. JES2 calls the facility RJE, JES3 called it RJP, and the workstation types — 2780, 3780, later SNA devices — became de facto file-transfer protocols that emulators spoke for decades.

The difference from **NJE** is the relationship: RJE is a host and a dumb remote, NJE is two job entry subsystems as equals.

Real RJE is now rare. Its descendants are every way of getting a job into the system from somewhere else — the FTP `SITE FILETYPE=JES` interface, the z/OSMF jobs REST API, `zowe jobs submit` — and the idea of routing output to a named remote destination, which lives on in `DEST=`.
