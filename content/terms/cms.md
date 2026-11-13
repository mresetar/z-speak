---
title: "CMS"
params:
  expansion: "Conversational Monitor System"
  short: "The single-user operating system that each z/VM user runs in their own virtual machine for editing, scripting and administration."
  ref: { title: "Wikipedia: Conversational Monitor System", url: "https://en.wikipedia.org/wiki/Conversational_Monitor_System" }
  aka: ["VM/CMS", "CP/CMS", "A-disk", "SFS", "PROFILE EXEC"]
  related: ["z/VM", "Minidisk", "XEDIT", "REXX", "CMS Pipelines", "TSO/E"]
  links:
    - title: "IBM Docs: z/VM — Conversational Monitor System (CMS)"
      url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=product-conversational-monitor-system-cms"
categories: ["Operating System"]
tags: ["vm", "interactive", "virtualization"]
---

z/VM is two things. **CP**, the hypervisor, gives every user a virtual machine. **CMS** is the small operating system most of those users IPL inside it. It supports exactly one user, because it has a whole (virtual) machine to itself — multi-user behaviour comes from CP running many copies.

Files live on **minidisks** accessed under a letter, and are named by three tokens: file name, file type and file mode, as in `PROFILE EXEC A`. The file type does the work of an extension — `EXEC` is a REXX program, `XEDIT` an editor macro. You edit with **XEDIT**, script in **REXX**, which was born here, and can share files through the Shared File System instead of linking each other's disks.

For a z/OS person, CMS fills the role of TSO/ISPF: the place a human logs on. For a Linux-on-Z administrator it is the environment where guests are defined, IPLed and repaired. Take care with "CP", which on a z/VM system means the Control Program and not a central processor.
