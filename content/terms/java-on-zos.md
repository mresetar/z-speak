---
title: "Java on z/OS"
params:
  expansion: "IBM 64-bit SDK for z/OS, JZOS Batch Launcher"
  short: "How Java runs on z/OS — the IBM Semeru/SDK runtime, JZOS for batch, and JVM servers inside CICS and Liberty."
  ref: { title: "IBM Docs: JZOS Batch Launcher and Toolkit", url: "https://www.ibm.com/docs/en/sdk-java-technology/8?topic=components-jzos-batch-launcher-toolkit" }
  aka: ["JZOS", "JVM on z/OS", "Semeru", "Java", "JVM"]
  related: ["zIIP", "WebSphere Liberty for z/OS", "CICS", "z/OS UNIX", "WebSphere Application Server for z/OS", "Python on z/OS", "IMS Catalog", "CICS Transaction Gateway", "Node.js on z/OS", "Go on z/OS"]
  links:
    - title: "IBM Docs: IBM Semeru Runtime Certified Edition for z/OS"
      url: "https://www.ibm.com/docs/en/semeru-runtime-ce-z"
categories: ["Development"]
tags: ["language", "java", "development", "batch"]
---

Java is a first-class z/OS citizen, but it arrives through several doors, and knowing which one you are using explains most configuration differences:

- **Batch** — the **JZOS Batch Launcher** runs a JVM inside a regular batch job or started task: JCL drives it, SDSF shows the output, and a `System.exit()` sets the step's condition code.
- **CICS** — a **Liberty JVM server** or a plain JVMSERVER hosts Java as a CICS resource, sharing the region's security and transaction context.
- **Liberty / z/OS Connect** — Java under z/OS UNIX as its own server, with SAF identity propagation and WOLA/LOCAL connections into CICS and Db2.

Two platform specifics matter. Java on z/OS runs on the z/OS UNIX side (HFS/zFS files, `JAVA_HOME`, OMVS), so a Java project still needs RACF, data sets and JCL around it to be operational. And much Java work is **zIIP-eligible**, which is the strategic point: Java modernisation is one of the few levers that reduces MLC cost while adding function.

The newcomer surprise is usually file handling — record-oriented data sets versus byte streams, EBCDIC tagging, and the fact that "just write a file" in a batch JVM means deciding between `DD:`/JZOS `ZFile` access to data sets or ordinary z/OS UNIX files.
