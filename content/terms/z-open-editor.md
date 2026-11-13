---
title: "IBM Z Open Editor"
params:
  expansion: "IBM Z Open Editor for VS Code"
  short: "IBM's VS Code extension that gives COBOL, PL/I, HLASM and REXX real language support — syntax, copybook resolution, hover help."
  aka: ["Z Open Editor"]
  related: ["COBOL", "PL/I", "HLASM", "Zowe", "Zowe Explorer", "VS Code"]
  ref: { title: "IBM Z Open Editor (VS Code Marketplace)", url: "https://marketplace.visualstudio.com/items?itemName=IBM.zopeneditor" }
  links:
    - title: "IBM Docs: IBM Z Open Editor documentation"
      url: "https://ibm.github.io/zopeneditor-about/"
categories: ["Modern Z"]
tags: ["tooling", "development"]
---

Z Open Editor is what lets you edit enterprise languages in VS Code without losing your mind: language server support for COBOL, PL/I, HLASM and REXX with syntax checking, and — the part that matters most — resolution of **copybooks** and includes, whether they live in local files, z/OS data sets reached through **Zowe**, or a Git repository.

It knows the things a general-purpose editor does not: COBOL's fixed columns (with rulers and warnings for the area A/B rules), EBCDIC-safe encodings, and the z/OS file conventions. Paired with Zowe Explorer it makes "edit a member of a PDS on the mainframe from a laptop" feel like ordinary Git-based development, which is precisely the point — it is the lightweight alternative to the full **IDz** Eclipse IDE.

People get caught out by the setup: it needs a Zowe CLI team profile to reach the host, and property groups in `zapp.yaml` define where SYSLIB and copybooks are searched. No `zapp.yaml`, no copybook resolution.
