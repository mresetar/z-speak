---
title: "Zowe API Mediation Layer"
params:
  expansion: "Zowe API Mediation Layer (API ML)"
  short: "The Zowe component that puts one secure gateway, one catalogue and single sign-on in front of all the REST APIs on a z/OS system."
  ref: { title: "Zowe Docs: API Mediation Layer overview", url: "https://docs.zowe.org/stable/user-guide/api-mediation/api-mediation-overview/" }
  aka: ["API ML", "API Gateway", "Discovery Service", "API Catalog", "ZAAS"]
  related: ["Zowe", "z/OSMF", "z/OS Connect", "PassTicket", "SAF", "Key Ring", "Zowe CLI", "ZSS", "Node.js on z/OS"]
  links:
    - title: "Zowe Docs: Zowe architecture"
      url: "https://docs.zowe.org/stable/getting-started/zowe-architecture/"
categories: ["Modern Z"]
tags: ["api", "modernization", "integration"]
---

A modern z/OS system exposes many REST APIs — z/OSMF, CICS, Db2, MQ, z/OS Connect, vendor products — each on its own host and port, with its own certificate and its own idea of login. The API Mediation Layer puts a single front door in front of them.

It has three main services. The **API Gateway** is a reverse proxy: clients call one address and the gateway routes each request to the right back-end, load-balancing across instances. The **Discovery Service** is the registry where services announce themselves and their health. The **API Catalog** is a web page listing every registered API with its documentation.

The gateway also provides **single sign-on**. A user authenticates once, against the z/OS security product, and receives a token. For each back-end call the gateway translates that identity into what the service expects — typically by generating a **PassTicket**.

It runs on z/OS as Java servers under the Zowe started task, and can be made highly available across a sysplex. Zowe CLI and Zowe Explorer can connect through it instead of to each service directly.
