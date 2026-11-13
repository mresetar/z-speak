---
title: "NetView"
params:
  expansion: "IBM Z NetView"
  short: "The message and command automation engine underneath most mainframe operations tooling."
  ref: { title: "IBM Docs: IBM Z NetView 6.3.0", url: "https://www.ibm.com/docs/SSZJDU_6.3.0/com.ibm.iznetview.doc_6.3.0/netv630_welcome_kc.htm" }
  aka: ["NetView for z/OS", "Tivoli NetView", "NCCF"]
  related: ["System Automation", "MCS Console", "Communications Server", "OMEGAMON"]
  links:
    - title: "IBM Docs: NetView: Overview of Automation Table Function"
      url: "https://www.ibm.com/docs/en/z-netview/6.2.0?topic=function-overview-automation-table"
categories: ["System Services"]
tags: ["operations", "automation"]
---

NetView receives the console message stream and lets you attach automation to it, written in REXX or its own pipeline language, with sessions to other systems and a network management history going back to SNA.

Most shops do not program NetView directly — they run **System Automation for z/OS** on top of it, which supplies the policy model. But when automation needs to do something specific, a NetView REXX exec is usually where it ends up.

NetView began in the 1980s as the management tool for **SNA** networks and has kept that role while gaining TCP/IP management, a sysplex-wide view, and a web and REST interface. It runs as a started task with its own command environment (the **NCCF** screen), and work is done by **autotasks** — unattended operator sessions that own pieces of automation. The **automation table** is the core object: a list of message patterns and the command or exec to run when one arrives.

The usual confusion is between automation layers. z/OS itself can suppress or reword messages through **MPF** before automation sees them, so a message that never reaches NetView is often an MPF setting rather than a NetView fault. And the automation table matches message text, which is why a product upgrade that changes a message can quietly stop a rule from firing.
