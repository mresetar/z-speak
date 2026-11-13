---
title: "NJE"
params:
  expansion: "Network Job Entry"
  short: "The protocol that lets job entry subsystems on different systems send each other jobs, output, commands and messages."
  ref: { title: "Wikipedia: Network Job Entry", url: "https://en.wikipedia.org/wiki/Network_Job_Entry" }
  aka: ["NJE node", "XMIT", "ROUTE XEQ", "TSO TRANSMIT"]
  related: ["JES", "RJE", "RSCS", "HASP", "SYSOUT", "RACF", "FTP"]
  links:
    - title: "IBM Docs: Network job entry (NJE)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-network-job-entry-nje"
categories: ["Operating System"]
tags: ["batch", "network", "operations"]
---

NJE connects peers. Each system is a **node** with a name, and a job submitted on one node can be routed to run on another, with its output routed back or on to a third. The same links carry operator commands and messages. Connections run over TCP/IP today; SNA and bisync links came before.

It is how work moves between sysplexes that do not share a spool: `/*ROUTE XEQ` or `/*XEQ` in JCL sends a job elsewhere, `DEST=node.userid` sends output, and TSO `TRANSMIT` and `RECEIVE` ship data sets between users on different nodes. The protocol is not limited to z/OS — **RSCS** on z/VM, VSE/POWER and others speak it — and the academic network BITNET was built on it.

NJE is also a trust relationship. A node largely believes what its neighbour says about who submitted a job, so which nodes may send work under which user IDs is controlled in the security product (the RACF `NODES` class) and deserves the same care as any other network entry point.
