---
title: "Zowe"
params:
  expansion: "Zowe — the Open Mainframe Project framework"
  short: "Open-source CLI, APIs and VS Code tooling that let you work with z/OS the way you work with anything else."
  related: ["z/OSMF", "z/OS UNIX", "IDz", "SDSF", "ZSS", "Zowe CLI", "Zowe Explorer", "Zowe API Mediation Layer", "Node.js on z/OS"]
  ref: { title: "Zowe project", url: "https://www.zowe.org" }
  aka: ["Open Mainframe Project", "Zowe Desktop", "zowe.yaml"]
  links:
    - title: "Wikipedia: Zowe"
      url: "https://en.wikipedia.org/wiki/Zowe"
categories: ["Modern Z"]
tags: ["open-source", "tooling", "modernization"]
---

Zowe has three parts that matter in practice:

- **Zowe CLI** — `zowe files list ds "PROD.*"`, `zowe jobs submit ds ...`, `zowe zos-files download`. Scriptable z/OS access from a laptop or a CI runner.
- **API Mediation Layer** — one authenticated gateway in front of z/OSMF and other z/OS APIs.
- **Zowe Explorer** — a VS Code extension for browsing data sets, USS files and jobs.

It is what makes a normal pipeline possible: check COBOL out of Git, build it with a CLI call, submit tests, read results — no 3270 in the loop. Under the covers most of it calls **z/OSMF** REST APIs.

Zowe is an open-source project of the **Open Mainframe Project** under the Linux Foundation, with IBM, Broadcom, Rocket and others contributing, and it is released in major versions (v1, v2, v3) with **long-term support** levels. Vendors also ship supported distributions and offer **conformant** plug-ins and extensions, so a CICS, Db2 or Endevor plug-in for the CLI comes from whoever owns that product.

Two halves need installing, and they are independent. The **client side** — CLI, Explorer, SDKs — goes on a workstation or build server and needs only a z/OSMF (or FTP, or SSH) endpoint to talk to; many sites use only this. The **server side** runs on z/OS as started tasks and provides the API Mediation Layer, a desktop in the browser, and **ZSS**. Connection details live in a **team configuration** file, `zowe.config.json`, which can be shared in a repository, with credentials kept apart in the operating system's secure store.
