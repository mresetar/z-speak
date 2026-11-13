---
title: "Crypto Express"
params:
  expansion: "IBM Crypto Express PCIe hardware security module (CEX8S on z16 and z17)"
  short: "The tamper-responding HSM card in IBM Z — where secure keys live and master keys never leave the hardware."
  ref: { title: "IBM Docs: IBM Crypto Express features", url: "https://www.ibm.com/docs/en/linux-on-systems?topic=hw-crypto-express-features" }
  aka: ["CEX8S", "CEX7S", "CCA", "EP11", "TKE", "hardware security module"]
  related: ["CPACF", "ICSF", "Pervasive Encryption", "Quantum-Safe Cryptography", "LPAR", "RACF", "Master Key"]
  links:
    - title: "IBM Docs: Displaying cryptographic coprocessor status"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=status-displaying-cryptographic-coprocessor"
categories: ["Security"]
tags: ["security", "encryption", "hardware"]
---

IBM Z has two kinds of crypto hardware, and they solve different problems. **CPACF** is on every core: it is fast, but the key it uses sits in memory. **Crypto Express** is a PCIe card holding one or two **hardware security modules** (HSMs). Each HSM has its own processor, memory and battery, inside a tamper-sensing enclosure that erases its secrets if someone opens it. It is certified to the top FIPS 140 level. Its point is that some keys must never exist in the clear anywhere a program, an operator or a memory dump could see them.

Each HSM holds a **master key**, loaded by security officers from a **TKE** (Trusted Key Entry) workstation, usually split between several people. The master key encrypts every other key. An application's **secure key** is stored only in that encrypted form, and the card decrypts it internally to do the work. A card is configured in one of three modes. **CCA coprocessor** is IBM's Common Cryptographic Architecture, used heavily in banking for PINs and card verification. **EP11 coprocessor** is the Enterprise PKCS #11 standard interface. **Accelerator** gives fast clear-key public-key operations for TLS handshakes. One HSM is divided into **domains**, so many LPARs can share it, each with its own master key.

On z/OS you never talk to the card directly: ICSF is the API. What newcomers get wrong is thinking Crypto Express and CPACF compete. **Protected keys** combine them: the key is kept secret by the HSM, re-wrapped for the LPAR, and then used at CPACF speed. That is how pervasive encryption of data sets runs fast without keys in the clear. The other lesson comes from operations: lose all copies of the master key and every secure key, and the data they protect, is gone.
