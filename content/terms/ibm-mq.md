---
title: "IBM MQ"
params:
  expansion: "IBM MQ for z/OS (formerly MQSeries, WebSphere MQ)"
  short: "Assured, once-only message delivery between applications, on and off the mainframe."
  aka: ["MQSeries", "WebSphere MQ", "MQ"]
  related: ["CICS", "Db2 for z/OS", "Coupling Facility", "Subsystem", "CICS Transaction Gateway", "Queue Manager", "MQ Channel", "Dead-Letter Queue"]
  ref: { title: "IBM Docs: IBM MQ", url: "https://www.ibm.com/docs/en/ibm-mq" }
  links:
    - title: "Wikipedia: IBM MQ"
      url: "https://en.wikipedia.org/wiki/IBM_MQ"
categories: ["Middleware"]
tags: ["integration"]
---

A **queue manager** owns queues; applications `MQPUT` and `MQGET`, and MQ guarantees the message is delivered exactly once, surviving restarts. Channels connect queue managers across platforms, which is why MQ is the most common bridge between mainframe systems of record and everything else.

On z/OS it integrates with transaction managers: a CICS or IMS unit of work can commit database updates and message puts atomically. **Shared queues** put the messages in a Coupling Facility structure so any member of the sysplex can serve them — a queue that survives losing the system that hosted it.

Applications reach a queue manager through the **MQI**, a small set of calls, or through JMS. Messages are **persistent** (logged, and recovered after a failure) or **non-persistent** (faster, lost at restart); the choice is per message and is a frequent source of misplaced expectations. "Exactly once" also depends on the program using **syncpoint** — a `MQGET` outside a unit of work removes the message immediately, whatever happens next.

On z/OS a queue manager is a subsystem with two main address spaces: the queue manager itself (`xxxxMSTR`) and the **channel initiator** (`xxxxCHIN`), which handles network connections. Messages live in **page sets** and are logged much as Db2 logs data. A few queues deserve attention in operations: the **dead-letter queue**, where undeliverable messages end up; transmission queues, whose depth shows a stopped channel; and any queue with **triggering**, which starts a CICS transaction or a job when a message arrives.
