---
title: "Linux on IBM Z"
params:
  expansion: "Linux on the s390x architecture"
  short: "Ordinary Linux distributions compiled for the mainframe, usually on IFL engines."
  ref: { title: "IBM Docs: Linux on IBM Z and LinuxONE", url: "https://www.ibm.com/docs/en/linux-on-z" }
  aka: ["zLinux", "s390x"]
  related: ["z/VM", "Specialty Engine", "LPAR", "LinuxONE", "Secure Execution", "OpenShift on IBM Z", "NFS", "Fortran", "Go on z/OS", "KVM on IBM Z"]
  links:
    - title: "Wikipedia: Linux on IBM Z"
      url: "https://en.wikipedia.org/wiki/Linux_on_IBM_Z"
categories: ["Operating System"]
tags: ["linux", "open-source"]
---

RHEL, SLES and Ubuntu all ship s390x builds. It is normal Linux — same kernel, same package managers, same containers — with the platform's I/O bandwidth, hardware crypto and reliability underneath. OpenShift and z/VM-hosted Kubernetes clusters are common landing zones.

The usual motivation is co-location: run the microservices next to the system of record on the same box, and a database call becomes a memory-speed hop rather than a network round trip.

There are three ways to run it. Directly in an **LPAR**, which suits a few very large images such as a database. As guests under **z/VM**, the long-established way to host hundreds or thousands of servers on one machine. Or under **KVM**, the hypervisor that Linux people already know. **LinuxONE** is the same hardware sold as a Linux-only machine, without the ability to run z/OS.

A few things do differ from x86 and catch newcomers. The architecture is `s390x` and big-endian, so container images must be built for it and software that assumes little-endian byte order breaks. Disks may be **DASD** (ECKD, seen as `/dev/dasda`) rather than SCSI, with their own formatting tools. And the processors are usually **IFL** engines, which cannot run z/OS and are priced differently — the reason Linux capacity does not add to the z/OS software bill.
