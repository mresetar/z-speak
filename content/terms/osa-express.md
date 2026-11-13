---
title: "OSA-Express"
params:
  expansion: "Open Systems Adapter"
  short: "The mainframe's Ethernet card — how an LPAR reaches the outside network."
  ref: { title: "IBM Docs: z/OS Basic Skills — Open Systems Adapter (OSA)", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.znetwork/znetwork_80.htm" }
  aka: ["OSA", "QDIO"]
  related: ["Channel Subsystem", "Communications Server", "HiperSockets", "Network Express", "SMC-R and SMC-D", "VTAM", "TCP/IP Profile"]
  links:
    - title: "Wikipedia: Open Systems Adapter"
      url: "https://en.wikipedia.org/wiki/Open_Systems_Adapter"
categories: ["Hardware"]
tags: ["hardware", "network"]
---

OSA-Express adapters provide standard Ethernet at 10/25/100 GbE. An LPAR sees them through the channel subsystem, and z/OS **Communications Server** drives them for TCP/IP.

Two modes are worth knowing. **QDIO** is the normal high-performance path, where the adapter and the stack share memory queues. **OSA-ICC** (Integrated Console Controller) instead presents TN3270 sessions for system consoles — how operators reach the machine without any separate terminal controller.

In configuration terms an OSA port is a channel path with a type that selects its personality: `OSD` for QDIO, `OSC` for the console controller, and `OSE` for the older non-QDIO mode. z/OS then defines it twice more — to VTAM as a TRLE and to TCP/IP as an `INTERFACE` statement — and a mismatch among the three is the usual reason an interface will not start.

One adapter is normally **shared by many LPARs**. Each registers its own IP and MAC addresses with the card, and traffic between two LPARs sharing a port is switched inside the adapter without touching the external network.

For availability, a stack has at least two OSAs connected to different switches, and z/OS moves addresses between them on failure; virtual IP addresses hide the adapters from clients altogether.

On the z17 the new **Network Express** adapter starts to take over this role, so "OSA" is becoming the name of a generation and not of mainframe networking as such.
