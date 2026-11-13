---
title: "Enterprise Extender"
params:
  expansion: "Enterprise Extender (SNA over UDP/IP)"
  short: "Carries SNA sessions across an IP network, so SNA applications keep working after the SNA network hardware is gone."
  ref: { title: "IBM Docs: Configuring static VIPAs for Enterprise Extender", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=vipas-configuring-static-enterprise-extender" }
  aka: ["EE", "HPR/IP", "HPR over IP", "SNA over IP", "XCA major node"]
  related: ["SNA", "VTAM", "Communications Server", "VIPA", "MRO", "NJE", "Connect:Direct", "TN3270", "IPSec", "Logical Unit"]
  links:
    - title: "IBM Docs: Using Enterprise Extender (EE)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-using-enterprise-extender-ee"
categories: ["System Services"]
tags: ["network", "legacy", "integration"]
---

Many business connections are still SNA: CICS regions talking to a partner's CICS, IMS links, file transfers defined decades ago, each identified by logical unit names instead of IP addresses. The wide-area SNA networks and the front-end processors that carried them have been retired. Enterprise Extender lets the applications stay as they are by transporting their traffic over IP.

Technically it treats the IP network as one more link type for SNA's high-performance routing. Each SNA packet is wrapped in a UDP datagram, on ports 12000 to 12004, between two endpoints that are both full SNA nodes — two z/OS systems, or z/OS and a partner's communications server. VTAM still establishes the sessions and still sees LU names; only the path beneath has changed.

It is defined in VTAM, and the IP address it uses must be a **static VIPA**, so that the link does not depend on any one network adapter.

For anyone coming from IP networking, the points to hold on to are that this is UDP, that it needs those five ports open in both directions through every firewall, and that problems are diagnosed with VTAM displays as much as with IP tools. A new EE link to a business partner is a joint project between two VTAM teams and two firewall teams.
