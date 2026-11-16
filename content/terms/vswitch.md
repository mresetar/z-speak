---
title: "VSWITCH"
params:
  expansion: "z/VM Virtual Switch"
  short: "A virtual Ethernet switch inside z/VM that connects guests to each other and, through an OSA uplink, to the physical network."
  ref: { title: "IBM Docs: z/VM Connectivity — Planning virtual networks", url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=connectivity-planning-virtual-networks" }
  aka: ["virtual switch", "z/VM virtual switch", "Guest LAN", "NICDEF", "DEFINE VSWITCH", "SET VSWITCH GRANT", "QUERY VSWITCH", "virtual NIC", "uplink port", "VLAN"]
  related: ["z/VM", "Linux on IBM Z", "OSA-Express", "HiperSockets", "CP", "CMS", "Minidisk", "IFL", "KVM on IBM Z", "Network Express", "RACF"]
  links:
    - title: "IBM Docs: z/VM"
      url: "https://www.ibm.com/docs/en/zvm"
categories: ["Operating System"]
tags: ["zvm", "networking", "linux"]
---

A z/VM system can host hundreds of Linux guests, and giving each its own physical network port is neither affordable nor necessary. The virtual switch is the standard answer: z/VM's control program simulates an Ethernet switch, each guest plugs a simulated network card into it, and one or more OSA-Express ports act as the uplink to the real network.

The older building block is the **Guest LAN** — a simulated LAN segment that exists only inside z/VM. Guests on it can reach each other, but reaching the outside world requires one guest to act as a router. A VSWITCH is in effect a Guest LAN with a built-in uplink, which removed the router guest and its single point of failure. Guest LANs are still used for isolated internal networks.

A virtual switch behaves like the physical kind:

- It runs at **layer 2** (Ethernet, by MAC address), which is the usual choice for Linux, or at layer 3 (IP).
- It is **VLAN-aware**, so one uplink can carry many separated networks and each guest is admitted only to its own.
- It fails over between several OSA ports, and can aggregate them into a port group for throughput.

It is defined with `DEFINE VSWITCH` in the system configuration file, and a guest gets its adapter from a `NICDEF` statement in its directory entry. To Linux the adapter looks like an OSA card and is driven by the ordinary `qeth` driver.

A guest cannot simply connect. Access is authorized per user — `SET VSWITCH … GRANT`, or a profile in the security manager — and per VLAN. When a freshly cloned guest has a network interface that will not come up, a missing grant is the first thing to check, with `QUERY VSWITCH` to see who is actually connected.
