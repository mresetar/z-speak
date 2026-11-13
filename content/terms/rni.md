---
title: "RNI"
params:
  expansion: "Relative Nest Intensity"
  short: "A measure of how hard a workload uses the shared caches and memory beyond the core — the thing that decides how fast it really runs."
  ref: { title: "IBM Docs: Relative nest intensity", url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=terminology-relative-nest-intensity" }
  aka: ["relative nest intensity", "nest", "L1MP", "LSPR workload category"]
  related: ["LSPR", "CPU MF", "Telum", "HiperDispatch", "MSU"]
categories: ["Hardware"]
tags: ["performance", "capacity", "internals"]
---

Inside the chip, each core has private level 1 and level 2 caches. Beyond them is the **nest**: the caches shared across the chip and drawer (virtual L3 and L4 on Telum), and then memory. Every trip into the nest costs many cycles, and the further out the data is, the more it costs. Two workloads executing the same instructions can differ in speed several times over, depending only on how often they miss and how far they have to go.

RNI puts a number on that. It is computed from CPU MF counters with a formula weighted by where the misses were resolved. Together with **L1MP** (level 1 misses per 100 instructions) it places a workload in LSPR's LOW, AVERAGE or HIGH category, and that category decides which capacity ratio applies when you compare machines. Many small, unrelated users and lots of LPARs raise RNI. A tight loop over data already in cache keeps it low.

Two things catch people out. The formula is **specific to each machine generation**, so a z16 RNI and a z17 RNI are not directly comparable, and only IBM's tools apply the right one. And RNI is a property of a workload *at a time on a configuration*: it moves with the time of day, the LPAR mix and HiperDispatch placement. Measure it over representative peaks rather than quoting a single figure.
