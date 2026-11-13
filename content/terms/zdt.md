---
title: "ZD&T"
params:
  expansion: "IBM Z Development and Test Environment"
  short: "An emulated IBM Z machine on x86 Linux that runs real z/OS for development and testing — licensed for non-production use only."
  ref: { title: "IBM: Z Development and Test Environment", url: "https://www.ibm.com/products/z-development-and-test-environment" }
  aka: ["zD&T", "ZDT", "zPDT", "ADCD", "Wazi Sandbox", "Wazi as a Service"]
  related: ["z/OS", "Hercules", "IBM Z", "IDz", "Wazi Deploy", "z/Architecture", "MLC"]
  links:
    - title: "IBM Docs: ZD&T product overview"
      url: "https://www.ibm.com/docs/en/zdt/11.0.2?topic=product-overview"
categories: ["Modern Z"]
tags: ["development", "tooling", "modernization"]
---

A development team wants its own z/OS: somewhere to break things, IPL at will, and run automated tests without competing for a shared LPAR. ZD&T provides one without mainframe hardware. It emulates the z/Architecture instruction set and common devices on an x86-64 Linux server, laptop or cloud instance, and on that emulated machine you IPL genuine, unmodified z/OS with CICS, Db2, IMS and the compilers.

IBM supplies ready-built system images, known as **ADCD**, so that a working z/OS is a download and a start command away; enterprise editions add tools to extract volumes and data from a real system and to provision instances on demand. The underlying emulator is the same technology as **zPDT**, the version offered to software vendors.

The limits are the point. The licence forbids production work and production-scale performance testing, and an emulated processor is far slower than a real one. Treat it as a functional test environment.

For teams that want real hardware for the same purpose, IBM offers z/OS virtual servers in its cloud as Wazi as a Service. The open-source **Hercules** emulator is technically comparable but cannot be used legally with current z/OS.
