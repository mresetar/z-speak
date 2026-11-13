---
title: "OpenShift on IBM Z"
params:
  expansion: "Red Hat OpenShift Container Platform on IBM Z and LinuxONE"
  short: "Red Hat's Kubernetes platform running on the mainframe's Linux side, for container workloads placed next to z/OS data."
  ref: { title: "IBM Docs: Red Hat OpenShift on IBM Z and LinuxONE", url: "https://www.ibm.com/docs/en/rhocp-ibm-z" }
  aka: ["OCP", "RHOCP", "Kubernetes", "zCX Foundation for Red Hat OpenShift", "multi-architecture", "OpenShift"]
  related: ["Linux on IBM Z", "LinuxONE", "zCX", "IFL", "z/VM", "DPM", "Secure Execution", "Hyper Protect", "z/OS Connect", "Go on z/OS"]
  links:
    - title: "Wikipedia: OpenShift"
      url: "https://en.wikipedia.org/wiki/OpenShift"
categories: ["Modern Z"]
tags: ["containers", "linux", "modernization"]
---

OpenShift is the same product on IBM Z as on x86: the same operators, console and command line. Its nodes run Red Hat's CoreOS on the s390x architecture, as guests of **z/VM** or KVM or directly in LPARs, on **IFL** processors.

The reasons for placing a cluster there are specific. Applications that work with z/OS data — API layers, analytics, front ends to CICS and Db2 — run a memory-speed network hop away from it, over HiperSockets or shared adapters. The platform's virtualisation density and reliability apply to containers too. And many cores can be consolidated onto few machines, which changes the arithmetic of software licensed per core.

The catch that reaches every team is **architecture**. A container image built only for x86 will not run. Images must be built for s390x, or published as multi-architecture images. Most mainstream open-source and IBM software is available, but a dependency without an s390x build can stall a migration — check first.

A variant puts OpenShift inside z/OS itself. **zCX Foundation for Red Hat OpenShift** runs cluster nodes in z/OS Container Extensions address spaces, so containers share the z/OS system's operations, disaster recovery and network, for workloads that must live as close to z/OS as possible.
