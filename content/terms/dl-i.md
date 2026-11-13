---
title: "DL/I"
params:
  expansion: "Data Language/I"
  short: "The call interface programs use to read and update IMS databases and message queues — IMS's equivalent of SQL."
  ref: { title: "IBM Docs: IMS — DL/I calls for database management", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=management-dli-calls-database" }
  aka: ["DLI", "CBLTDLI", "GU", "GN", "ISRT", "SSA", "status code", "EXEC DLI"]
  related: ["IMS", "PSB", "Segment", "HDAM and HIDAM", "IMS Region", "COBOL", "Unit of Work", "MFS", "IMS Status Code", "IMS Secondary Index"]
  links:
    - title: "Wikipedia: Data Language Interface"
      url: "https://en.wikipedia.org/wiki/Data_Language_Interface"
categories: ["Middleware"]
tags: ["ims", "database", "development"]
---

An IMS program does not ask a question and receive a result set. It makes calls that move a position through a hierarchy, one segment at a time:

```
CALL 'CBLTDLI' USING GU, CUSTOMER-PCB, IO-AREA, CUSTOMER-SSA.
```

The arguments are a **function code**, the PCB identifying the database view, an area for the data, and optional **segment search arguments** (SSAs) that qualify which segment is wanted. The main functions are `GU` (get unique — go directly), `GN` (get next), `GNP` (get next within parent), their hold forms `GHU`, `GHN` and `GHNP` used before an update, and `ISRT`, `REPL` and `DLET`.

After every call the program tests a two-character **status code** in the PCB. Blanks mean success, `GE` means not found, `GB` means the end of the database was reached, and `II` means a duplicate insert.

The same interface serves the transaction manager: a `GU` on the I/O PCB reads the incoming message, and an `ISRT` sends the reply.

Navigation makes the program responsible for the access path — very fast when it follows the hierarchy, awkward when it does not. CICS programs can use the same calls or the `EXEC DLI` command form. The name is also used for the full-function database manager itself, as in "DL/I batch".
