---
title: "Safeguarded Copy"
params:
  expansion: "DS8000 Safeguarded Copy and IBM Z Cyber Vault"
  short: "Immutable point-in-time copies of production volumes that no host can reach or delete — the recovery point after ransomware or corruption."
  ref: { title: "IBM Docs: Copy Services Manager — Safeguarded Copy", url: "https://www.ibm.com/docs/en/csm/6.3.14?topic=types-safeguarded-copy" }
  aka: ["Cyber Vault", "IBM Z Cyber Vault", "logical corruption protection", "LCP", "air gap", "immutable backup"]
  related: ["DS8000", "FlashCopy", "PPRC", "Global Mirror", "GDPS", "HyperSwap", "DFSMShsm", "Pervasive Encryption"]
  links:
    - title: "IBM Docs: Copy Services Manager: Safeguarded Copy in DS8000"
      url: "https://www.ibm.com/docs/en/csm/6.3.12?topic=copy-safeguarded-in-ds8000"
categories: ["Storage"]
tags: ["storage", "security", "disaster-recovery"]
---

Mirroring and HyperSwap protect against losing hardware or a site. They do nothing against **logical** damage — a faulty program, a malicious insider, ransomware — because a corrupt update is copied to the mirror as faithfully as a good one. Ordinary backups help, but they can be slow to restore, and an attacker with enough authority can delete them too.

Safeguarded Copy is the storage system's answer. At regular intervals the DS8000 records a consistent point-in-time copy of a set of volumes into **safeguarded capacity**: space that is not addressable by any host, cannot be written to, and cannot be removed before its retention period ends, even by a storage administrator acting alone. Hundreds of such recovery points can be kept per volume.

A copy is never used in place. To inspect or recover, one is restored onto separate recovery volumes, leaving production untouched.

**IBM Z Cyber Vault** is the solution built around the function. It adds an isolated environment — separate LPARs, off the production network — in which a recovery point is IPLed and its data validated routinely, so that there is always a copy known to be clean. From there the options range from extracting a few data sets to restoring everything.

Resilience regulation in the financial sector is the main driver, and the emphasis is as much on proving recoverability by regular test as on owning the technology.
