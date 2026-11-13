---
title: "CPACF"
params:
  expansion: "CP Assist for Cryptographic Functions"
  short: "Cryptographic hardware instructions built into every z/OS processor core — the engine behind pervasive encryption."
  ref: { title: "IBM Docs: CP Assist for Cryptographic Functions (CPACF)", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=icsf-cp-assist-cryptographic-functions-cpacf" }
  aka: ["CP Assist for Cryptographic Functions"]
  related: ["ICSF", "Pervasive Encryption", "Quantum-Safe Cryptography", "Telum", "Crypto Express", "Master Key"]
  links:
    - title: "IBM Docs: Protected-key CPACF"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=management-protected-key-cpacf"
categories: ["Hardware"]
tags: ["encryption", "security", "hardware"]
---

Every processor core on IBM Z carries a set of cryptographic instructions — AES, DES/TDES, SHA, and since z14 the ability to execute them in **protected key** mode, where a raw clear key never exists outside the processor. These instructions are **CPACF**, and they are why encrypting a whole DASD volume, a tape, or a Db2 tablespace at line speed is practical rather than a bottleneck.

CPACF is free capacity, not a separate card: it runs inline on the same core as your workload, so throughput scales with the machine. The management layer above it is **ICSF**, which holds the keys in its key data sets and hands applications access; Crypto Express cards (real HSMs) handle the keys CPACF must not see.

The newcomer confusion is the trio **CPACF vs ICSF vs Crypto Express**: CPACF is the hardware in every core, ICSF is the z/OS software (started task and APIs) that manages keys and crypto operations, and Crypto Express is the tamper-resistant PCIe card for operations that need isolated key material. "Is it CPACF-eligible?" in a performance discussion means: will the crypto work burn general CPU or essentially none of it.
