---
title: "KVM on IBM Z"
params:
  expansion: "Kernel-based Virtual Machine"
  short: "The open-source Linux hypervisor running on IBM Z and LinuxONE — an alternative to z/VM for hosting Linux guests."
  ref: { title: "KVM project site", url: "https://linux-kvm.org/page/Main_Page" }
  aka: ["KVM", "KVM for IBM Z", "QEMU", "libvirt", "virsh", "virtio-ccw", "vfio-ap", "SIE", "KVM host"]
  related: ["Linux on IBM Z", "LinuxONE", "z/VM", "IFL", "LPAR", "PR/SM", "Secure Execution", "OpenShift on IBM Z", "DPM", "HiperSockets", "Crypto Express", "VSWITCH"]
  links:
    - title: "IBM Docs: Linux on IBM Z and LinuxONE"
      url: "https://www.ibm.com/docs/en/linux-on-z"
categories: ["Operating System"]
tags: ["linux", "virtualisation", "open-source"]
---

KVM turns a Linux kernel into a hypervisor. On IBM Z it runs in an LPAR, normally on IFLs, and hosts Linux guests using the same hardware virtualisation instruction that PR/SM and z/VM are built on — so a KVM guest is the third level in a stack the machine was designed to nest.

It is the same KVM as on x86, shipped and supported by the enterprise Linux distributions for the s390x architecture, and managed with the same tools: QEMU provides the virtual machine, libvirt and `virsh` define and control guests, and cloud layers such as OpenShift and OpenStack sit on top. That familiarity is the main reason to choose it. A team that already runs KVM elsewhere can operate Linux on Z without learning z/VM and CMS.

The guest's devices are where the platform shows. Disks and network interfaces are normally **virtio** devices presented through the channel subsystem (`virtio-ccw`), and real hardware can be passed through to a guest: DASD, PCI adapters such as RoCE cards, and Crypto Express domains through `vfio-ap`.

Compared with z/VM, KVM has less history. z/VM offers deeper overcommitment of memory and processors, its own clustering and guest relocation, and decades of operational tooling; KVM offers the standard Linux management model and is the base for **Secure Execution**, where even the hypervisor administrator cannot read a guest's memory. Many sites run both, in different LPARs.

It is a hypervisor for Linux guests. z/OS does not run under it in production — that remains the job of PR/SM and z/VM.
