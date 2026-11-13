---
title: "DPM"
params:
  expansion: "Dynamic Partition Manager"
  short: "An alternative way to run an IBM Z or LinuxONE machine, where partitions and their I/O are defined through the HMC instead of an IOCDS."
  ref: { title: "IBM Docs: Dynamic Partition Manager (DPM)", url: "https://www.ibm.com/docs/en/systems-hardware/linuxone/9176-ML2?topic=management-dynamic-partition-manager-dpm" }
  aka: ["Dynamic Partition Manager", "DPM mode"]
  related: ["PR/SM", "LPAR", "HMC", "HCD", "IOCP", "LinuxONE", "Linux on IBM Z"]
  links:
    - title: "IBM Docs: SE help: System Management (Dynamic Partition Manager enabled)"
      url: "https://www.ibm.com/docs/en/help-ibm-se-z17?topic=pane-system-management-dynamic-partition-manager-enabled"
categories: ["Hardware"]
tags: ["virtualization", "hardware", "linux"]
---

Setting up a mainframe the classic way means building an I/O configuration with **HCD** and **IOCP**, then defining image profiles for each LPAR — skills a Linux-only shop does not have and does not want. DPM is a different operating mode of the same machine, chosen at power-on, that hides all of that. An administrator uses the HMC's web interface or its REST API to create a **partition**, give it processors and memory, and attach network and storage adapters, much as on any other virtualisation platform. Resources can be changed while the partition runs.

Underneath it is still **PR/SM**; DPM generates and manages the configuration for you. It was introduced with the z13 for KVM and Linux, and suits LinuxONE machines and Linux-focused IBM Z footprints running Linux, z/VM or KVM.

The mode applies to the whole CPC — a machine is in DPM mode or in standard PR/SM mode, not both. z/OS installations use the standard mode with HCD, so on a traditional mainframe you will hear of DPM far more often than you will see it.
