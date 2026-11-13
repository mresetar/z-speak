---
title: "HiperSockets"
params:
  expansion: "Internal Queued Direct I/O network"
  short: "A TCP/IP network between LPARs implemented in memory — no cable, no adapter, no latency."
  ref: { title: "IBM Docs: z/OS Basic Skills — HiperSockets", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.znetwork/znetwork_85.htm" }
  aka: ["IQD", "IQDIO", "internal LAN"]
  related: ["LPAR", "OSA-Express", "Linux on IBM Z", "Communications Server", "TCP/IP Profile"]
  links:
    - title: "Wikipedia: HiperSocket"
      url: "https://en.wikipedia.org/wiki/HiperSocket"
categories: ["Hardware"]
tags: ["network", "performance"]
---

HiperSockets gives LPARs on the same CPC a virtual LAN that the firmware implements as a memory-to-memory copy. Applications use ordinary TCP/IP — same sockets, same IP addresses — but the packet never leaves the box.

This is what makes co-location genuinely useful: a Linux LPAR running an application server can talk to Db2 in a z/OS LPAR at memory speed, with no network hardware to fail and nothing on the wire to intercept.

Technically a HiperSockets LAN is a channel path of type `IQD`, defined in the I/O configuration with **HCD** like any other channel, and shared by the LPARs that should see it. It uses the same **QDIO** architecture as an OSA adapter, so to the TCP/IP stack it looks like one more interface. A CPC supports a limited number of these internal LANs (32 on current machines), and frame sizes up to 56 KB or more, far larger than Ethernet allows.

Two limits to remember. It only connects LPARs on the *same* CPC, so a design that depends on it needs a fallback path — usually OSA — for when a system moves to another machine; in a sysplex, **DynamicXCF** sets this up automatically. And because traffic never leaves the machine, network monitoring and firewalls outside the box do not see it, which security teams need to know about.
