---
title: "Health Checker"
params:
  expansion: "IBM Health Checker for z/OS"
  short: "A z/OS component that continuously compares the running configuration with best practices and reports exceptions."
  ref: { title: "IBM Docs: IBM Health Checker for z/OS User's Guide", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=level-health-checker-zos-users-guide" }
  aka: ["HZSPROC", "health check", "HZSPRMxx", "SDSF CK", "migration check"]
  related: ["SDSF", "PARMLIB", "Started Task", "Parallel Sysplex", "RAS", "Systems Programmer", "SMP/E", "zSecure"]
  links:
    - title: "IBM Docs: Setting up IBM Health Checker for z/OS"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-setting-up-health-checker"
categories: ["System Services"]
tags: ["operations", "sysprog", "availability"]
---

Many outages come from configurations that work until the day they do not: a single point of failure in the couple data sets, a nearly full common storage area, a setting left at an old default. Health Checker automates the review that would catch them. It runs as a started task and hosts **checks** written by z/OS components, IBM products and other vendors. Each check runs on an interval, compares what it finds with the owner's recommendation, and reports success or an **exception** with a severity and an explanation.

The `CK` panel in **SDSF** lists every check with its status and lets you browse the output. Exceptions also appear as console messages, where automation can pick them up.

Not every recommendation suits every site, so checks can be given different parameters or deactivated in `HZSPRMxx`. The discipline is to make that a decision: tune or disable a check with a documented reason, instead of letting a wall of permanent exceptions teach everyone to ignore the panel. **Migration checks** are a special group that warn, before an upgrade, about functions you use that the next release changes or removes.
