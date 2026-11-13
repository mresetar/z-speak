---
title: "LSPR"
params:
  expansion: "Large Systems Performance Reference"
  short: "IBM's published measurements of how much work each IBM Z model does relative to others — the basis of every capacity comparison."
  ref: { title: "IBM Support: IBM Z Large Systems Performance Reference", url: "https://www.ibm.com/support/pages/ibm-z-large-systems-performance-reference" }
  aka: ["Large Systems Performance Reference", "ITR", "ITRR", "zPCR"]
  related: ["RNI", "CPU MF", "MSU", "Capacity on Demand", "CPC"]
categories: ["Hardware"]
tags: ["performance", "capacity"]
---

"How much faster is the new machine?" has no single answer on IBM Z, because it depends on what you run. LSPR is IBM's answer. It runs a set of benchmark workloads on every model and configuration and publishes **ITR ratios** (internal throughput rate): how much work each configuration completes per unit of CPU busy, relative to a reference. When someone quotes that a z17 is some percentage bigger than a z16, the number comes from LSPR.

LSPR no longer uses one average. Workloads are grouped into three categories — **LOW**, **AVERAGE** and **HIGH** — by how hard they drive the memory hierarchy, measured as RNI from CPU MF counters. A high-RNI workload gains differently from a new generation than a low-RNI one. IBM's sizing tool **zPCR** takes your own CPU MF data, puts your workload in the right category, and projects capacity for a proposed configuration. MSU ratings for software pricing are published separately, but they follow the same measurements.

What newcomers get wrong is **MIPS**. It is not an IBM-published number and has not meant millions of instructions per second for decades: it is an industry convention derived from LSPR ratios, and every vendor and consultancy scales it slightly differently. Use it for rough talk. For decisions, use zPCR with your own measured workload.
