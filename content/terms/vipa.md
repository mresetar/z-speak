---
title: "VIPA"
params:
  expansion: "Virtual IP Address (static, dynamic, and Sysplex Distributor)"
  short: "An IP address that belongs to a TCP/IP stack or an application instead of a network adapter, so it survives failures and can move."
  ref: { title: "IBM Docs: Sysplex distributor", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=sysplex-distributor" }
  aka: ["DVIPA", "dynamic VIPA", "static VIPA", "Sysplex Distributor", "VIPADEFINE", "VIPABACKUP", "distributed DVIPA"]
  related: ["Communications Server", "Parallel Sysplex", "WLM", "OSA-Express", "XCF", "DDF", "Data Sharing", "TN3270", "MQ Channel", "IPSec"]
  links:
    - title: "Wikipedia: Virtual IP address"
      url: "https://en.wikipedia.org/wiki/Virtual_IP_address"
categories: ["System Services"]
tags: ["network", "availability", "sysplex"]
---

An ordinary IP address is tied to an interface; if the adapter or its cable fails, the address is unreachable. A VIPA is defined on no physical interface at all. The stack advertises to the network that the address can be reached through any of its real adapters, so clients keep connecting while one adapter after another fails.

There are three levels. A **static VIPA** belongs to one TCP/IP stack and protects against adapter failure. A **dynamic VIPA** (DVIPA) can move: if its stack or z/OS system goes down, another system in the sysplex — named as a backup — takes the address over automatically; a DVIPA can also be tied to an application, appearing wherever that application is started.

The third is the **Sysplex Distributor**. A single *distributed* DVIPA represents an application that runs on several systems at once. One stack receives each new connection request and forwards it to one of the target systems, choosing on the basis of advice from **WLM** about which has capacity and whether the server there is healthy. Established connections then flow directly to the chosen system.

This is how clients reach a Db2 data sharing group, a set of CICS regions or TN3270 servers through one host name with no external load balancer — and why "which system am I on?" may have a different answer at each logon.
