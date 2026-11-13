---
title: "z/OSMF"
params:
  expansion: "z/OS Management Facility"
  short: "The web UI and, more importantly, the REST API surface of z/OS."
  ref: { title: "IBM Docs: IBM z/OS Management Facility", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-management-facility" }
  aka: ["z/OS Management Facility", "IZUSVR1", "z/OSMF REST API"]
  related: ["Zowe", "z/OS", "WebSphere Liberty for z/OS", "z/OSMF Workflows", "ServerPac", "Key Ring", "TSO/E", "Zowe CLI", "LDAP", "zERT"]
  links:
    - title: "IBM Docs: What setup is needed for z/OSMF?"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zosmf-what-setup-is-needed"
categories: ["Modern Z"]
tags: ["api", "tooling", "modernization"]
---

z/OSMF is a Liberty-hosted server shipped with z/OS. The browser interface handles configuration, workflows, software management and incident logs, but the part that changed how people work is the **REST API**: data sets, jobs, USS files, console commands, all over HTTPS with SAF authentication.

Nearly every modern tool — Zowe, Ansible for IBM Z, IDE plugins, pipeline steps — is a client of it. "Is z/OSMF up?" has become a normal question when automation stops working.

The server is a pair of started tasks — `IZUSVR1`, the Liberty server, and `IZUANG1`, its angel process — configured through the `IZUPRMxx` PARMLIB member and a long list of SAF profiles. For requests that need TSO or ISPF services it starts a TSO address space on the user's behalf, using a logon procedure that is normally `IZUFPROC`; a user who cannot log on to TSO with that procedure will find parts of the REST API failing in puzzling ways.

When a client cannot connect, the cause is usually ordinary: the certificate in the server's key ring is not trusted by the client, the user's password has expired, or the port is not the one expected. `zowe zosmf check status` is a quick way to test from a workstation.

The browser side is organised as tasks: Workflows, Software Management, Incident Log, Sysplex Management, the Network and Security Configuration Assistants, and others. It is no longer optional in practice — z/OS itself is now delivered as a z/OSMF portable software instance, so installing a release requires a working z/OSMF.
