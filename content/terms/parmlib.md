---
title: "PARMLIB"
params:
  expansion: "SYS1.PARMLIB"
  short: "The configuration directory of z/OS — the members that decide how the system comes up and behaves."
  ref: { title: "IBM Docs: z/OS Basic Skills — z/OS system libraries (SYS1.PARMLIB)", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_syslibraries.htm" }
  aka: ["SYS1.PARMLIB", "PARMLIB member"]
  related: ["IPL", "LNKLST", "APF Authorization", "Systems Programmer", "Health Checker", "SYSRES", "Subsystem", "DSNZPARM", "Resolver", "Exit"]
  links:
    - title: "IBM Docs: Members of SYS1.PARMLIB"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-members-sys1parmlib"
categories: ["System Services"]
tags: ["sysprog", "configuration"]
---

Think `/etc`, but as members of a concatenation of data sets. Each member is named `xxxxxx` plus a two-character suffix chosen at IPL, so a system can carry several variants and pick one — `IEASYS00` names the set to use.

Members you will hear about: **IEASYSxx** (the master switchboard), **PROGxx** (APF list, LNKLST, exits), **COUPLExx** (sysplex definition), **SMFPRMxx** (which SMF records to cut), **CONSOLxx**, **IEFSSNxx** (subsystems), **BPXPRMxx** (z/OS UNIX and file system mounts).

Many members can be re-read on a running system with `SET` or `SETPROG` commands, which is a large part of why z/OS is reconfigured far more often than it is restarted.

The data set is `SYS1.PARMLIB`, but a system normally uses a **concatenation** of several, named in the `LOADxx` member, so that IBM's defaults, site-wide settings and system-specific members can be kept apart. The first member found wins. `IEASYSxx` holds parameters whose values are mostly the *suffixes* of other members — `SMF=01` means use `SMFPRM01` — and several suffixes can be listed so that members are merged.

One set of members can serve many systems through **system symbols** such as `&SYSNAME` and `&SYSCLONE`, defined in `IEASYMxx` and substituted when members are read. Two cautions. A change made with a command lasts only until the next IPL unless the member is updated as well, and a member updated without being activated can hide a syntax error until the next IPL, when it is least welcome — the `CHECK` options, a syntax checker and a test IPL exist for that reason. The `D PARMLIB` and `D IPLINFO` commands show what the running system actually used.
