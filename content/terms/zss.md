---
title: "ZSS"
params:
  expansion: "Zowe System Services"
  short: "Zowe's native z/OS server, written in C, that gives the Zowe Desktop and other components access to files, data sets and security."
  ref: { title: "Zowe Docs: Zowe glossary", url: "https://docs.zowe.org/stable/appendix/zowe-glossary/" }
  aka: ["Zowe System Services", "ZIS", "cross-memory server", "ZWESISTC", "ZWESLSTC"]
  related: ["Zowe", "Zowe API Mediation Layer", "Metal C", "APF Authorization", "Started Task", "SAF", "z/OS UNIX", "Node.js on z/OS"]
  links:
    - title: "GitHub: zowe/zss"
      url: "https://github.com/zowe/zss"
categories: ["Modern Z"]
tags: ["open-source", "internals", "modernization"]
---

Most of Zowe's server side is Java and Node.js running in z/OS UNIX. Some things those runtimes cannot do well or at all: read a data set efficiently, query the security product, call an authorized system service. ZSS is the piece that can. It is an HTTP server written in C that exposes z/OS functions as REST services to the rest of Zowe — chiefly the application framework behind the Zowe Desktop.

It works with a companion, **ZIS** — the Zowe cross-memory server, started task `ZWESISTC`. ZIS is the only part of Zowe that is **APF-authorized**. It runs in its own address space, and ZSS reaches it through a program call, so that privileged operations are confined to a small, auditable component. Access to it is controlled by a security profile.

You rarely interact with ZSS directly; you notice it in the installation steps. Setting up Zowe means APF-authorizing a load library, defining the started tasks and granting the server user ID the right permissions — and nearly all of that work is for ZSS and ZIS. A Zowe that will only be used for the CLI and API Mediation Layer can do without them.
