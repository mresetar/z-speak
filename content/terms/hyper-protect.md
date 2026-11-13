---
title: "Hyper Protect"
params:
  expansion: "IBM Hyper Protect services"
  short: "IBM's confidential-computing offerings built on IBM Z and LinuxONE, where not even the cloud operator can see the workload or its keys."
  ref: { title: "IBM: Hyper Protect Virtual Servers", url: "https://www.ibm.com/products/hyper-protect-virtual-servers" }
  aka: ["Hyper Protect Virtual Servers", "HPVS", "Hyper Protect Crypto Services", "HPCS", "Keep Your Own Key", "KYOK", "Confidential Computing Container Runtime", "CCRT"]
  related: ["Secure Execution", "LinuxONE", "Crypto Express", "Linux on IBM Z", "zCX", "Quantum-Safe Cryptography", "Master Key"]
  links:
    - title: "IBM Docs: Creating a Hyper Protect Virtual Server instance"
      url: "https://www.ibm.com/docs/en/hpvs/1.2.x?topic=servers-creating-hyper-protect-virtual-server-instance"
categories: ["Security"]
tags: ["security", "cloud", "linux"]
---

"Hyper Protect" is a brand covering several services that share one promise: technical assurance, as opposed to a contractual one, that the operator of the platform cannot reach your data.

**Hyper Protect Virtual Servers** — the on-premises product is now sold as **IBM Confidential Computing Container Runtime** — run container workloads inside protected Linux virtual machines. The workload is described in a signed and encrypted contract, there is no shell access for the administrator, and the isolation is provided by **Secure Execution**. It is available in IBM Cloud and for installation on your own IBM Z or LinuxONE machine.

**Hyper Protect Crypto Services** is a cloud key-management service backed by the same hardware security modules as a mainframe's **Crypto Express** cards. Its selling point is *Keep Your Own Key*: the master key is loaded by the customer and IBM has no access to it.

You are most likely to meet the name in digital-asset custody, regulated cloud workloads and confidential AI. IBM has moved the family under a "Confidential Computing" label, and the IBM Cloud services under the old names are being retired: Hyper Protect Virtual Servers for VPC accepts no new instances since February 2026, and Hyper Protect Crypto Services is deprecated in favour of the Confidential Computing offerings. Product names therefore vary by date — the underlying technology is the constant.
