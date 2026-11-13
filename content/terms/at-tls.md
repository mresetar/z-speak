---
title: "AT-TLS"
params:
  expansion: "Application Transparent Transport Layer Security"
  short: "TLS applied by the z/OS TCP/IP stack itself, driven by policy — encryption without touching the application."
  ref: { title: "IBM Docs: Application Transparent Transport Layer Security (AT-TLS)", url: "https://www.ibm.com/docs/en/zos-connect/3.0.0?topic=connect-application-transparent-transport-layer-security-tls" }
  aka: ["TTLS", "policy-based TLS"]
  related: ["Communications Server", "z/OS Connect", "Pervasive Encryption", "RACF", "Key Ring", "Policy Agent", "Digital Certificate", "MQ Channel", "LDAP", "zERT"]
  links:
    - title: "IBM Docs: Overview of Application Transparent Transport Layer Security"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=folder-overview-application-transparent-transport-layer-security"
categories: ["Security"]
tags: ["network", "tls", "encryption"]
---

Getting an application to speak TLS normally means code changes: certificates, handshake logic, cipher choices. **AT-TLS** flips that. The z/OS **policy agent** reads rules (`TTLS` policy, defined in PAGENT configuration) that match traffic by local port, remote IP or application name, and the **TCP/IP stack itself** establishes the TLS session underneath the application. The program just reads and writes its socket as always — encrypted in transit.

This is how decades-old code gets compliant. A COBOL batch job talking to a REST endpoint, an FTP-ish transfer, a vendor product with no TLS support: define the rule, and the connection is encrypted, with certificates held in key rings protected by RACF. Most z/OS-to-z/OS-Connect, MQ, CICS and Db2 connections in security-conscious shops run over AT-TLS without a line of TLS code anywhere.

The operational tell: certificates expire and PAGENT policies are distributed per system, so "the connection suddenly fails" is often a lapsed certificate or a policy refresh that did not reach one LPAR — not an application bug.
