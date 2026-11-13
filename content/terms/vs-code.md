---
title: "VS Code"
params:
  expansion: "Visual Studio Code for z/OS development"
  short: "Microsoft's free editor, which with IBM and Zowe extensions becomes a workstation IDE for COBOL, PL/I, HLASM, JCL and REXX on z/OS."
  ref: { title: "IBM Docs: Getting started with IBM Developer for z/OS on VS Code", url: "https://www.ibm.com/docs/en/developer-for-zos/18.0.x?topic=client-installing-developer-zos-vs-code" }
  aka: ["Visual Studio Code", "VSCode", "Code", "IBM Developer for z/OS on VS Code", "Wazi for VS Code", "language server", "ZAPP file", "zapp.yaml", "Code4z", "Che"]
  related: ["IBM Z Open Editor", "Zowe Explorer", "IDz", "z/OS Debugger", "Db2 Developer Extension", "Git on z/OS", "Dependency Based Build", "Wazi Deploy", "watsonx Code Assistant for Z", "ISPF"]
categories: ["Modern Z"]
tags: ["tooling", "modernization", "development"]
---

**Visual Studio Code** is the editor most developers outside the mainframe already use, and for that reason it has become the main alternative to ISPF and to the Eclipse-based IDz for z/OS work. The editor itself knows nothing about mainframes; everything comes from **extensions**.

The core set is small. **Zowe Explorer** connects to the host through z/OSMF, FTP or SSH and shows data sets, UNIX files and jobs in a tree — browse, edit, submit, read output. **IBM Z Open Editor** adds language support for COBOL, PL/I, HLASM, REXX and JCL: syntax highlighting, error checking as you type, code completion, outline, and jump-to-definition that follows `COPY` and include statements. A **ZAPP** file (`zapp.yaml`) in the project tells it where copybooks and include libraries are, locally or on the host. Other extensions add an interactive **debugger**, Db2 SQL editing and tuning, CICS and IMS resource views, and the AI assistant.

IBM packages its supported set as **IBM Developer for z/OS on VS Code**, part of IDz Enterprise Edition; Broadcom offers a comparable open-source bundle, **Code4z**. The basic editing and Zowe pieces are free, while debugging and some analysis features need a licence and host components.

The bigger change is the workflow it enables. Source is cloned from **Git** to the workstation, edited there, built on the host with a user build (via Dependency Based Build) and committed back — the data set is no longer where the code lives. The trap is treating it as a nicer window onto PDS members: that works, but the encoding of files, the handling of sequence numbers in columns 73 to 80, and line-length limits all need attention when source moves between a workstation and a data set.
