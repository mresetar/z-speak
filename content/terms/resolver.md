---
title: "Resolver"
params:
  expansion: "z/OS resolver and TCPIP.DATA (name resolution)"
  short: "The z/OS address space that turns host names into IP addresses for every program, using DNS servers or local host tables."
  ref: { title: "IBM Docs: Resolver setup and TCPIP.DATA configuration statements", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-resolver-setup-tcpipdata-configuration-statements" }
  aka: ["TCPIP.DATA", "RESOLVER started task", "GLOBALTCPIPDATA", "DEFAULTTCPIPDATA", "SYSTCPD", "NSINTERADDR", "NAMESERVER", "ETC.IPNODES", "resolver cache", "trace resolver", "getaddrinfo"]
  related: ["TCP/IP Profile", "Communications Server", "z/OS UNIX", "FTP", "Started Task", "PARMLIB", "DD Statement"]
categories: ["System Services"]
tags: ["network", "configuration", "troubleshooting"]
---

Before a program can connect to `db2prod.example.com` something must translate the name into an address. On z/OS that is the **resolver**, a system address space started early in IPL, before TCP/IP itself. Every sockets program — batch, TSO, CICS, Java, the shell — calls it, usually without knowing.

Its settings come from **TCPIP.DATA** statements: `NSINTERADDR` or `NAMESERVER` (the DNS servers to ask), `DOMAINORIGIN` or `DOMAIN` (the default domain to append), `LOOKUP` (whether to try DNS or local tables first), `HOSTNAME`, and `TCPIPJOBNAME`, which says which stack a program should use when there are several. Local tables — `ETC.IPNODES`, or `/etc/hosts` — can answer for names without DNS.

The difficulty is that there are many places a program might find this file, and the search order differs between the MVS and UNIX environments: an environment variable, `/etc/resolv.conf`, a `SYSTCPD` DD statement in the job, a data set under the user's prefix, `SYS1.TCPPARMS(TCPDATA)` and more. Two programs on one system could resolve the same name differently. The resolver's own setup file fixes that: `GLOBALTCPIPDATA` names a file whose settings apply to everyone and cannot be overridden, and `DEFAULTTCPIPDATA` supplies a last resort.

When a connection fails with "unknown host" or hangs for a long time before working, the resolver is the suspect — typically an unreachable first name server, with each lookup waiting for a timeout. The **trace resolver** facility, switched on with a `SYSTCPT` DD or an environment variable, prints exactly which files were read and which servers were asked. The resolver also keeps a cache of answers, which can make a DNS change appear not to have happened.
