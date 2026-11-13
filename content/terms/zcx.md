---
title: "zCX"
params:
  expansion: "z/OS Container Extensions"
  short: "Runs Linux Docker containers inside z/OS itself — no separate LPAR, no separate operating system to manage."
  ref: { title: "IBM Docs: z/OS — What is z/OS Container Extensions?", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=extensions-what-is-zos-container" }
  aka: ["SSC", "Secure Service Container"]
  related: ["z/OS", "Linux on IBM Z", "Spyre Accelerator", "z/OS UNIX", "OpenShift on IBM Z", "Go on z/OS"]
  links:
    - title: "IBM Docs: About the z/OS Container Extensions content solution"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=collections-zos-container-extensions"
categories: ["Modern Z"]
tags: ["containers", "modernization"]
---

A zCX instance is a z/OS address space hosting a Linux appliance that runs `s390x` containers. To z/OS it is a started task under WLM control, inside the same sysplex, security and monitoring perimeter; to a developer it is a Docker endpoint.

The point is co-location without a second platform: put an open-source component — a message broker, a Grafana, an API gateway, a Python service — next to the data it consumes, reached over in-memory networking, and let the z/OS team operate it with the tools they already have. Its workload is **zIIP**-eligible. From z/OS 3.1 on z17, zCX containers can also use installed **Spyre** accelerators for inferencing.

Available since z/OS 2.4. It is not a replacement for a Linux LPAR or OpenShift — it is for containers that want to be *inside* z/OS.
