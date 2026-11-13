---
title: "ISMF"
params:
  expansion: "Interactive Storage Management Facility"
  short: "The ISPF application storage administrators use to define and manage DFSMS classes, storage groups and data set policies."
  ref: { title: "IBM Docs: z/OS — Introduction to ISMF", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=facility-introduction-ismf" }
  aka: ["ISMF panel"]
  related: ["DFSMS", "DFSMShsm", "DFSMSdss", "DASD", "Data Set", "Catalog", "SMS Classes"]
  links:
    - title: "IBM Docs: Accessing ISMF"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=facility-accessing-ismf"
categories: ["Storage"]
tags: ["storage", "sms", "sysprog"]
---

ISMF is where **DFSMS** becomes visible: data class, storage class, management class and storage group definitions are listed, edited and validated here, and it is also the entry point for maintaining the **ACS routines** that assign them. Storage administrators live in it; application developers usually only meet it when someone asks them to check which classes their data sets ended up with.

It runs under TSO/ISPF as a set of panels (option 3.4's bigger sibling), with the familiar list-and-action-characters style: filter a list of data sets or volumes, then run actions against them. Beyond class definitions you can use it to list volumes, check data set attributes and convert non-SMS-managed data sets to SMS management.

The thing people get wrong: ISMF does not *do* the storage management — it edits the definitions and policies that DFSMS and DFSMShsm then act on. Changing a management class in ISMF does not migrate anything by itself.
