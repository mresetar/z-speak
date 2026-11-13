---
title: "z/VM"
params:
  expansion: "z/Virtual Machine"
  short: "A hypervisor operating system that runs hundreds or thousands of guests inside one LPAR."
  related: ["LPAR", "PR/SM", "CP", "Linux on IBM Z", "z/OS", "Minidisk", "z/VSE", "CMS"]
  ref: { title: "IBM Docs: z/VM", url: "https://www.ibm.com/docs/en/zvm" }
  aka: ["VM", "VM/ESA", "VM/370"]
  links:
    - title: "Wikipedia: Z/VM"
      url: "https://en.wikipedia.org/wiki/Z/VM"
categories: ["Operating System"]
tags: ["virtualization"]
---

z/VM predates most of the virtualization industry — its ancestor CP-67 was giving users private virtual machines in 1967. Today it is mainly the platform for dense Linux consolidation and for test environments where you need many z/OS images without many LPARs.

Its control program **CP** provides the virtual machines; **CMS** is the lightweight single-user OS most administrative work runs under. z/VM can even run itself, nested.

Every user of z/VM — human or server — is a virtual machine defined in the **user directory**: its memory size, virtual processors, minidisks, network devices and the privilege classes that say which CP commands it may issue. You log on to that virtual machine and then IPL something in it: CMS, Linux, z/OS or z/VSE. CP commands such as `QUERY`, `LINK` and `IPL` manage the virtual hardware, and can be issued from inside a running guest with the `#CP` prefix.

Its strength is sharing. Memory and processors are routinely overcommitted, guests can share read-only kernel and program segments, and a **virtual switch** connects them to the network through a shared OSA. Up to eight z/VM systems can form a **Single System Image** cluster and move running Linux guests between members with Live Guest Relocation.

Much of the system's own function runs in service virtual machines — the TCP/IP stack, the directory manager, the security manager, the performance monitor. On IBM Z today the alternative for Linux hosting is KVM; z/VM remains the choice where density and mature systems management matter most.
