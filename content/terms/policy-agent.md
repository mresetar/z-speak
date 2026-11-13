---
title: "Policy Agent"
params:
  expansion: "z/OS Communications Server Policy Agent (PAGENT)"
  short: "The started task that reads network security policies and installs them into the TCP/IP stack — the source of AT-TLS and IP filter rules."
  ref: { title: "IBM Docs: Policy Agent", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=components-policy-agent" }
  aka: ["PAGENT", "policy-based networking", "IPSec policy", "IDS", "Network Configuration Assistant", "IKED"]
  related: ["AT-TLS", "Communications Server", "Started Task", "z/OSMF", "Key Ring", "MODIFY Command", "z/OS UNIX", "zERT", "IPSec", "TCP/IP Profile"]
  links:
    - title: "IBM Docs: Policy-based networking"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=applications-policy-based-networking"
categories: ["Security"]
tags: ["network", "security", "tls"]
---

On z/OS, much of network security is applied by the TCP/IP stack on behalf of applications that know nothing about it. The rules are written as **policies**, and the Policy Agent is the component that reads them and loads them into the stack.

Several kinds of policy pass through it: **AT-TLS** rules, saying which connections are to be encrypted and with which certificates; **IP security** — packet filtering and IPSec virtual private networks, working with the IKE daemon; **intrusion detection** rules that recognise scans and attacks; and quality-of-service and routing policies.

The policies are text files, typically in the z/OS UNIX file system, and are complex enough that most sites generate them with the **Network Configuration Assistant**, a z/OSMF task. After a change, `F PAGENT,REFRESH` makes the agent re-read and reinstall them.

Its importance is easy to underestimate because it does nothing visible. If PAGENT is not running, or a policy fails to install, the stack has no TLS rules to apply, and applications that depend on AT-TLS either fail to connect or — worse — may be configured to proceed unencrypted. Start-up order therefore matters: the Policy Agent must be up and its policies installed before servers that rely on them accept work.
