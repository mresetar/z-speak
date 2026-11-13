---
title: "IMS Connect"
params:
  expansion: "IMS Connect"
  short: "The TCP/IP gateway to IMS: it accepts messages from the network and passes them to IMS transactions and databases."
  ref: { title: "IBM Docs: Overview of IMS Connect", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=communications-overview-ims-connect" }
  aka: ["ICON", "HWS", "OTMA", "ODBM", "IMS TM Resource Adapter"]
  related: ["IMS", "XCF", "z/OS Connect", "Communications Server", "SNA", "AT-TLS", "IMS Region", "MFS", "IMS Catalog"]
  links:
    - title: "IBM Docs: IMS 15.5: Overview of IMS Connect security"
      url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=connect-overview-ims-security"
categories: ["Middleware"]
tags: ["ims", "integration", "network"]
---

IMS Transaction Manager was built for SNA terminals. IMS Connect is the address space that gives it a TCP/IP front door. A client opens a socket, sends a message with a small header naming the target IMS and transaction, and IMS Connect forwards it to IMS through **OTMA** — the Open Transaction Manager Access interface — using XCF. The reply comes back the same way.

For databases there is a second path: IMS Connect passes DRDA requests to the Open Database Manager (**ODBM**), which lets Java and other distributed applications run SQL or DL/I calls against IMS DB without a transaction in between.

Almost everything modern reaches IMS this way — Java clients using the IMS TM Resource Adapter, **z/OS Connect** exposing transactions as REST APIs, MQ bridges and vendor tools. One IMS Connect can serve several IMS systems and vice versa. Being the network entry point, it is where TLS, user authentication and message-exit routines are configured.
