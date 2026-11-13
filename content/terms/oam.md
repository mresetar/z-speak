---
title: "OAM"
params:
  expansion: "Object Access Method"
  short: "The DFSMS component that stores unstructured objects — and, less obviously, runs the tape library interface on almost every z/OS system."
  ref: { title: "Wikipedia: Object access method", url: "https://en.wikipedia.org/wiki/Object_access_method" }
  aka: ["OSREQ", "object storage", "OAM address space"]
  related: ["Access Method", "DFSMS", "Virtual Tape", "Db2 for z/OS", "DFSMSrmm", "TS7700", "Tape Label"]
  links:
    - title: "IBM Docs: Managing the object access method (OAM)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=command-managing-object-access-method-oam"
categories: ["Storage"]
tags: ["storage", "sms", "tape"]
---

OAM has two jobs that share little beyond a name.

The first is **object support**: an application hands OAM a named stream of bytes — a scanned cheque, a statement image — through the `OSREQ` interface, and OAM keeps it in Db2 tables, on tape, in a z/OS UNIX file system or in cloud object storage, moving it between tiers under SMS management classes. There are no records and no DCB; an object is read and written whole or by byte range.

The second is **tape library support**. System-managed tape — automated libraries and virtual tape systems such as the TS7700 — is driven through OAM, which keeps the tape configuration database and talks to the library when a volume is mounted or ejected.

That is why you will find an `OAM` started task on systems that have never stored a single object.
