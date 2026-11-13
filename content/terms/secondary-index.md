---
title: "IMS Secondary Index"
params:
  expansion: "IMS secondary indexes and logical relationships"
  short: "The two IMS features that let a program reach a hierarchical database by something other than its root key and its one fixed tree."
  ref: { title: "IBM Docs: IMS 15.5 — Using secondary indexes with logical relationships", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=indexes-using-secondary-logical-relationships" }
  aka: ["secondary index", "logical relationship", "logical child", "logical parent", "XDFLD", "PROCSEQ", "index pointer segment", "logical database", "PSINDEX"]
  related: ["IMS", "Segment", "HDAM and HIDAM", "PSB", "DL/I", "Db2 Index", "Alternate Index", "IMS Catalog"]
categories: ["Middleware"]
tags: ["ims", "database", "legacy"]
---

An IMS database is a tree, entered at the root by the root key. That is fast for the access path the designer had in mind and awkward for every other. Two features widen the options without changing the stored hierarchy.

A **secondary index** is a separate index database whose entries point at segments in the main database. It can be built on a field that is not the root key — a customer name, say — and can even point at a segment lower in the tree. A program uses it by naming the index in its PCB with `PROCSEQ`, after which the database appears ordered by the indexed field, or by qualifying a call on the indexed field (`XDFLD`). Indexes may be **sparse**, omitting segments by rule, and need not be unique.

A **logical relationship** connects segments in different physical databases, or different parts of one, so that a program sees a combined hierarchy. A **logical child** segment has both a physical parent and a **logical parent**; the classic use is a many-to-many link, such as orders and parts, stored once and seen from either side. The combined view is defined as a **logical database**, and programs code calls against it as if it were physical.

Both have costs that explain their reputation. Every insert, delete and key change must maintain the pointers, reorganising one database can require work on those related to it, and the rules for deleting a segment that is someone else's logical parent are intricate. HALDB eased the reorganisation problem with self-healing pointers. Newer designs often prefer a few well-chosen secondary indexes to webs of logical relationships.
