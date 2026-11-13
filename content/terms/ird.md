---
title: "IRD"
params:
  expansion: "Intelligent Resource Director"
  short: "WLM and PR/SM working together to move processor weight, channel paths and I/O priority between LPARs according to business goals."
  ref: { title: "Wikipedia: Intelligent Resource Director", url: "https://en.wikipedia.org/wiki/Intelligent_Resource_Director" }
  aka: ["LPAR cluster", "LPAR CPU management", "DCM", "Dynamic Channel Path Management"]
  related: ["WLM", "PR/SM", "LPAR", "HiperDispatch", "Parallel Sysplex", "Channel Subsystem"]
  links:
    - title: "IBM Docs: The Intelligent Resource Director"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=management-intelligent-resource-director"
categories: ["Hardware"]
tags: ["performance", "capacity", "virtualization"]
---

WLM manages work towards goals inside one z/OS system. IRD, introduced with the z900, extends that reach across the LPARs of one machine that belong to the same sysplex — an **LPAR cluster**. If important work in one LPAR is missing its goal while another LPAR is running discretionary work, the resources follow the importance.

It has three parts. **LPAR CPU management** shifts LPAR weights within the cluster, keeping their total constant. **Dynamic channel path management** moves channel paths to the control units that need them. **Channel subsystem I/O priority queuing** carries WLM's I/O priorities down into the channel subsystem so that queued requests are served in business order.

The weight management is the part still widely used, and it works only between LPARs in the same sysplex on the same CPC. The original function that varied logical processors on and off was superseded by **HiperDispatch**.
