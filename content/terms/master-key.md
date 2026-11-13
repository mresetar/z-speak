---
title: "Master Key"
params:
  expansion: "Cryptographic master keys and the clear, secure and protected key types"
  short: "The key held inside the Crypto Express card under which every other secure key is wrapped, so those keys never appear in the clear."
  ref: { title: "IBM Docs: Introduction to z/OS ICSF", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-introduction-zos-icsf" }
  aka: ["AES master key", "DES master key", "RSA master key", "ECC master key", "MKVP", "clear key", "secure key", "protected key", "key part", "master key ceremony", "key wrapping", "operational key", "EP11 master key"]
  related: ["ICSF", "Crypto Express", "CPACF", "Pervasive Encryption", "Key Ring", "RACF Class", "Quantum-Safe Cryptography", "Hyper Protect"]
categories: ["Security"]
tags: ["security", "encryption", "hardware"]
---

Protecting data with encryption only moves the problem: now the key must be protected. IBM Z answers with a hierarchy. At the top is a **master key** that exists only inside the tamper-responding **Crypto Express** hardware. Every working key is stored encrypted — **wrapped** — under that master key, in ICSF's key data sets. To use one, ICSF hands the wrapped key and the data to the card, which unwraps it internally, performs the operation and returns only the result.

There are separate master keys per algorithm family — AES, DES, RSA and ECC under the CCA interface, and another for the PKCS #11 (EP11) mode — and each key data set records a **verification pattern** so that ICSF can confirm the card holds the matching master key.

This gives three grades of working key. A **secure key** is always wrapped by the master key and is used only inside the card: the strongest protection, at the speed of a call to the card. A **clear key** sits unencrypted in memory and is used by the processor's CPACF instructions: fast, and readable by anyone who can read that storage. A **protected key** is a secure key re-wrapped under a key known only to the processor firmware of that LPAR, so CPACF can use it at full speed while its value stays hidden from the operating system. Data set encryption relies on protected keys.

Loading a master key is a **ceremony**: several people each enter one key part, usually from a Trusted Key Entry workstation, so nobody knows the whole. The consequence to remember is absolute — if the master key is lost and no backup of its parts exists, every key wrapped under it, and all data encrypted with those keys, is unrecoverable.
