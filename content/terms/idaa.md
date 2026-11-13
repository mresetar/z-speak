---
title: "Db2 Analytics Accelerator"
params:
  expansion: "IBM Db2 Analytics Accelerator for z/OS (IDAA)"
  short: "Runs heavy analytical queries against a column-store copy of Db2 data, without moving the data off the platform."
  ref: { title: "IBM Db2 Analytics Accelerator for z/OS", url: "https://www.ibm.com/products/db2-analytics-accelerator" }
  aka: ["IDAA", "Accelerator"]
  related: ["Db2 for z/OS", "Linux on IBM Z", "Specialty Engine"]
  links:
    - title: "IBM Docs: Db2 Analytics Accelerator for z/OS: Purpose"
      url: "https://www.ibm.com/docs/en/daafz/8.1?topic=using-introduction"
categories: ["Middleware"]
tags: ["database", "data"]
---

Db2 tables are replicated into a columnar engine, and the Db2 optimiser decides per query whether to run it normally or route it to the accelerator. The application sees the same Db2 connection and the same SQL — a report that took hours can return in seconds, and it does not compete with transaction workload for the same resources.

The strategic argument is governance: analytics run against current operational data under the same security controls, instead of shipping a nightly extract into a warehouse where the copy ages and the access controls diverge.

An accelerator runs either on an appliance-style system or, more commonly now, in a Linux LPAR on IBM Z itself. Tables are chosen one by one: an administrator **adds** a table to the accelerator, **loads** it, and then either reloads it on a schedule or enables **incremental update**, which replays Db2 log changes with a delay of seconds to minutes. That delay is the main thing to understand — a query routed to the accelerator may see slightly older data than one answered by Db2.

Routing is controlled by the `CURRENT QUERY ACCELERATION` special register or a system default, with values such as `NONE`, `ENABLE`, `ELIGIBLE` and `ALL`, and newer levels let a query wait until the accelerator has caught up to a given point. Not every statement qualifies: the tables must all be on the accelerator and the SQL must use supported functions. **Accelerator-only tables** exist only on the accelerator, for intermediate results in analytics pipelines.
