---
title: "zERT"
params:
  expansion: "z/OS Encryption Readiness Technology"
  short: "A TCP/IP stack function that records, for every connection, whether it is encrypted and with which protocol, cipher and key length."
  ref: { title: "IBM Docs: z/OS Encryption Readiness Technology (zERT)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zert-zos-encryption-readiness-technology" }
  aka: ["z/OS Encryption Readiness Technology", "zERT discovery", "zERT aggregation", "zERT Network Analyzer", "zERT policy-based enforcement", "SMF 119 subtype 11", "SMF 119 subtype 12"]
  related: ["AT-TLS", "IPSec", "OpenSSH", "Communications Server", "SMF", "Policy Agent", "Pervasive Encryption", "Quantum-Safe Cryptography", "z/OSMF"]
categories: ["Security"]
tags: ["security", "network", "encryption"]
---

Asking "is all our network traffic encrypted, and how well?" used to have no good answer on any platform. Encryption can be applied by AT-TLS, by an application's own TLS library, by SSH or by IPSec, each configured somewhere different, and the only complete record was in people's heads. **zERT** makes the TCP/IP stack the single observer.

For each TCP and Enterprise Extender connection, the stack records the cryptographic protection it sees: the protocol and version (TLS 1.2, TLS 1.3, SSH, IPSec, or none), the cipher suite, key lengths, and the certificate details. It learns this from the z/OS components that do the encryption and, for other TLS and SSH implementations such as Java's, by watching the handshake as it passes — without decrypting any data.

The results are written to **SMF type 119**. Subtype 11 holds a record per connection (**discovery**); subtype 12 summarises by client, server and security attributes at intervals (**aggregation**), which is far smaller and usually what is collected. The **zERT Network Analyzer**, a z/OSMF plug-in, loads the summary records into Db2 and lets you query them: all traffic still using TLS 1.0, every server accepting connections with no protection, every use of a given cipher.

A later addition, **policy-based enforcement**, lets rules in the Policy Agent act on what is observed — log, alert or reset connections that do not meet a standard.

Its uses are compliance evidence, preparing to switch off old protocol versions without breaking unknown partners, and the inventory step of a move to quantum-safe algorithms. It is a base function and needs only to be switched on in the TCP/IP profile.
