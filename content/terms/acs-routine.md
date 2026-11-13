---
title: "ACS Routine"
params:
  expansion: "Automatic Class Selection routine"
  short: "The SMS-written rules that decide which data class, storage class, management class and storage group a new data set gets."
  ref: { title: "IBM Docs: z/OS — Understanding the ACS process", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=exits-understanding-automatic-class-selection-process" }
  aka: ["ACS"]
  related: ["DFSMS", "ISMF", "Data Set", "SMS Classes", "UNIT"]
  links:
    - title: "IBM Docs: Writing ACS routines"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=administration-writing-acs-routines"
categories: ["Storage"]
tags: ["storage", "sms", "sysprog"]
---

When a data set is allocated on an SMS-managed system, you do not name a volume in JCL — the **ACS routines** look at the data set name, size, job and other criteria, and assign the classes: a data class for the physical attributes, a storage class for performance and availability, a management class for backup and migration, and through that a storage group, which picks the actual volumes.

They are written in a small special-purpose language (`SELECT`, `WHEN`, `SET`) in ISMF, and a storage administrator typically writes one routine per class type. An ACS routine can silently override the `SPACE`, `DSORG` or `DATACLAS` you coded in your DD — which is exactly why your allocation never looks quite like what you wrote.

Newcomers get bitten twice: first because allocations behave differently on different systems (each sysplex has its own ACS logic), and second because ACS runs at *allocation* — reallocating is the only way to change what it decided.
