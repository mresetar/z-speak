---
title: "VTAM"
params:
  expansion: "Virtual Telecommunications Access Method"
  short: "The SNA network stack of z/OS — still the thing that owns your 3270 session, decades after TCP/IP won."
  ref: { title: "IBM Docs: z/OS Communications Server", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-communications-server" }
  aka: ["ACF/VTAM"]
  related: ["SNA", "3270", "Communications Server", "CICS", "TN3270", "Enterprise Extender", "TCP/IP Profile", "Logical Unit"]
  links:
    - title: "Wikipedia: Virtual Telecommunications Access Method"
      url: "https://en.wikipedia.org/wiki/Virtual_Telecommunications_Access_Method"
categories: ["Middleware"]
tags: ["network", "legacy"]
---

VTAM manages **LUs** (logical units — terminals, printers, applications), **APPLs** (applications such as CICS and TSO that users can log on to), and the sessions between them. When you type a name at a `USSMSG10` screen to reach CICS, that is VTAM.

Since OS/390 it has been packaged inside **Communications Server** together with the TCP/IP stack, and much SNA traffic now travels inside IP as **Enterprise Extender**. But the concepts persist: an application still has a VTAM APPLID, and `D NET,ID=` is still how you find out why a session will not start.

VTAM runs as a started task, usually called `NET`, and is started before almost everything that talks to a network. Its definitions live in `SYS1.VTAMLST` as **major nodes** — members describing applications, local terminals, cross-domain resources, switched connections and so on — which are activated and deactivated with `V NET,ACT` and `V NET,INACT`. The **start options** member (`ATCSTRxx`) sets the node's identity and behaviour.

A few terms come up constantly. A **logon mode** (logmode) entry describes the session protocol, including screen size for a 3270, and a wrong one is a classic cause of a garbled or refused session. The **USS table** defines the logon screen and the short commands on it. And an application opens an **ACB** to tell VTAM it is ready for sessions — "ACB not open" simply means the application is not up or not accepting logons. The TCP/IP stack also depends on VTAM being active, even at sites with no SNA traffic left.
