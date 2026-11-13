---
title: "Communications Server"
params:
  expansion: "z/OS Communications Server"
  short: "The TCP/IP and SNA networking stack of z/OS — and it is a first-class, sysplex-aware stack, not a bolt-on."
  ref: { title: "IBM Docs: z/OS Communications Server", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-communications-server" }
  aka: ["TCP/IP stack", "Comm Server"]
  related: ["VTAM", "OSA-Express", "AT-TLS", "HiperSockets", "Parallel Sysplex", "Connect:Direct", "TN3270", "VIPA", "Policy Agent", "Enterprise Extender"]
  links:
    - title: "IBM Docs: IP configuration overview"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=system-ip-configuration-overview"
categories: ["Middleware"]
tags: ["network"]
---

It ships with z/OS and provides both the IP stack and VTAM. Configuration lives in a `TCPIP.PROFILE` data set — `PORT` reservations, `HOME` addresses, `VIPADYNAMIC` blocks — and the operator interface is `D TCPIP` and the `NETSTAT` command.

Two features are distinctive. **Dynamic VIPA** gives an application an IP address that belongs to the application rather than to an adapter, so it can move with the workload. **Sysplex Distributor** then advertises one address for a service and spreads incoming connections across sysplex members using **WLM** goals — load balancing that knows how busy each system actually is, without an external appliance.

**AT-TLS** is the other piece worth knowing: TLS applied by the stack according to policy, so an old application gets encrypted connections without a line of code changing.
