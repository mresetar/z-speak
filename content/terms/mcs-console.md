---
title: "MCS Console"
params:
  expansion: "Multiple Console Support console"
  short: "The operator interface where z/OS writes messages and takes commands."
  ref: { title: "IBM Docs: z/OS Basic Skills — Console configuration (MCS)", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_consoleconfig.htm" }
  aka: ["console", "WTO"]
  related: ["SDSF", "z/OS", "System Automation", "MODIFY Command", "SYSLOG", "System Trace", "Message ID"]
  links:
    - title: "IBM Docs: Defining devices as MCS, HMCS, or SMCS consoles"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=configuration-defining-devices-as-mcs-hmcs-smcs-consoles"
categories: ["System Services"]
tags: ["operations"]
---

Programs write to the console with **WTO** (Write To Operator) or **WTOR** (…with Reply) macros; the stream lands in **SYSLOG** or the sysplex-wide **OPERLOG**. Commands go the other way, prefixed by a subsystem character — `$D` for JES2, `-DIS` for Db2, `CEMT` for CICS.

In a modern shop no human watches the console. **System Automation** or a vendor equivalent matches message IDs and reacts, and only exceptions reach a person. This makes message IDs (like `IEF450I` or `IEA995I`) an operational API — changing one can break automation.

Consoles are defined in the `CONSOLxx` PARMLIB member, each with a name, the **routing codes** it receives and the commands it is allowed to issue. Besides locally attached MCS consoles there are **SMCS** consoles reached through VTAM, the HMC's integrated console, and **EMCS** consoles — extended consoles that are not screens at all but programs, such as SDSF, TSO `CONSOLE`, NetView and automation products. Most commands today arrive through an EMCS console.

Messages have a few conventions worth learning. The last letter of the ID gives the type: `I` information, `E` eventual action, `A` immediate action, `D` decision. Action messages stay on the screen, highlighted, until the condition clears or an operator deletes them. A **WTOR** carries a reply number, answered with `R nn,answer`, and the program that issued it waits until someone does — an unanswered reply is a common reason a started task appears hung. `D R,L` lists every outstanding reply.
