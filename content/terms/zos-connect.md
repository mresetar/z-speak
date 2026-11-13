---
title: "z/OS Connect"
params:
  expansion: "IBM z/OS Connect"
  short: "Turns CICS, IMS, Db2 and batch assets into REST APIs — and lets z/OS programs call outside APIs."
  ref: { title: "IBM Docs: IBM z/OS Connect", url: "https://www.ibm.com/docs/en/zos-connect" }
  aka: ["z/OS Connect EE", "ZCEE"]
  related: ["CICS", "IMS", "WebSphere Liberty for z/OS", "Db2 for z/OS", "IMS Connect", "IMS Catalog", "CICS Transaction Gateway", "Node.js on z/OS"]
  links:
    - title: "IBM Docs: What are z/OS Connect API providers"
      url: "https://www.ibm.com/docs/en/zos-connect/3.0.0?topic=connect-what-are-zos-api-providers"
categories: ["Modern Z"]
tags: ["api", "modernization", "integration"]
---

It maps JSON requests to the data structures existing programs already expect — a COBOL copybook becomes a request schema — so an unchanged CICS program can be called as `POST /accounts/{id}/payments` with an OpenAPI description.

The other direction matters too: an **API requester** lets a COBOL program consume an external REST service without hand-writing HTTP and JSON parsing.

It is the pragmatic middle path between "rewrite the core" and "leave it unreachable": the business logic stays where it is proven, the interface becomes something the rest of the organisation can consume.

It runs as a **Liberty** server on z/OS, as a started task, and reaches each back end through that subsystem's own connection: IPIC to CICS, IMS Connect to IMS, a REST service in Db2, MQ queues. There are two generations to keep apart. In the older **EE** style you build service archives and API archives with an Eclipse toolkit. In the newer **OpenAPI 3** style you start from an API description and map it to the program in a web-based designer, and the result is deployed as a WAR file, which can also run in a container.

Mapping is where the effort goes. A copybook says how bytes are laid out but not what they mean, so you still decide which fields to expose, how to name them, and how `REDEFINES` and variable-length arrays appear in JSON. Security needs a decision too: the caller's identity, often a token, has to be mapped to a z/OS user ID. Much of the processing is Java and therefore **zIIP**-eligible.
