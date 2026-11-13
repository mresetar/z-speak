---
title: "Dependency Based Build"
params:
  expansion: "IBM Dependency Based Build (DBB)"
  short: "Builds COBOL and PL/I from Git with real dependency analysis, so mainframe code fits an ordinary CI/CD pipeline."
  aka: ["DBB", "zAppBuild"]
  related: ["Endevor", "COBOL", "Copybook", "Zowe", "Z Open Automation Utilities", "Wazi Deploy", "Git on z/OS", "CI/CD Pipeline", "VS Code"]
  ref: { title: "IBM/dbb-zappbuild on GitHub", url: "https://github.com/IBM/dbb-zappbuild" }
  links:
    - title: "IBM Docs: IBM Dependency Based Build overview"
      url: "https://www.ibm.com/docs/en/adffz/dbb/3.0.x?topic=dependency-based-build-overview"
categories: ["Modern Z"]
tags: ["devops", "modernization"]
---

The hard part of building mainframe code from Git is not invoking the compiler — it is knowing *what to rebuild*. Change one copybook and dozens of programs are stale. DBB keeps a dependency and build-result database, scans source for `COPY` and `INCLUDE` references, and computes the impact set for a given commit.

**zAppBuild** is IBM's open-source Groovy framework on top of the DBB APIs, and is where most shops actually start: point it at an application directory, it works out language, properties and dependencies. A Jenkins, GitLab CI or Azure DevOps job then calls it like any other build step.

Together with **Git on z/OS**, **ZOAU** and **Zowe CLI**, this is the standard answer to "how do we get COBOL into a pipeline".
