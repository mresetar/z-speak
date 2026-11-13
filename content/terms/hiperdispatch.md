---
title: "HiperDispatch"
params:
  expansion: "HiperDispatch (z/OS and PR/SM cache-aware dispatching)"
  short: "z/OS and PR/SM cooperating to keep each LPAR's work on the same few physical cores, so it finds its data still in cache."
  ref: { title: "IBM Docs: The concept of HiperDispatch mode", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=mode-concept-hiperdispatch" }
  aka: ["vertical polarization", "vertical high", "vertical medium", "vertical low", "parked processor"]
  related: ["PR/SM", "LPAR", "WLM", "SMT", "RNI", "RMF", "IRD", "Dispatcher"]
  links:
    - title: "Wikipedia: HiperDispatch"
      url: "https://en.wikipedia.org/wiki/HiperDispatch"
categories: ["System Services"]
tags: ["performance", "zos", "internals"]
---

A modern IBM Z processor runs fast only while its data is in cache, and the caches are layered: private to a core, shared by a chip, shared across a drawer. Classic LPAR dispatching spread an LPAR's logical processors across whatever physical cores were free, so work kept landing on cores whose caches held someone else's data. HiperDispatch makes PR/SM and the z/OS dispatcher cooperate so that work stays close to where it ran last.

PR/SM **vertically polarizes** each LPAR's logical processors according to its weight. **Vertical high** processors are effectively dedicated to one physical core. **Vertical medium** processors share a core in proportion to the weight. **Vertical low** processors are **parked** — given no work unless there is spare capacity. z/OS then groups logical processors into **affinity nodes** that match the chip topology and keeps each unit of work within its node. The z17 guide describes the result as less cross-cluster "help" and better cache locality.

It is the default on current z/OS, and it is required for SMT and for LPARs with more than 64 logical processors. What surprises people is the interaction with LPAR definitions. Defining many more logical processors than the weight entitles an LPAR to does not buy capacity: the extra ones come up vertical low and sit parked. RMF's partition data shows the polarization, and it is the first place to look when an LPAR "has eight CPs but behaves like three".
