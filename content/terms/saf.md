---
title: "SAF"
params:
  expansion: "System Authorization Facility"
  short: "The z/OS interface every security decision goes through, whichever security product answers it."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is SAF?", url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=zos-what-is-saf" }
  aka: ["RACROUTE", "SAF interface", "security router"]
  related: ["RACF", "ESM", "z/OS", "PassTicket", "RACF Profile", "RACF Class", "SETROPTS", "LDAP"]
  links:
    - title: "IBM Docs: RACROUTE: Router interface"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=macros-racroute-router-interface"
categories: ["Security"]
tags: ["security", "architecture"]
---

SAF is the router. A component calls `RACROUTE`, SAF passes the request to whichever **ESM** is installed — RACF, CA ACF2 or CA Top Secret — and returns allow or deny. Applications and middleware code to SAF, not to a specific product.

This is why Liberty, Db2, CICS, FTP and SSH on z/OS can all authenticate against the same enterprise identity without each maintaining its own user store, and why a shop can change security product without changing applications.

The request names a **class** (for example `DATASET`, `FACILITY`, `SURROGAT`, or a product's own class), a **resource name** within it, and the access wanted. The answer is a SAF return code: 0 for allowed, 8 for denied, and — the one that surprises people — **4 for "no decision"**, meaning no profile covers the resource or the class is not active. What happens on a 4 is up to the caller: some products allow, some deny, and the product documentation says which.

SAF does more than access checks. The same interface verifies user IDs and passwords (`RACROUTE REQUEST=VERIFY`), builds the **ACEE** control block that represents a signed-on user, serves certificates from key rings, and maps identities from certificates or distributed directories to z/OS user IDs. z/OS UNIX uses a set of callable services alongside it to map user IDs to UIDs and GIDs.
