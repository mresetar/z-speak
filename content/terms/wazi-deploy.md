---
title: "Wazi Deploy"
params:
  expansion: "IBM Wazi Deploy"
  short: "CLI tooling that turns a DBB-built package into a controlled deployment to CICS, Db2, IMS or batch on z/OS, with an audit trail."
  ref: { title: "IBM Docs: Wazi Deploy", url: "https://www.ibm.com/docs/en/developer-for-zos/17.0.0?topic=overview-wazi-deploy" }
  aka: ["WD"]
  related: ["Dependency Based Build", "Z Open Automation Utilities", "Ansible for IBM Z", "CICS", "Db2 for z/OS", "CMCI", "CI/CD Pipeline", "CICS Bundle", "VS Code"]
  links:
    - title: "IBM Docs: Getting started with Wazi Deploy"
      url: "https://www.ibm.com/docs/en/developer-for-zos/17.0.x?topic=deploy-getting-started-wazi"
categories: ["Modern Z"]
tags: ["devops", "automation"]
---

DBB answers "what needs rebuilding"; Wazi Deploy answers "how does the built package get to a target environment, safely and provably." It takes the `.tar` and `application-manifest.yml` a DBB pipeline produces, works out a deployment plan from the artifact types inside (CICS load modules, Db2 binds, IMS, batch, z/OS Connect), and runs it either as Python on z/OS UNIX or as Ansible from a distributed host over SSH.

Every run also writes an **evidence** file — what was deployed, where, and whether it succeeded — which `wazideploy-evidence` turns into an HTML audit report. That is the piece mainframe shops actually need from a deployment tool: not just "did it work" but a record they can hand to an auditor.

Under the covers it calls **ZOAU** for data set and job operations and, for CICS, the **CMCI** REST interface to create, update or delete programs — so a shop that already has those two pieces in place is most of the way to using it.
