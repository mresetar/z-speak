---
title: "DFSMS"
params:
  expansion: "Data Facility Storage Management Subsystem"
  short: "Policy-driven storage management: where data sets land, how they are backed up, when they migrate."
  ref: { title: "IBM Docs: z/OS DFSMS", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-dfsms" }
  aka: ["SMS", "system-managed storage"]
  related: ["DFSMS", "DFSMShsm", "DFSMSdss", "DFSMSrmm", "DASD", "Data Set", "Virtual Tape", "Catalog", "ISMF", "ACS Routine", "SMS Classes", "Extended Format"]
  links:
    - title: "Wikipedia: Data Facility Storage Management Subsystem (MVS)"
      url: "https://en.wikipedia.org/wiki/Data_Facility_Storage_Management_Subsystem_(MVS)"
categories: ["Storage"]
tags: ["storage", "sysprog"]
---

Instead of coding volumes in JCL, you attach classes and let **ACS routines** decide:

- **Storage class** — performance and availability requirements
- **Management class** — backup, retention, migration rules
- **Data class** — the physical attributes (RECFM, space, VSAM options)
- **Storage group** — the pool of volumes that can be used

Components you will hear named separately: **DFSMSdfp** (the base access methods), **DFSMShsm** (space management, migration to cheaper tiers, backup), **DFSMSdss** (fast copy/dump/restore), **DFSMSrmm** (removable media).

When a data set has been "migrated", DFSMShsm has moved it to ML1/ML2 and the next reference will recall it — with a delay that surprises people.

The classes are assigned when a data set is created. The **ACS routines** — small programs written by the storage administrator in their own simple language — run in a fixed order (data class, storage class, management class, storage group) and look at the data set name, the job, the user and what the JCL asked for. A data set that receives a storage class is **SMS-managed**; one that does not is left alone. Users can request a class in JCL, but the routines may override the request, and usually do.

All of this configuration lives in a control data set, and the active copy is what the `D SMS` commands show. For the programmer the benefit is shorter JCL — `DSN`, `DISP` and perhaps a size are often enough, and with a suitable data class even `SPACE` can be left out. The cost is that behaviour depends on rules you cannot see in the job: when a data set lands somewhere unexpected, the question is which class it was given and why, and the storage team answers it.
