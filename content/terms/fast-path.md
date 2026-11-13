---
title: "Fast Path"
params:
  expansion: "IMS Fast Path"
  short: "The IMS option built for extreme transaction rates and availability, trading database flexibility for speed."
  ref: { title: "IBM Docs: IMS — Fast Path database types", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=functions-fast-path-database-types" }
  aka: ["DEDB", "data entry database", "MSDB", "EMH", "expedited message handler", "area", "VSO"]
  related: ["IMS", "IMS Region", "Segment", "HDAM and HIDAM", "DL/I", "Coupling Facility", "Unit of Work"]
  links:
    - title: "IBM Docs: IMS 15.5: Creating Fast Path databases"
      url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=databases-creating-fast-path"
categories: ["Middleware"]
tags: ["ims", "database", "performance"]
---

Some workloads are simple and enormous: debit an account, check a card limit, record a call. For these IMS provides Fast Path, a set of database types and a message path with fewer features and far shorter code paths than full-function IMS.

Its main database is the **DEDB**, the data entry database. A DEDB is divided into **areas**, each a separate data set that can be taken offline, reorganised or recovered without affecting the others, and that can be kept in up to seven copies for availability. Its hierarchy is restricted, and includes a *sequential dependent* segment type designed for collecting inserts at very high speed. Updates are applied to the database only after the commit has been logged, which shortens locking. With the **virtual storage option**, an area is held in memory or in a Coupling Facility structure.

On the transaction side, the **expedited message handler** bypasses the normal message queues and delivers work directly to programs waiting in IFP regions.

The cost is rigidity: fewer structural options and a design that must be right from the start. Fast Path is found where the numbers demand it — core banking and payment authorisation above all.
