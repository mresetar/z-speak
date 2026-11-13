---
title: "DFSMShsm"
params:
  expansion: "Data Facility Storage Management Subsystem - hierarchical storage manager"
  short: "The z/OS component that automatically migrates, backs up and recalls data sets across storage tiers."
  ref: { title: "IBM Docs: z/OS DFSMShsm Storage Administration", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=dfsms-zos-dfsmshsm-storage-administration" }
  aka: ["HSM"]
  related: ["DFSMS", "DFSMSdss", "DFSMSrmm", "DASD", "Virtual Tape", "ISMF", "Data Set", "FlashCopy", "Image Copy"]
  links:
    - title: "Wikipedia: Hierarchical storage management"
      url: "https://en.wikipedia.org/wiki/Hierarchical_storage_management"
categories: ["Storage"]
tags: ["storage", "backup", "batch"]
---

Storage is finite and users are not careful. **DFSMShsm** is the component of **DFSMS** that runs the housekeeping: it watches volumes and data sets against the management class rules (set in **ISMF**/ACS), then *migrates* inactive data sets from level-0 DASD to cheaper **ML1**/**ML2** volumes, *backs up* changed data sets on schedule, and *recalls* or *recovers* on demand. Storage admins call the whole machinery simply **HSM**.

Users meet it as a delay and a message. A data set that has not been touched in a while is "migrated"; the next access — a `LISTDS`, a TSO `ALLOCATE`, a JCL step — triggers a recall, and the job pauses for seconds to minutes while HSM fetches it back. "It worked yesterday" is usually an HSM migration, and "dataset not cataloged" after a cleanup is usually an HSM expira-tion nobody agreed to.

The vocabulary you will hear in a storage team: **ML1/ML2** (migration levels), **ABARS** (aggregate backup and recovery, used for disaster recovery groups), **ARCG**-prefixed messages, and the daily cycle of `PRIMARY SPACE MGMT` and backup runs. Volume-level equivalents ride on **DFSMSdss**; tape volume inventory is tracked by **DFSMSrmm**.
