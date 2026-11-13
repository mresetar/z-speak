---
title: "RAS"
params:
  expansion: "Reliability, Availability, Serviceability"
  short: "IBM's name for the design goal of IBM Z: don't fail, keep running when something does, and repair or upgrade without stopping."
  ref: { title: "IBM Redbooks: IBM z17 (9175) Technical Guide — RAS chapter", url: "https://www.redbooks.ibm.com/abstracts/sg248579.html" }
  aka: ["RAS characteristics", "five nines", "concurrent maintenance"]
  related: ["IBM Z", "CPC", "Parallel Sysplex", "GDPS", "Capacity on Demand", "Telum", "Health Checker", "HyperSwap", "ESTAE"]
  links:
    - title: "Wikipedia: Reliability, availability and serviceability"
      url: "https://en.wikipedia.org/wiki/Reliability,_availability_and_serviceability"
categories: ["Hardware"]
tags: ["availability", "hardware", "fundamentals"]
---

The three letters are three separate promises. **Reliability**: the hardware rarely fails and never silently gets a wrong answer. Results are checked as they are produced, memory is protected by RAIM (RAID-style redundancy across memory channels) on top of ECC, and a failing core's work moves to a spare processor without the operating system noticing. **Availability**: when a part does fail, the system keeps running. Power, cooling and I/O paths are redundant, and z/OS recovery routines catch errors that do reach software. **Serviceability**: the failed part can be found, replaced or upgraded *while the machine keeps running*. That covers hot-swapping I/O cards, removing a whole CPC drawer (Enhanced Drawer Availability), and loading new firmware (Concurrent Driver Maintenance).

Serviceability is the one that surprises people from other platforms. Many planned outages elsewhere — adding memory, replacing a board, patching firmware — are routine daytime work on IBM Z. The z17 Technical Guide spends a whole chapter on it.

What newcomers get wrong is the S. It is **Serviceability**, not scalability — even the zXplore CICS0 introduction gets it wrong. And RAS is a stack property, not only a hardware one: one box can reach the famous "five nines" (99.999%, about five minutes of unplanned downtime a year), but continuous availability through outages and site loss comes from Parallel Sysplex and GDPS on top.
