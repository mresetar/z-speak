---
title: "SNA"
params:
  expansion: "Systems Network Architecture"
  short: "IBM's pre-Internet networking architecture — hierarchical, session-oriented, and still under many payment networks."
  ref: { title: "IBM Docs: z/OS Basic Skills — Systems Network Architecture (SNA)", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.znetwork/znetwork_56.htm" }
  aka: ["APPN", "LU6.2", "APPC"]
  related: ["VTAM", "3270", "Communications Server", "Enterprise Extender", "TN3270", "Logical Unit"]
  links:
    - title: "Wikipedia: Systems Network Architecture"
      url: "https://en.wikipedia.org/wiki/Systems_Network_Architecture"
categories: ["Middleware"]
tags: ["network", "legacy", "history"]
---

Announced in 1974, SNA assumed a hierarchy: a host at the top, controllers and terminals below, with sessions explicitly established between **logical units**. It was reliable and predictable in a way early IP was not — the trade-off being central control and slow reconfiguration.

Vocabulary that survives: **LU2** for 3270 terminal sessions, **LU6.2/APPC** for program-to-program conversations, **PU** for physical units, **APPN** for the later peer-to-peer routing. Interbank and card networks carried SNA long after everyone else moved on, and today it usually runs tunnelled over IP via **Enterprise Extender**.

An SNA network is made of **nodes** classed by type: a host running VTAM is a type 5, a communications controller a type 4, and peripheral devices type 2. In the original **subarea** design the host owned the definitions of everything below it, and a terminal could not talk to anything until the host's **SSCP** had activated it. That central definition is what "hierarchical" means in practice, and why adding a device was a change request rather than plugging in a cable.

Two things keep SNA relevant. Applications written to **LU 6.2** — including CICS-to-CICS links and older IMS and MQ configurations — still speak it, even if the wire is now IP. And the 3270 data stream, born in SNA, is what **TN3270** carries over TCP. Do not confuse SNA with **VTAM**: SNA is the architecture and its protocols; VTAM is the z/OS software that implements it.
