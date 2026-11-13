---
title: "Kerberos"
params:
  expansion: "Network Authentication Service for z/OS (Kerberos)"
  short: "The z/OS implementation of Kerberos, in which a trusted server issues tickets so users and services prove identity without sending passwords."
  ref: { title: "IBM Docs: Setting up a Kerberos Key Distribution Center", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=support-setting-up-kerberos-key-distribution-center" }
  aka: ["Network Authentication Service", "KDC", "key distribution center", "SKRBKDC", "ticket-granting ticket", "TGT", "principal", "realm", "KERB segment", "keytab", "GSS-API", "SPNEGO", "kinit"]
  related: ["RACF", "LDAP", "PassTicket", "MFA", "Db2 for z/OS", "OpenSSH", "NFS", "z/OS UNIX", "Digital Certificate"]
categories: ["Security"]
tags: ["security", "authentication", "network"]
---

**Kerberos** is the authentication protocol behind most enterprise single sign-on, including Windows Active Directory. A user proves identity once to a **key distribution center** (KDC) and receives a **ticket-granting ticket**. For each service they then want, the KDC issues a **service ticket** encrypted with that service's key, which the client presents. The service never sees the password, and nothing reusable crosses the network.

z/OS provides it as **Network Authentication Service**, part of the Security Server. The KDC runs as a started task, `SKRBKDC`, and can keep its registry in RACF: a user's Kerberos **principal** name and key are held in the **KERB segment** of the RACF user profile, and the local **realm** and trust relationships with foreign realms are defined in the `REALM` class. Programs use it through the standard **GSS-API** calls.

Most sites do not make z/OS the KDC for the enterprise. The common pattern is the reverse: z/OS services accept tickets issued by the corporate realm. A **cross-realm trust** is set up, and RACF **maps** foreign principals to local user IDs, so that a user logged on to a workstation can reach Db2 through DDF, a web application in Liberty via SPNEGO, an NFS mount or an SSH session without typing a z/OS password.

The classic pitfalls are not z/OS-specific. Kerberos rejects tickets when clocks differ by more than a few minutes, so time synchronisation matters. Service principal names must match the host names clients actually use. And the encryption types allowed at each end must overlap — older defaults that still permit DES are a finding in any audit.
