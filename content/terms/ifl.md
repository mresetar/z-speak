---
title: "IFL"
params:
  expansion: "Integrated Facility for Linux"
  short: "The processor type dedicated to Linux (and z/VM) workloads — no z/OS allowed, priced far below CPs."
  ref: { title: "IBM Docs: Integrated Facility for Linux (IFL)", url: "https://www.ibm.com/docs/en/systems-hardware/zsystems/3931-A01?topic=considerations-integrated-facility-linux-ifl" }
  aka: ["Linux engine"]
  related: ["Specialty Engine", "Linux on IBM Z", "z/VM", "CP", "LinuxONE"]
  links:
    - title: "Wikipedia: Integrated Facility for Linux"
      url: "https://en.wikipedia.org/wiki/Integrated_Facility_for_Linux"
categories: ["Hardware"]
tags: ["hardware", "linux", "cost"]
---

An **IFL** is a processor core that firmware restricts to running Linux and z/VM — nothing else may be dispatched on it. That restriction is the whole point: IFL capacity does not count toward the MSU rating that z/OS software is licensed by, so Linux consolidation lands on hardware priced per-engine at a fraction of general-purpose CPs. A LinuxONE box is essentially all IFLs; a z/OS machine usually has a few IFLs riding along for Linux guests and tooling.

Physically identical to CPs, IFLs change the economics conversation the way zIIPs do for z/OS: "how many IFLs do we need for 2,000 Linux VMs?" is a hardware-capacity question with no z/OS software bill attached. RMF/SMF tools and HMC capacity views report IFL utilisation separately from CPs, so mixed frames need both numbers in any capacity picture.

The newcomer confusion mirrors CP: an IFL is not a different kind of chip, just a different licence-and-firmware envelope around the same core.
