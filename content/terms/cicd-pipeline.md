---
title: "CI/CD Pipeline"
params:
  expansion: "Continuous integration and delivery pipelines for z/OS"
  short: "An automated sequence — build, test, package, deploy — triggered by a change in Git, replacing manual promotion of mainframe code."
  ref: { title: "IBM Z DevOps Acceleration Program", url: "https://ibm.github.io/z-devops-acceleration-program/" }
  aka: ["pipeline", "Jenkins", "GitLab CI", "GitHub Actions", "Azure DevOps", "DevOps", "impact build"]
  related: ["Git on z/OS", "Dependency Based Build", "Wazi Deploy", "zUnit", "Zowe CLI", "Ansible for IBM Z", "Endevor", "Z Open Automation Utilities", "CICS Bundle", "Shell Script"]
  links:
    - title: "Wikipedia: CI/CD"
      url: "https://en.wikipedia.org/wiki/CI/CD"
categories: ["Modern Z"]
tags: ["devops", "automation", "modernization"]
---

A pipeline is a script the organisation agrees on. When a developer pushes a change or opens a merge request, an orchestrator — Jenkins, GitLab CI, GitHub Actions, Azure DevOps — runs the same stages every time, records the outcome, and stops if one fails.

For a z/OS application the stages are recognisable ones. **Build**: clone the repository on z/OS and run **DBB**, which works out which programs are affected by the change and compiles and binds only those — an *impact build*. **Test**: run unit tests and perhaps scan the code. **Package**: collect the load modules, DBRMs and other outputs into a versioned archive in an artifact repository. **Deploy**: a tool such as **Wazi Deploy**, an Ansible playbook or a deployment product takes that package through test and production environments, copying members, binding Db2 packages and refreshing CICS programs.

The orchestrator reaches z/OS either through an agent running in z/OS UNIX or remotely, with Zowe CLI or over SSH.

What changes is as much organisational as technical. Controls that a tool like Endevor enforces — who may promote, what was approved, which source built which module — do not disappear; they are rebuilt as branch protection, approvals in the pipeline and traceable packages. Auditors need to be shown that mapping, and it is usually the longest conversation in the project.
