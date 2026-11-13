---
title: "SMS Classes"
params:
  expansion: "Data class, storage class, management class and storage group"
  short: "The four SMS constructs that decide a new data set's attributes, service level, life cycle and the volumes it lands on."
  ref: { title: "IBM Docs: Defining SMS classes and storage group", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=configuration-defining-sms-classes-storage-group" }
  aka: ["data class", "storage class", "management class", "storage group", "DATACLAS", "STORCLAS", "MGMTCLAS", "SMS-managed"]
  related: ["DFSMS", "ACS Routine", "ISMF", "DFSMShsm", "Data Set", "Extended Format", "DASD", "DD Statement", "SPACE", "UNIT"]
  links:
    - title: "IBM Docs: SMS Classes and Groups"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=dfsmsdfp-sms-classes-groups"
categories: ["Storage"]
tags: ["storage", "sms", "sysprog"]
---

Before system-managed storage, every DD statement for a new data set had to say which volume and what kind of device. SMS replaces that with policy, expressed in four constructs:

| Construct | Answers |
|---|---|
| **Data class** | What does it look like? Record format, space, and options such as extended format or compression — defaults that save coding |
| **Storage class** | What service does it need? Performance and availability. Having one is what makes a data set *SMS-managed* |
| **Management class** | What happens over time? Migration, backup frequency, retention, expiry — acted on by DFSMShsm |
| **Storage group** | Which pool of volumes? Never named by the user |

They are assigned when a data set is created, by the **ACS routines**: installation-written rules that look at the data set name, the job, the user and so on. JCL may request `DATACLAS=`, `STORCLAS=` or `MGMTCLAS=`, but the ACS routines have the last word and may ignore the request.

The practical consequences are that users stop coding `UNIT` and `VOL=SER`, and that naming standards become policy. An unexpected allocation failure or migration is usually a question about which classes the data set received — visible in ISPF 3.4 and in `LISTCAT`.
