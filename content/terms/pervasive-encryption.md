---
title: "Pervasive Encryption"
params:
  expansion: "z/OS data set and file encryption with hardware crypto"
  short: "Encrypting data at rest broadly by policy, using on-chip crypto, without changing applications."
  ref: { title: "IBM Z — Pervasive Encryption", url: "https://www.ibm.com/it-infrastructure/z/capabilities/pervasive-encryption" }
  aka: ["data set encryption"]
  related: ["Telum", "CPACF", "zEDC", "DFSMS", "RACF", "IBM Z", "Secure Execution", "Extended Format", "Master Key", "zERT"]
  links:
    - title: "IBM Docs: z/OS data set encryption"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=encryption-zos-data-set"
categories: ["Security"]
tags: ["security", "encryption"]
---

The enabling facts are hardware: **CPACF** instructions on every core and **Crypto Express** HSM cards make AES cheap enough to apply everywhere rather than selectively. Keys live in the **ICSF** key store, and access to a key label is itself a RACF-protected resource.

The operational appeal is that it is applied by policy — a data class or a RACF `DFP` segment marks a data set as encrypted, and programs read and write it unchanged. Separation of duties follows: a storage administrator can manage a data set without being able to read its contents.

The centrepiece is **data set encryption**: extended-format data sets — sequential, VSAM, PDSE, and from later releases others — are encrypted with AES-256 by the access method, under a **key label** named when the data set is created. Reading needs two permissions rather than one: access to the data set and access to the key label in the `CSFKEYS` class. Around it sit **Coupling Facility** structure encryption, **zFS** file system encryption, and for the network **zERT**, which reports which sessions are protected and how.

Three practical points. An existing data set is not encrypted by changing a setting; it has to be copied into a new, encrypted one. The key becomes as important as the data: lose the key and every backup is unreadable, so key management, backup of the key store and a tested recovery process come first. And encrypted data does not compress, so compression must happen before encryption — z/OS does it in that order when both are requested.
