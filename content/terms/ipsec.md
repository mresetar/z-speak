---
title: "IPSec"
params:
  expansion: "IP security on z/OS (IPSec VPNs and IP filtering)"
  short: "Encryption and authentication applied at the IP layer by the z/OS TCP/IP stack, protecting traffic without any change to applications."
  ref: { title: "IBM Docs: Overview of IPSec", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=folder-overview-ipsec" }
  aka: ["IP security", "IPSec VPN", "IKE", "IKEv2", "security association", "ESP", "AH", "IP filter rules", "ipsec command", "NSS", "dynamic tunnel", "zIIP-assisted IPSec"]
  related: ["AT-TLS", "Policy Agent", "zERT", "Communications Server", "Enterprise Extender", "Digital Certificate", "zIIP", "VIPA", "ICSF"]
categories: ["Security"]
tags: ["security", "network", "encryption"]
---

**IPSec** protects whole IP packets rather than individual application sessions. Two endpoints agree a **security association** — the algorithms and keys — and every packet between them that matches a rule is authenticated and, with the **ESP** protocol, encrypted. Because it works below TCP and UDP it covers any protocol, including ones that have no TLS option, such as Enterprise Extender's UDP traffic.

On z/OS it is a function of the TCP/IP stack, called **IP security**, and it has two halves. **IP filtering** is a packet filter: rules that permit or deny traffic by address, port and protocol, making the stack its own firewall. **VPN tunnels** apply IPSec to the permitted traffic. Tunnels can be **manual**, with keys configured by hand, or — normally — **dynamic**, negotiated by the **IKE daemon** (`IKED`) using IKEv1 or IKEv2 and authenticated with certificates or pre-shared keys.

The rules live in a policy file read by the **Policy Agent**, usually built with the z/OSMF Network Configuration Assistant, since writing the statements by hand is error-prone. The `ipsec` command displays filters and tunnels and can activate or deactivate them, and a default filter policy in the TCP/IP profile applies if the Policy Agent is not running. The encryption workload can be moved to **zIIP** processors.

How it differs from **AT-TLS** is the common question. AT-TLS secures one TCP connection end to end between two applications. IPSec secures a path between two IP endpoints, which may be the final hosts or gateways in between. Sites tend to use TLS for application traffic and IPSec for partner links, for UDP, and where everything between two systems must be covered.
