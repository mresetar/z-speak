---
title: "Node.js on z/OS"
params:
  expansion: "IBM Open Enterprise SDK for Node.js"
  short: "The server-side JavaScript runtime, supplied for z/OS by IBM at no charge, used for API layers, tooling and Zowe's server components."
  ref: { title: "IBM Docs: Understanding Open Enterprise SDK for Node.js", url: "https://www.ibm.com/docs/en/sdk-nodejs-zos/24.0.0?topic=understanding-open-enterprise-sdk-nodejs" }
  aka: ["Node.js", "node", "npm", "JavaScript", "IBM SDK for Node.js - z/OS", "Open Enterprise SDK for Node.js", "node-gyp", "native add-on"]
  related: ["z/OS UNIX", "Zowe", "Zowe API Mediation Layer", "ZSS", "Java on z/OS", "Python on z/OS", "Go on z/OS", "z/OS Connect", "CICS Bundle", "zIIP"]
categories: ["Modern Z"]
tags: ["language", "modernization", "open-source"]
---

**Node.js** is the JavaScript runtime that made JavaScript a server language. IBM ports it to z/OS as **IBM Open Enterprise SDK for Node.js**, a no-charge product that tracks the community's long-term-support releases and is installed with SMP/E or as a simple archive. It runs in z/OS UNIX and provides the two commands everyone expects, `node` and `npm`.

Its uses on the mainframe follow from what Node is good at: many concurrent network connections handled by small amounts of code. Typical cases are a thin REST or GraphQL layer in front of existing transactions and databases, back ends for web front ends, build and automation tooling, and running the same code a team already uses elsewhere. The **Zowe** server components — the application framework and desktop — are Node applications, which is how many sites first come to install it. CICS can also host Node.js applications inside a region, packaged in bundles.

Access to mainframe resources comes through packages: drivers for Db2, clients for MQ, CICS and IMS, and modules that call z/OS services. Part of the workload is **zIIP**-eligible.

The platform differences are the familiar ones. Most npm packages are pure JavaScript and simply work; packages with **native add-ons** written in C or C++ must be compiled on z/OS and may need changes. Files are assumed to be UTF-8 or tagged, so file tagging and automatic conversion have to be set up correctly, and data read from data sets arrives in EBCDIC. Node also runs as one process with one main thread, so scaling means running several instances, usually behind a sysplex distributor or the API Mediation Layer.
