---
title: "IDMS"
params:
  expansion: "Integrated Database Management System"
  short: "A network-model (CODASYL) database and transaction system, now from Broadcom, still running core applications at many large sites."
  ref: { title: "Wikipedia: IDMS", url: "https://en.wikipedia.org/wiki/IDMS" }
  aka: ["CA IDMS", "IDMS/DC", "ADS/Online", "CODASYL", "central version"]
  related: ["IMS", "Db2 for z/OS", "Datacom", "Adabas", "CICS", "COBOL", "Natural"]
categories: ["Middleware"]
tags: ["database", "transactions", "legacy"]
---

IDMS implements the CODASYL network model. Data is held as **records** connected by named **sets**, each linking an owner record to its member records — a customer to its orders, an order to its lines. A program does not ask a question and receive rows; it *navigates*, finding an owner and walking the set with commands such as `OBTAIN NEXT … WITHIN`. Where IMS allows a segment one parent, an IDMS record can belong to many sets, so networks of relationships are natural.

It is a complete environment rather than just a database. **IDMS/DC** is its own transaction monitor, an alternative to CICS, and ADS is its 4GL. The running system is called a *central version*. An SQL option was added later, but the big applications are navigational COBOL.

Created by Cullinane in the 1970s, it passed to Computer Associates and then Broadcom. You meet it in insurance, government and manufacturing systems that have run unchanged in essentials for forty years — fast, stable, and dependent on people who can read a schema diagram.
