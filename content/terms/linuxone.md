---
title: "LinuxONE"
params:
  expansion: "IBM LinuxONE"
  short: "IBM's Linux-only Z family — the same enterprise mainframe hardware, priced and marketed for Linux workloads."
  aka: ["LinuxONE Community Cloud", "Emperor", "Rockhopper"]
  related: ["IBM Z", "Linux on IBM Z", "z/VM", "LPAR", "DPM", "Secure Execution", "Hyper Protect", "OpenShift on IBM Z"]
  ref: { title: "IBM LinuxONE", url: "https://www.ibm.com/linuxone" }
  links:
    - title: "Wikipedia: LinuxONE"
      url: "https://en.wikipedia.org/wiki/LinuxONE"
categories: ["Hardware"]
tags: ["linux", "hardware", "cloud"]
---

LinuxONE is IBM Z hardware running Linux only — no z/OS, no CP/CMS licensing — packaged for buyers whose interest is consolidating hundreds or thousands of Linux servers onto one machine. Same CPUC (chips, frames, I/O), same virtualization stack (LPAR plus z/VM or KVM), same RAS and I/O bandwidth; the difference is the licensing model, including per-virtual-server pricing that makes small Linux guests economical.

The hands-on way most people meet it is the **LinuxONE Community Cloud**: a free virtual machine running RHEL or Ubuntu on real IBM Z iron, for learning and porting — s390x binaries behave exactly as they would on a customer's machine.

A common confusion: LinuxONE is not a different architecture. Anything you learn on a LinuxONE box — `s390x` packages, DASD and FCP storage, z/VM guests — transfers directly to Linux under z/OS in an LPAR of a general-purpose Z.
