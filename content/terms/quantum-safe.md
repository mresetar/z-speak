---
title: "Quantum-Safe Cryptography"
params:
  expansion: "Post-quantum cryptography on IBM Z"
  short: "Lattice-based algorithms shipped in the hardware from z16 onward, to defend against “harvest now, decrypt later”."
  ref: { title: "IBM — What is Quantum-Safe Cryptography?", url: "https://www.ibm.com/topics/quantum-safe-cryptography" }
  aka: ["post-quantum", "PQC", "CRYSTALS", "ML-KEM", "ML-DSA"]
  related: ["ICSF", "Pervasive Encryption", "CPACF", "IBM Z", "Telum", "Master Key", "zERT"]
  links:
    - title: "Wikipedia: Post-quantum cryptography"
      url: "https://en.wikipedia.org/wiki/Post-quantum_cryptography"
categories: ["Security"]
tags: ["security", "encryption"]
---

The threat is not that a quantum computer breaks your session today. It is that an adversary records encrypted traffic and archives now, and decrypts once such a machine exists — a real concern for data with a thirty-year confidentiality requirement, which is exactly the data mainframes hold.

IBM Z has shipped **CRYSTALS-Kyber** (key encapsulation) and **CRYSTALS-Dilithium** (digital signatures) — both NIST selections, standardised in 2024 as **ML-KEM** (FIPS 203) and **ML-DSA** (FIPS 204), so you will meet both sets of names — implemented in **Crypto Express8S** and reachable through **ICSF** from z/OS 2.5. z16 also introduced quantum-safe protection of the firmware boot chain itself.

The practical work is inventory: finding every place classical crypto is used, which is slow and unglamorous, and the reason the topic appears years before the threat does.

The hardware side on IBM Z has several layers. **Crypto Express** cards provide the quantum-safe algorithms inside the HSM and protect their own firmware with them. **ICSF** exposes key generation, signing and key encapsulation as callable services, and supports **hybrid** key exchange, which combines a classical algorithm with a quantum-safe one so that the result is secure if either holds.

Not everything is at risk in the same way. **Asymmetric** algorithms — RSA, Diffie-Hellman and elliptic curves — are the ones a large quantum computer would break. **Symmetric** encryption such as AES-256 and modern hashes are weakened but remain usable, so data set encryption with AES-256 is not the urgent problem; key exchange and digital signatures are. IBM's tooling for the inventory work includes **zERT** for network sessions, ICSF usage statistics in SMF, and application discovery tools that find cryptographic calls in source code.
