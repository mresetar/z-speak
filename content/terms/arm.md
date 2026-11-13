---
title: "Automatic Restart Manager"
params:
  expansion: "ARM (Automatic Restart Management)"
  short: "The z/OS sysplex service that automatically restarts failed servers where they can come back fastest — without an operator typing commands."
  ref: { title: "IBM Docs: Using automatic restart management", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=management-using-automatic-restart" }
  aka: ["ARM", "automatic restart management"]
  related: ["Parallel Sysplex", "Started Task", "System Automation", "WLM"]
  links:
    - title: "IBM Docs: Using the Automatic Restart Management Function of XCF"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=management-using-automatic-restart-function-xcf"
categories: ["System Services"]
tags: ["availability", "sysplex", "operations"]
---

When a critical address space dies at 3 a.m., the difference between a blip and an incident is how fast it comes back. **Automatic Restart Manager** is the z/OS facility for registering servers with a restart policy — element type, element name, restarts allowed, target systems — and having the sysplex restart them automatically: on the same system if it is healthy, on another member if it is not, with the timing and retry limits the policy defines.

The application has to cooperate: it registers via ARM services (`IXRS...`), checkpoints its state, and marks when it is *ready* — ARM distinguishes a fast, safe restart from a restart that would just fail again. CICS, IMS, Db2, MQ and most IBM middleware use ARM; a shop's own started tasks can too, by registering with an element type like `SYSTCPEE` for Telnet servers or a custom type defined in the ARM policy (`AXRMEXxx` parmlib member).

ARM and products like **System Automation** overlap in conversation: ARM is the in-the-box, sysplex-aware restart engine for registered elements; automation products sit above it, adding console management, sequencing across systems and non-ARM-capable software. When an operator says "it came back on its own", ARM is usually the reason.
