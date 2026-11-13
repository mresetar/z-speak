---
title: "zSecure"
params:
  expansion: "IBM Security zSecure suite"
  short: "IBM's add-on products for administering, auditing and monitoring RACF, with audit support for ACF2 and Top Secret too."
  ref: { title: "IBM Docs: Overview of the zSecure products", url: "https://www.ibm.com/docs/en/szs/3.1.0?topic=introduction-overview-zsecure-products" }
  aka: ["zSecure Admin", "zSecure Audit", "zSecure Alert", "zSecure Command Verifier", "zSecure Visual", "CARLa", "Consul", "zSecure Adapters for SIEM", "CKFREEZE", "UNLOAD"]
  related: ["RACF", "ESM", "SMF", "User Attributes", "SETROPTS", "ACF2", "Top Secret", "RACF Profile", "Health Checker"]
categories: ["Security"]
tags: ["security", "tooling", "governance"]
---

RACF's own commands answer narrow questions about one profile at a time. Running a real security function needs broader ones: who can update this library, by which route; which user IDs have not been used for a year; what changed last night. The **zSecure** suite — originally from the Dutch company Consul — is IBM's answer, and one of a small group of products in this niche alongside tools from Vanguard and Broadcom.

It is sold as components. **zSecure Admin** provides ISPF panels and mass-update functions for RACF administration, with features such as comparing and cloning users, cleaning up unused permissions, and merging databases. **zSecure Audit** analyses the security database together with a snapshot of the system configuration (the `CKFREEZE` data set) and SMF records, and reports against standards; it supports ACF2 and Top Secret as well as RACF. **zSecure Alert** watches events in real time and raises alerts for things like a logon by an emergency user ID or a change to an APF library. **Command Verifier** enforces policy on RACF commands before they run — for example, refusing a `UACC` above `READ`. Other parts provide a Windows front end and feeds to SIEM products.

Underneath is a reporting language, **CARLa**, in which the supplied reports are written and with which sites write their own; knowing it is a marketable skill.

For newcomers the important thing is recognising the name. When a security administrator says "I'll look it up in zSecure", they mean a consolidated answer that would take many `LISTDSD` and `RLIST` commands by hand. It supplements the security manager; it does not replace it.
