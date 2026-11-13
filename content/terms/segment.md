---
title: "Segment"
params:
  expansion: "IMS database segment"
  short: "The unit of data in an IMS database — a node in a hierarchy of parents and children, playing the role a row plays in SQL."
  ref: { title: "IBM Docs: IMS — The hierarchy in a database record", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=terminology-hierarchy-in-database-record" }
  aka: ["root segment", "dependent segment", "twin", "database record", "concatenated key", "hierarchical path"]
  related: ["IMS", "DL/I", "PSB", "HDAM and HIDAM", "Fast Path", "Copybook", "Db2 for z/OS", "MFS", "IMS Status Code", "IMS Secondary Index"]
  links:
    - title: "IBM Docs: IMS 15.5: Comparison of hierarchical and relational databases"
      url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=ims-comparison-hierarchical-relational-databases"
categories: ["Middleware"]
tags: ["ims", "database", "fundamentals"]
---

An IMS database is a hierarchy. At the top is a **root segment** — a customer, say. Beneath it are **dependent segments** of various types: the customer's addresses and accounts, and beneath each account its transactions. Every segment except the root has exactly one parent. A root together with all its dependents is one **database record**, and a database is a collection of such records.

A segment is a fixed- or variable-length piece of data whose fields are described by a COBOL or PL/I copybook; IMS itself needs to know only the fields used as keys or in searches. Occurrences of the same segment type under one parent are called **twins**, and are usually kept in key order. A hierarchy may be up to 15 levels deep.

Because a child is stored with, or chained from, its parent, retrieving a customer and everything beneath it is a short walk along stored pointers and needs no join. That is the source of the speed IMS is known for — and of its rigidity: a question that cuts across the hierarchy, such as "all transactions over a given amount, for any customer", has no natural path.

Secondary indexes and logical relationships exist to add such paths, at the cost of extra structure to design and maintain.
