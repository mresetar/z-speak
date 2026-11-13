---
title: "Top Secret"
params:
  expansion: "CA Top Secret (TSS)"
  short: "Broadcom's other security manager for z/OS, organised around ownership of resources and a hierarchy of departments and divisions."
  ref: { title: "Broadcom: Top Secret", url: "https://www.broadcom.com/products/mainframe/identity-access/top-secret" }
  aka: ["TSS", "CA Top Secret", "ACID", "facility", "TSS PERMIT", "MSCA"]
  related: ["ESM", "RACF", "ACF2", "SAF", "RACF Profile", "User Attributes", "zSecure"]
categories: ["Security"]
tags: ["security", "access-control"]
---

Top Secret is the third of the z/OS security managers, alongside RACF and ACF2, and like them it answers access requests through **SAF**. Its administration is done with one command, `TSS`, and its model has three distinctive ideas.

Everything is an **ACID**, an accessor ID. Users are ACIDs, but so are profiles (collections of permissions that users are attached to), departments, divisions and zones. Those last three form an organisational tree, and administrators are appointed at each level with authority limited to their part of it — an arrangement well suited to large organisations with decentralised administration.

Resources must be **owned** before they can be shared. An administrator first assigns ownership of a data set prefix or other resource to an ACID, and only then can access be permitted to others. Anything unowned is, by default, not accessible.

**Facilities** describe the ways into the system — TSO, batch, each CICS region. A user must be authorised to a facility to sign on through it, so the same person can be allowed into one CICS region and not another.

It can be run in graduated modes, from merely warning about violations to failing them, which eases its introduction. As with ACF2, the concepts map to RACF's but the commands and the habits of thought do not.
