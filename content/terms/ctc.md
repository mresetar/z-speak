---
title: "CTC"
params:
  expansion: "Channel-to-Channel connection"
  short: "A link that joins two systems channel to channel, so each sees the other as an I/O device it can read from and write to."
  ref: { title: "Wikipedia: Channel-to-channel adapter", url: "https://en.wikipedia.org/wiki/Channel-to-channel_adapter" }
  aka: ["CTCA", "FICON CTC", "FCTC", "channel-to-channel adapter"]
  related: ["FICON", "XCF", "Channel Subsystem", "Coupling Facility", "VTAM", "HCD"]
  links:
    - title: "IBM Docs: FICON channel-to-channel support"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=connections-ficon-channel-channel-support"
categories: ["Hardware"]
tags: ["hardware", "io", "sysplex"]
---

A channel normally talks to a control unit. A CTC connection makes one channel look like a control unit to another, so that system A's write is system B's read. It was once a physical box; with **FICON** it is simply a function of the channel, defined in the I/O configuration as device type `FCTC`, with no extra hardware.

Its main job today is **XCF signalling**. Systems in a sysplex must exchange heartbeat and group messages, and they do so over CTC devices, over list structures in a **Coupling Facility**, or — as most sites configure it — both, so that losing one transport does not partition the sysplex. VTAM and TCP/IP can also use CTCs as a link between hosts, though HiperSockets and OSA have largely taken that role.

Each direction needs its own device, and device numbers must be paired correctly on the two sides. The convention of using matching addresses at both ends exists because mismatched CTC definitions are a classic reason for a system failing to join a sysplex.
