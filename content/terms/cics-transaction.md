---
title: "CICS Transaction"
params:
  expansion: "CICS transaction, task and program"
  short: "A four-character code that names a piece of CICS work; entering it starts a task, which runs the associated program."
  ref: { title: "IBM Docs: CICS — TRANSACTION resources", url: "https://www.ibm.com/docs/en/cics-ts/5.6.0?topic=attributes-transaction-resources" }
  aka: ["tranid", "transaction ID", "task", "PROGRAM resource", "PCT", "PPT", "TCICSTRN"]
  related: ["CICS", "CSD", "CEMT", "EXEC CICS", "Pseudo-Conversational", "Unit of Work", "RACF Profile", "MRO", "CICS Region", "Threadsafe"]
  links:
    - title: "IBM Docs: Resource definition attributes"
      url: "https://www.ibm.com/docs/en/cics-ts/6.x?topic=resources-resource-definition-attributes"
categories: ["Middleware"]
tags: ["cics", "configuration", "fundamentals"]
---

Three words are easily confused. A **transaction** is a defined resource with an identifier of up to four characters, such as `PAY1`. Its definition names the first **program** to run and attributes such as priority and transaction class. A **task** is one execution of a transaction: when a user types `PAY1`, or a request arrives from a web client, a queue or another region, CICS creates a task, gives it a number, and runs the program. Thousands of tasks for the same transaction can exist at once.

Transactions and programs are resources defined in the CSD with the `CEDA` transaction, or installed from bundles; programs can also be installed automatically on first use. IBM's own transactions begin with `C` — `CEMT`, `CEDA`, `CESN` — which is why installation ones should not.

Security hangs on the identifier. **Transaction-attach security** checks whether the user may start a given transaction, and it is the primary access control in most regions; what the program then does is frequently not checked further.

"Transaction" also has its database meaning — a unit of work that commits or backs out. One CICS task may contain several of those, separated by syncpoints.

For monitoring and accounting, the transaction ID is the key by which response times and processor use are reported.
