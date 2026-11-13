---
title: "Zowe CLI"
params:
  expansion: "Zowe Command Line Interface"
  short: "A command-line tool for your own computer that works with z/OS data sets, jobs, consoles and more — and scripts cleanly into pipelines."
  ref: { title: "Zowe Docs: Zowe CLI quick start", url: "https://docs.zowe.org/stable/getting-started/cli-getting-started/" }
  aka: ["team config", "zowe.config.json", "Zowe plug-in", "Brightside", "zowe command"]
  related: ["Zowe", "Zowe Explorer", "z/OSMF", "Zowe API Mediation Layer", "JCL", "Z Open Automation Utilities", "Ansible for IBM Z", "CI/CD Pipeline", "CICS Bundle", "OpenSSH"]
  links:
    - title: "Zowe Docs: Using Zowe CLI"
      url: "https://docs.zowe.org/stable/user-guide/cli-using-usingcli/"
categories: ["Modern Z"]
tags: ["open-source", "tooling", "devops"]
---

`zowe zos-files list ds "MY.HLQ.*"`, `zowe zos-jobs submit local-file build.jcl --wait-for-output`, `zowe zos-tso issue command "LISTCAT"` — Zowe CLI makes the mainframe one more thing you can drive from a terminal on Windows, macOS or Linux. Commands are grouped by area, and every command can return JSON, so the output can be consumed by a script.

It needs nothing installed on z/OS beyond services that are usually already there. The core commands call the **z/OSMF** REST APIs, and alternative profiles use FTP or SSH. **Plug-ins** add command groups for CICS, Db2, MQ, IMS, Endevor and others.

Connection details live in a **team configuration** file, `zowe.config.json`, which defines named profiles — host, port, encoding — and can be checked into a project so that everyone shares the same setup. User names and passwords are kept out of it, in the operating system's credential store.

Its real value is automation. Anything a person does through ISPF panels to build, deploy or test can become a step in Jenkins, GitHub Actions or GitLab CI. It runs *off* the platform; for scripting *on* z/OS itself, ZOAU is the counterpart.
