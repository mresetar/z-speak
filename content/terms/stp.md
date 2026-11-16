---
title: "STP"
params:
  expansion: "Server Time Protocol"
  short: "IBM Z's time synchronization: keeps every machine in a sysplex on the same clock, to the microsecond, over coupling links."
  ref: { title: "IBM Redbooks: IBM Z Server Time Protocol Guide", url: "https://www.redbooks.ibm.com/abstracts/sg248480.html" }
  aka: ["CTN", "Coordinated Timing Network", "Preferred Time Server", "PTS", "BTS", "Arbiter", "Sysplex Timer", "ETR"]
  related: ["Parallel Sysplex", "Coupling Links", "HMC", "GDPS", "System Logger", "Db2 for z/OS", "TOD Clock"]
  links:
    - title: "Wikipedia: Server Time Protocol"
      url: "https://en.wikipedia.org/wiki/Server_Time_Protocol"
categories: ["Hardware"]
tags: ["hardware", "sysplex", "availability"]
---

A sysplex behaves like one system only if all its members agree on the time. Logs from different systems are merged in timestamp order, Db2 data sharing orders updates by time, and recovery depends on it. So z/OS will not run in a multi-machine sysplex unless its machine's clock (the TOD) is synchronized with the others. That used to take a separate box, the **Sysplex Timer** (ETR). **STP** replaced it with firmware on the machines themselves, exchanging timing messages over the coupling links, or over timing-only links where no CF traffic flows.

The machines that share time form a **CTN** (Coordinated Timing Network). The HMC assigns roles: a **Preferred Time Server** (Stratum 1) that everyone follows, a **Backup Time Server** ready to take over, and in larger CTNs an **Arbiter** that breaks ties when the other two lose contact. The CTN can steer to an external time source, NTP or, since z16, PTP connected directly to the machine, so the mainframe's time also agrees with the rest of the data centre.

What people underestimate is that STP roles are an availability design, not a detail. If the time servers are arranged badly, one machine or site failure can leave the survivors without a time source, and z/OS systems stop rather than risk running with wrong time. GDPS and site-failover plans therefore include "who becomes the time server" as a step.
