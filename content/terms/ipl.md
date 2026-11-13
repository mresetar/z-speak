---
title: "IPL"
params:
  expansion: "Initial Program Load"
  short: "Booting a z/OS system. Used as a verb: “we IPL'd the LPAR overnight.”"
  ref: { title: "IBM Docs: z/OS Basic Skills — Starting z/OS: The initialization (IPL) process", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_initialization.htm" }
  aka: ["boot", "re-IPL", "load"]
  related: ["LPAR", "z/OS", "HMC", "Wait State", "SYSRES"]
  links:
    - title: "Wikipedia: Initial program load"
      url: "https://en.wikipedia.org/wiki/Initial_program_load"
categories: ["Hardware"]
tags: ["operations"]
---

IPL is the mainframe word for boot, and the terminology is older than "boot" itself. You IPL from a device address and a load parameter that points at the **IODF** and the `SYSn.IPLPARM` members describing the configuration to bring up.

The notable thing is how rarely it happens. Many z/OS systems go a year or more between IPLs, and an unplanned IPL is an incident. Most change — new software levels, new devices, new subsystems — is designed to be applied to a *running* system.

The sequence has recognisable stages. The hardware reads a small loader from the **SYSRES** volume; the loader finds the `LOADxx` member, which names the IODF and the master catalog; the **nucleus** is loaded; then **NIP** (nucleus initialisation) builds the system from `PARMLIB` members, starting with `IEASYSxx`. Next the master scheduler starts, then JES, and finally automation brings up the subsystems. If something stops early it shows as a **wait state** code on the HMC, since there is not yet a console to write to.

The kind of IPL matters. A **cold start** (`CLPA`) rebuilds the link pack area from disk and is needed when LPA modules change; a **quick start** reuses it. And an IPL is not the only way to refresh things: many `PARMLIB` settings can be changed with `SET` or `SETPROG` commands. In a sysplex, systems are IPLed one at a time — a **rolling IPL** — so the application stays up while each member picks up maintenance.
