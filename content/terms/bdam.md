---
title: "BDAM"
params:
  expansion: "Basic Direct Access Method"
  short: "A legacy access method that reads and writes blocks by their position on disk — fast in 1970, largely replaced by VSAM since."
  ref: { title: "Wikipedia: Basic direct access method", url: "https://en.wikipedia.org/wiki/Basic_direct_access_method" }
  aka: ["direct data set", "DSORG=DA"]
  related: ["Access Method", "VSAM", "CKD", "DASD"]
  links:
    - title: "IBM Docs: Basic Direct Access Method"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=methods-basic-direct-access-method"
categories: ["Storage"]
tags: ["storage", "legacy"]
---

BDAM lets a program go straight to a block by relative block number, relative track, or actual disk address, optionally searching for a key recorded on the track. The application is responsible for turning a business key into a location, usually with a hashing routine of its own.

That made for very fast lookups with no index to maintain, and some old in-house systems and a few software products still use it. But the data set is tied to device geometry, cannot be extended-format or compressed, and offers no sharing or recovery help. New work uses a **VSAM** KSDS or RRDS, or a database.

You mostly meet BDAM as `DSORG=DA` in an old data set listing, and as a migration problem.
