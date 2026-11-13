---
title: "HMC"
params:
  expansion: "Hardware Management Console"
  short: "The workstation used to power, configure and IPL the mainframe itself."
  ref: { title: "IBM Docs: Hardware Management Console (HMC) 2.17.0", url: "https://www.ibm.com/docs/en/module_1721331501652/pdf/HMCVersion2170-4June2025.pdf" }
  aka: ["SE", "Support Element", "HMA", "Hardware Management Appliance"]
  related: ["CPC", "IPL", "LPAR", "STP", "CPU MF", "RAS", "DPM"]
  links:
    - title: "Wikipedia: IBM Hardware Management Console"
      url: "https://en.wikipedia.org/wiki/IBM_Hardware_Management_Console"
categories: ["Hardware"]
tags: ["operations", "hardware"]
---

The HMC is a hardened appliance (a locked-down Linux PC) that talks to the **Support Element** inside each CPC. From it you activate LPARs, load a new I/O configuration, take a stand-alone dump, or power the machine off — the operations that exist below the operating system.

HMC access is one of the most privileged things in a data centre: someone with it can deactivate production. Expect it to be on an isolated network with its own access controls.

The division of labour is worth knowing. The **Support Element** (SE) is the controller inside the frame — two of them, for redundancy — and it is what really talks to the hardware. The HMC is the remote user interface to one or many SEs; since the z15 it can be ordered as the **Hardware Management Appliance**, a redundant pair built into the frame, and from the z17 code level that is the only form — the standalone HMC desktop is gone. What an LPAR looks like when it is activated comes from **activation profiles** stored on the SE: the *image profile* defines processors, weights and memory, and the *load profile* holds the IPL device address and load parameter.

The HMC also provides the **Operating System Messages** panel and an integrated 3270 console, which are the last-resort way to talk to a z/OS system whose normal consoles are unavailable. And it exposes a **Web Services API**, so the same actions can be scripted — which is how automation, **DPM** and tools such as Ansible drive the hardware.
