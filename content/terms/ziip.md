---
title: "zIIP"
params:
  expansion: "IBM z Integrated Information Processor"
  short: "The specialty processor that runs eligible work — Java, Db2, XML, TCP/IP — at a fraction of general CP cost."
  ref: { title: "IBM Docs: Specialty processors (zIIP, IFL, ICF)", url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=architectures-specialty-processors" }
  aka: ["Integrated Information Processor", "specialty processor"]
  related: ["Specialty Engine", "CP", "MLC", "Db2 for z/OS", "WLM", "Dispatcher", "Enclave", "IPSec", "Node.js on z/OS"]
  links:
    - title: "Wikipedia: ZIIP"
      url: "https://en.wikipedia.org/wiki/ZIIP"
categories: ["Hardware"]
tags: ["cost", "hardware", "capacity"]
---

A **zIIP** is physically the same silicon as a general-purpose CP; firmware restricts what may be dispatched on it. The point is money: MLC software bills on general capacity, so shifting eligible work onto zIIPs cuts the software bill without buying "real" capacity. z/OS's WLM routes eligible work there automatically when a zIIP is available and busy enough.

What runs on a zIIP is a defined list, and it reads like a modernisation agenda: Java (JVM work), Db2 stored procedures, distributed Db2 queries through DDF, XML parsing, TCP/IP stack processing, much of z/OS Connect and Liberty, IPSec, and eligible HSM/DFSORT/COBOL runtime work. Anything not on the list — ordinary COBOL batch, CICS 3270 transactions — stays on CPs.

The number people quote is **zIIP eligibility**: "how much of this workload can we push to zIIPs?" is a licensing question dressed as a technical one. Watch the ratio in RMF/SMF reports — a low on-zIIP percentage despite high eligibility usually means too few zIIPs or WLM holding work back to keep them from idling.
