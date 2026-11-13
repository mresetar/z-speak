---
title: "System Automation"
params:
  expansion: "IBM Z System Automation (and equivalents)"
  short: "Rules that watch console messages and act, so operators handle exceptions instead of routine."
  ref: { title: "IBM Docs: IBM Z System Automation", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=z-system-automation" }
  aka: ["SA z/OS", "automation product"]
  related: ["MCS Console", "Started Task", "Automatic Restart Manager", "Parallel Sysplex", "Dead-Letter Queue"]
  links:
    - title: "Wikipedia: IBM Z System Automation"
      url: "https://en.wikipedia.org/wiki/IBM_Z_System_Automation"
categories: ["System Services"]
tags: ["operations", "automation"]
---

The automation product subscribes to the message stream and matches message IDs, then starts, stops, restarts or escalates. It also owns ordered **IPL and shutdown sequences** — bring up VTAM, then TCP/IP, then Db2, then CICS — and dependency-aware recovery when a subsystem dies.

Alternatives you will meet are BMC AMI OpsAutomation and CA OPS/MVS, plus NetView underneath for the message and command infrastructure. The important consequence for developers: message text and IDs are a contract, and changing them can silently break recovery.

What separates automation from a pile of message traps is the **policy**. In IBM's product you describe each resource — a started task, a group of them, a whole application — along with how to start it, how to stop it, what "up" looks like, and what it depends on. You then tell automation the **desired state**, and it works out the commands. Asking for Db2 to be down causes the CICS regions that depend on it to be stopped first, without anyone coding that sequence.

This changes how operators work. They do not issue `START` and `STOP` directly; they change a resource's desired state, because a task stopped by hand will simply be restarted by automation that still wants it up. The same applies to developers testing on a shared system: check whether the started task you are about to cancel is under automation, and ask for it to be released first.
