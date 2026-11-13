---
title: "ServerPac"
params:
  expansion: "ServerPac system delivery offering"
  short: "The way z/OS is delivered: a prebuilt set of system libraries and SMP/E zones that you restore and tailor, not install piece by piece."
  ref: { title: "IBM Docs: Choosing an installation package for installing z/OS products", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=methods-choosing-installation-package-installing-zos-products" }
  aka: ["CBPDO", "Shopz", "portable software instance", "CustomPac", "z/OSMF Software Management"]
  related: ["SMP/E", "CSI", "z/OSMF", "SYSRES", "PTF", "z/OSMF Workflows", "Systems Programmer"]
categories: ["System Services"]
tags: ["maintenance", "sysprog", "smp-e"]
---

Installing z/OS and its priced features from scratch with **SMP/E** would mean hundreds of products and thousands of steps. A ServerPac is IBM doing that for you. You order through Shopz, IBM builds a system containing exactly your licensed products at a tested service level, and ships the result: the target and distribution libraries, already populated, with matching SMP/E zones. You restore it onto your volumes, adapt names and catalogs, and IPL.

Today a ServerPac comes as a **portable software instance** deployed with z/OSMF Software Management, followed by workflows for the configuration steps. The older ISPF-based CustomPac dialog has been retired.

The alternative is **CBPDO** (Custom-Built Product Delivery Offering): the products as SMP/E input plus service, which you `RECEIVE`, `APPLY` and `ACCEPT` into zones of your own. CBPDO suits adding one product to an existing system; ServerPac suits a new release. Either way the result is an ordinary SMP/E-maintained system, serviced with PTFs like any other.
