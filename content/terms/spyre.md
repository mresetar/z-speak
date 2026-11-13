---
title: "Spyre Accelerator"
params:
  expansion: "IBM Spyre Accelerator"
  short: "A PCIe AI card for IBM Z that adds generative-AI-scale inferencing beyond what the on-chip accelerator handles."
  related: ["Telum", "IBM Z", "zCX", "watsonx Code Assistant for Z"]
  ref: { title: "IBM z17 announcement", url: "https://newsroom.ibm.com/z17" }
  aka: ["Spyre", "AI accelerator card"]
categories: ["Hardware"]
tags: ["ai", "hardware"]
---

Each card carries 32 AI-optimised cores, 128 GB of LPDDR5 memory and around 300 TOPS; a z17 can hold up to 48 of them, and they can be clustered for larger models. It became generally available for z17 in late October 2025.

The division of labour is the point. **Telum II**'s on-chip accelerator handles the small models that must score *inside* a transaction with sub-millisecond latency — fraud checks on a payment in flight. Spyre handles the larger ensemble and language models that need real throughput, including inferencing for containerised workloads in **zCX**, without sending regulated data off the platform.

The card is IBM's own design, from IBM Research, and it is the first accelerator on the platform aimed at **generative** models — large language models and encoder models — rather than the compact scoring models Telum handles. Cards are designed to work as a cluster — typically the eight cards of one I/O drawer, giving up to 1 TB of memory between them. They sit in the I/O drawers like other PCIe features and are assigned to LPARs. The supported way to use them is through Linux on Z or a container environment, with a software stack IBM supplies for serving models.

What it is for on a mainframe is narrower than "run a chatbot". The cited uses are assistants for operations and development that work on a site's own code and system data, and combining a small in-transaction model with a larger one that examines only the doubtful cases. The practical limit is model size and supported frameworks: not every open model runs, and the list of supported models is published and changes over time.
