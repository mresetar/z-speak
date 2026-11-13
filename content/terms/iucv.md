---
title: "IUCV"
params:
  expansion: "Inter-User Communication Vehicle"
  short: "z/VM's facility for passing messages between virtual machines, or between a guest and the hypervisor, without any network device."
  ref: { title: "Wikipedia: IUCV", url: "https://en.wikipedia.org/wiki/IUCV" }
  aka: ["AF_IUCV", "VMCF", "IUCV path"]
  related: ["z/VM", "CMS", "Linux on IBM Z", "HiperSockets", "RSCS"]
  links:
    - title: "IBM Docs: z/VM — Inter-User Communication Vehicle"
      url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=structure-inter-user-communication-vehicle"
categories: ["Operating System"]
tags: ["vm", "virtualization", "network"]
---

Virtual machines are isolated from each other by design. IUCV is the sanctioned hole in the wall: a CP service through which one virtual machine opens a **path** to another, or to a CP system service, and exchanges messages over it. Whether a guest may connect to whom is granted in the z/VM user directory with `IUCV` statements.

Much of z/VM's own plumbing uses it — service machines such as the TCP/IP stack and the Shared File System server are reached this way. Linux on IBM Z uses it too: as a terminal for getting a console on a guest whose network is down (`hvc_iucv`), and as the `AF_IUCV` socket family for guest-to-guest communication.

Because it is memory-to-memory inside one z/VM system, it is fast and needs no addresses or adapters — and by the same token stops at the edge of that system. For anything spanning LPARs, HiperSockets or a real network is the tool.
