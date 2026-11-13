---
title: "RRS"
params:
  expansion: "Resource Recovery Services"
  short: "The z/OS syncpoint manager that makes updates in several resource managers — Db2, IMS, MQ, CICS — commit or back out together."
  ref: { title: "IBM Docs: Using resource recovery services", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=recovery-using-resource-services" }
  aka: ["Resource Recovery Services", "RRSAF", "unit of recovery", "UR", "ATRRRS"]
  related: ["Unit of Work", "System Logger", "Db2 for z/OS", "IMS", "IBM MQ", "WLM", "Started Task", "Queue Manager"]
  links:
    - title: "IBM Docs: Callable resource recovery services"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=recovery-callable-resource-services"
categories: ["System Services"]
tags: ["transactions", "availability", "sysprog"]
---

Inside a CICS or IMS region, the transaction manager coordinates commit. But plenty of work runs outside one — a batch job, a Db2 stored procedure, a Java application server — and may update Db2, send an MQ message and call IMS in a single business transaction. Something neutral has to run the **two-phase commit** across them. That is RRS, a component of z/OS itself.

Each participating resource manager registers its interest in a **unit of recovery**. When the application commits, RRS asks them all to prepare, logs the decision, then tells them all to commit; if any refuses, all back out. Its logs are **System Logger** log streams, which is what lets a unit of recovery be resolved from another system in the sysplex after a failure.

RRS runs as a started task and is easy to forget until it is missing. Db2 stored procedures in WLM-managed address spaces, the RRS attachment facility (RRSAF), IMS access from outside IMS, and transactional VSAM all require it — so in practice it is a mandatory part of any modern z/OS image.
