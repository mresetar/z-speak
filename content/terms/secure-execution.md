---
title: "Secure Execution"
params:
  expansion: "IBM Secure Execution for Linux"
  short: "Confidential computing for KVM guests on IBM Z and LinuxONE: the guest's memory and state are hidden even from the host administrator."
  ref: { title: "IBM Docs: What is IBM Secure Execution?", url: "https://www.ibm.com/docs/en/linux-on-systems?topic=execution-introduction" }
  aka: ["protected virtualization", "ultravisor", "confidential computing", "genprotimg", "pvsecret"]
  related: ["Linux on IBM Z", "LinuxONE", "Hyper Protect", "Pervasive Encryption", "Crypto Express", "IFL"]
  links:
    - title: "IBM Docs: IBM Secure Execution for Linux"
      url: "https://www.ibm.com/docs/en/linux-on-systems?topic=security-secure-execution-linux"
categories: ["Security"]
tags: ["security", "virtualization", "linux"]
---

Virtualisation normally implies trust: whoever controls the hypervisor can read a guest's memory. Secure Execution, available from the z15 and LinuxONE III, removes that assumption for KVM guests. A trusted firmware layer, the **ultravisor**, sits beside the hypervisor and takes over anything that touches a protected guest's memory or processor state. The host can still schedule the guest and give it devices, but sees only encrypted pages.

The boot image is protected as well. Its owner encrypts it with the public key of the specific machine, or machines, it is allowed to run on; only the ultravisor of such a machine can open it. The image can carry its own secrets, such as disk-encryption keys, that the cloud operator never sees. **Attestation** lets the owner verify from outside that a workload really is running protected and unmodified.

The purpose is to let regulated workloads run on infrastructure operated by someone else. It is the technical foundation under IBM's **Hyper Protect** offerings, and it applies to Linux guests under KVM, not to z/OS.
