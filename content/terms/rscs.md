---
title: "RSCS"
params:
  expansion: "Remote Spooling Communications Subsystem"
  short: "The z/VM component that moves spool files, messages and print output between systems — VM's counterpart to JES networking."
  ref: { title: "Wikipedia: RSCS", url: "https://en.wikipedia.org/wiki/RSCS" }
  aka: ["RSCS Networking", "VNET", "BITNET"]
  related: ["z/VM", "NJE", "CMS", "JES", "IUCV", "SYSOUT"]
  links:
    - title: "IBM Docs: RSCS Networking for z/VM"
      url: "https://www.ibm.com/docs/en/zvm/7.4.0?topic=rscs-networking-zvm"
categories: ["Operating System"]
tags: ["vm", "network", "operations"]
---

On z/VM everything a user sends — a file, a note, a print job — is a spool file in a virtual reader, punch or printer. RSCS is the service machine that takes spool files addressed to somewhere else and delivers them: to a user on another z/VM system, to a job entry subsystem on z/OS, or to a printer on the network.

It speaks **NJE**, so a z/VM node and a JES2 node are peers: a CMS user can submit a job to z/OS and receive the output in their reader. It also drives remote printers, including LPR and TN3270E printers over TCP/IP, which is its most common use today.

RSCS has an outsized place in networking history. IBM's internal VNET and the academic BITNET, which carried email and the first LISTSERV mailing lists, were RSCS networks.
