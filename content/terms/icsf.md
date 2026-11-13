---
title: "ICSF"
params:
  expansion: "Integrated Cryptographic Service Facility"
  short: "The z/OS interface to the hardware crypto engines, and the keeper of the key stores."
  ref: { title: "IBM Docs: z/OS Cryptographic Services (ICSF)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-cryptographic-services" }
  aka: ["CKDS", "PKDS", "ICSF callable services"]
  related: ["CPACF", "Pervasive Encryption", "RACF", "Quantum-Safe Cryptography", "Telum", "Crypto Express", "Key Ring", "Digital Certificate", "RACF Class", "Master Key"]
  links:
    - title: "IBM Docs: Introduction to z/OS ICSF"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-introduction-zos-icsf"
categories: ["Security"]
tags: ["security", "encryption"]
---

ICSF is the started task standing between applications and the crypto hardware — the **CPACF** instructions on every core and the **Crypto Express** HSM cards. Keys live in its key data sets (**CKDS** for symmetric, **PKDS** for public-key, **TKDS** for tokens), and access to each key label is a RACF-protected resource.

The important property is that a **secure key** never exists in the clear outside the tamper-responding HSM. Applications reference a label; the hardware does the operation. Even a fully privileged system programmer cannot extract the key material — which is what makes the platform's separation-of-duties claims stand up in an audit.

Keys come in three strengths, and the terms are used precisely. A **clear key** is visible in storage and offers speed but no protection from someone who can read memory. A **secure key** is always wrapped by a **master key** held inside the Crypto Express card, and every operation takes place in the card. A **protected key** is the compromise: wrapped by a key known only to the processor firmware, usable at CPACF speed, never visible to the operating system. Data set encryption uses protected keys derived from secure ones.

Applications call ICSF through callable services named `CSNBxxx` and `CSNDxxx` (the IBM **CCA** interface) or through **PKCS #11**, and Java and System SSL use it underneath. If the ICSF started task is down, anything depending on hardware keys stops, so it is started early and stopped late. Loading and changing master keys is a ceremony with split knowledge, usually done from a **Trusted Key Entry** workstation, and losing a master key with no backup means losing every key it protects.
