---
title: "CICS Bundle"
params:
  expansion: "CICS bundle (deployable package of CICS resources)"
  short: "A directory in z/OS UNIX that packages related CICS resources with a manifest, so they are installed, enabled and removed as one unit."
  ref: { title: "IBM Docs: Defining CICS bundles", url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=resources-defining-cics-bundles" }
  aka: ["BUNDLE resource", "bundle part", "cics.xml", "CICS application", "CICS platform", "cloud-enabled CICS", "cics-bundle-maven", "cics-bundle-gradle", "cicsdev"]
  related: ["CICS", "CSD", "CICS Explorer", "CI/CD Pipeline", "WebSphere Liberty for z/OS", "CMCI", "z/OS UNIX", "Wazi Deploy", "Zowe CLI", "Node.js on z/OS"]
categories: ["Middleware"]
tags: ["cics", "devops", "modernization"]
---

Traditional CICS resource definitions are individual records in the CSD, grouped only by naming convention. A **bundle** takes the opposite approach: everything that belongs to one piece of function is described together and deployed together.

Physically a bundle is a directory in the z/OS UNIX file system containing a manifest, `META-INF/cics.xml`, and the artefacts it lists. Those can be definitions of ordinary resources — programs, transactions, files, URI maps — and also things that have no CSD equivalent or are awkward there: OSGi bundles and WAR or EAR files for a Liberty JVM server, Node.js applications, event bindings, policies, and JSON or web service bindings. In the region a single `BUNDLE` resource points at the directory. Installing it creates the parts; enabling, disabling and discarding it does the same to all of them, in the right order.

This is what makes CICS deployment fit a pipeline. Bundles are built on a workstation or build server — with CICS Explorer, or the Maven and Gradle plug-ins — stored as build artefacts, copied to the zFS, and installed by a script through CMCI, the Zowe CLI or an Ansible module. No one types definitions into a panel.

Above bundles sit **applications** and **platforms**, CICS's own packaging for versioned multi-bundle applications deployed across groups of regions, including several versions side by side.

Two cautions: the region's user ID needs read access to the bundle directory, a routine cause of install failures; and resources created by a bundle belong to it, so changing them by hand is overwritten at the next deployment.
