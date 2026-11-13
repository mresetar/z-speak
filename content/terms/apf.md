---
title: "APF Authorization"
params:
  expansion: "Authorized Program Facility"
  short: "The privilege that lets a program bypass normal restrictions — the mainframe equivalent of root, granted per library."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is the authorized program facility?", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=integrity-what-is-authorized-program-facility" }
  aka: ["APF-authorized", "APF list"]
  related: ["RACF", "PSW", "LNKLST", "PARMLIB", "Systems Programmer", "Storage Key", "Binder", "RACF Class"]
  links:
    - title: "IBM Docs: APF-authorized library list"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=functions-apf-authorized-library-list"
categories: ["Security"]
tags: ["security", "sysprog"]
---

An APF-authorized program can issue privileged services, switch into **supervisor state**, change its storage protection key, and read or alter anything on the system. Authorization is a property of the *library*, listed in `PROGxx` in **PARMLIB** — every module in an APF library is authorized, and the entire load module chain must stay authorized for the privilege to hold.

This makes the APF list one of the highest-value audit targets on z/OS: write access to any library on it is effectively write access to the operating system. Auditors check two things — who can update APF libraries, and whether any library on the list has loose RACF protection.

Legitimate users are subsystems, monitors and vendor products that need to reach system control blocks. Application code should never need it.
