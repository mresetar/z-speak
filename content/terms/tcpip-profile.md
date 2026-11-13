---
title: "TCP/IP Profile"
params:
  expansion: "PROFILE.TCPIP and the z/OS TCP/IP stack"
  short: "The configuration data set read when the z/OS TCP/IP address space starts: interfaces, addresses, routes, port reservations and options."
  ref: { title: "IBM Docs: PROFILE.TCPIP configuration file", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=changes-profiletcpip-configuration-file" }
  aka: ["PROFILE.TCPIP", "TCPIP address space", "OBEYFILE", "VARY TCPIP", "PORT statement", "IPCONFIG", "INTERFACE statement", "AUTOLOG", "NETSTAT", "CINET", "multiple stacks"]
  related: ["Communications Server", "VIPA", "OSA-Express", "Resolver", "AT-TLS", "Policy Agent", "VTAM", "Started Task", "HiperSockets"]
categories: ["System Services"]
tags: ["network", "configuration", "sysprog"]
---

On z/OS the TCP/IP protocol stack is a started task, usually called `TCPIP`, and its behaviour is defined by a profile data set named on the `PROFILE` DD statement — **PROFILE.TCPIP**. It is the network equivalent of a PARMLIB member and the first place to look when asking what address a system has or who owns a port.

The statements fall into a few groups. `INTERFACE` (or the older `DEVICE`, `LINK` and `HOME`) defines each network connection — an OSA port, a HiperSockets LAN, a virtual address — and its IP address. `BEGINROUTES` sets static routes, unless the `OMPROUTE` daemon learns them dynamically. `IPCONFIG`, `TCPCONFIG` and `GLOBALCONFIG` set stack-wide options such as forwarding, buffer sizes, sysplex functions and whether AT-TLS and IP security are enabled. `VIPADYNAMIC` defines addresses that can move between systems. `AUTOLOG` lists servers to start with the stack.

The `PORT` statement deserves attention. `PORT 21 TCP FTPD1` **reserves** a port for a named job, so nothing else can bind to it; a server that fails with "address already in use" or a permission error is often being refused by a reservation, and unreserved low ports may be restricted altogether.

Changes need not wait for a restart. `VARY TCPIP,,OBEYFILE,dsn` applies a data set of statements to the running stack — which also means the running configuration can drift from the profile unless changes are copied back. `NETSTAT` (or `D TCPIP,,NETSTAT`) shows what is actually in effect: `HOME` for addresses, `ROUTE`, `CONN`, `PORTLIST`.

A system can run several stacks at once under the Common INET layer, though most run one. The stack needs **VTAM** active, because VTAM owns the device interface.
