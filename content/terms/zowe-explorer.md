---
title: "Zowe Explorer"
params:
  expansion: "Zowe Explorer for Visual Studio Code"
  short: "The VS Code extension that shows z/OS data sets, UNIX files and jobs as trees you can browse, edit and submit from."
  ref: { title: "Zowe Docs: Zowe Explorer roadmap", url: "https://docs.zowe.org/stable/getting-started/user-roadmap-zowe-explorer/" }
  aka: ["ZE", "Zowe Explorer for VS Code", "Zowe Explorer for IntelliJ"]
  related: ["Zowe", "Zowe CLI", "IBM Z Open Editor", "z/OSMF", "PDS", "JCL", "SDSF", "CCSID", "CICS Explorer", "VS Code"]
  links:
    - title: "Zowe Docs: Zowe architecture"
      url: "https://docs.zowe.org/stable/getting-started/zowe-architecture/"
categories: ["Modern Z"]
tags: ["open-source", "tooling", "modernization"]
---

Zowe Explorer adds three views to Visual Studio Code: **Data Sets**, **Unix System Services** and **Jobs**. You add a profile for a system, type a filter such as `MY.HLQ.*`, and the matching data sets appear as a tree, with PDS members beneath them. Opening a member downloads it into an editor tab, and saving uploads it. Right-click a JCL member to submit it, then find the job in the Jobs view and open its spool files — the edit, submit and check-output loop of ISPF and SDSF, without a 3270 screen.

It uses the same profiles and `zowe.config.json` as **Zowe CLI**, so one setup serves both, and by default it talks to **z/OSMF**. Other extensions build on it: an FTP alternative, a CICS resource explorer, and others.

Zowe Explorer itself is only the file and job browser. Syntax highlighting, copybook resolution and code completion for COBOL, PL/I, HLASM and JCL come from a language extension installed beside it, most commonly **IBM Z Open Editor**. The two together are the usual starting point for developers who would rather not learn ISPF first.

When a member opens as unreadable characters, the cause is nearly always the encoding setting in the profile.
