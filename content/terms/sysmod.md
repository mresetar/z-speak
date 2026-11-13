---
title: "SYSMOD"
params:
  expansion: "System Modification"
  short: "The packaged unit of change that SMP/E installs — a function (FMID), a fix (PTF or APAR) or a customer modification (USERMOD)."
  ref: { title: "IBM Docs: z/OS — SYSMODs", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sysmods-introduction" }
  aka: ["FMID", "USERMOD", "function modification"]
  related: ["SMP/E", "PTF", "APAR", "HOLDDATA"]
  links:
    - title: "IBM Docs: PTF, APAR, and USERMOD SYSMOD IDs"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sysmods-ptf-apar-usermod-sysmod-ids"
categories: ["System Services"]
tags: ["maintenance", "sysprog", "smp-e"]
---

Every change to z/OS software travels through SMP/E as a SYSMOD, a package of elements (modules, macros, samples, JCL) plus the metadata SMP/E needs: which FMID it belongs to, what it requires, what it supersedes.

The four types:

- **FMID (function modification)** — a whole product or a new function level; z/OS itself is delivered as FMIDs
- **PTF** — a tested fix, correcting a reported problem, for a previously installed FMID
- **APAR** — the problem report; IBM may ship a temporary APAR-fixing SYSMOD before the PTF
- **USERMOD** — a modification you write yourself, so SMP/E tracks it like anything else

People usually say "PTF" when they mean SYSMOD, but the umbrella term matters when you talk about the SMP/E database: the global zone indexes every SYSMOD that has been received, and APPLY/ACCEPT move it through the target and distribution zones.
