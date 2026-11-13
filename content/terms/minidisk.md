---
title: "Minidisk"
params:
  expansion: "z/VM minidisk (MDISK)"
  short: "A z/VM virtual disk — a defined slice of a real DASD volume handed to a virtual machine as if it were its own."
  ref: { title: "IBM Docs: z/VM — Linking and sharing minidisks", url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=defined-linking-sharing-minidisks" }
  aka: ["MDISK", "T-disk"]
  related: ["z/VM", "Linux on IBM Z", "DASD", "CMS"]
  links:
    - title: "IBM Docs: Protecting z/VM Minidisks"
      url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=resources-protecting-zvm-minidisks"
categories: ["Operating System"]
tags: ["vm", "virtualization", "storage"]
---

Under z/VM, a guest never sees a physical volume. The **user directory** defines, per virtual machine, which ranges of which DASD volumes that guest owns; each range appears to the guest as a complete, private disk — a **minidisk** — addressed as a virtual device (vdev) number, classically 191 for a CMS user's A-disk.

Minidisks are how z/VM carves one DASD among hundreds of guests, and why z/VM achieved density no other platform matched for decades: the hypervisor does all the mapping, and the guest can format and use its minidisk without knowing or caring what else lives on the volume. Related tricks in the same family: T-disks (allocated on the fly) and the minidisk cache (an in-memory cache in front of DASD).

The newcomer mistake is size and sharing: a minidisk is a fixed extent, not a file system that grows, and by default it is *not* shared between guests — multiple guests can link to one read-only, but writing needs explicit links and coordination. Linux guests on z/VM often bypass minidisks in favour of dedicated or FCP devices.
