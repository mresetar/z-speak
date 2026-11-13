---
title: "Queue Manager"
params:
  expansion: "IBM MQ queue manager on z/OS"
  short: "The MQ server: a subsystem that owns queues, stores and logs messages, and moves them to other queue managers over channels."
  ref: { title: "IBM Docs: IBM MQ for z/OS concepts", url: "https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=overview-mq-zos-concepts" }
  aka: ["QMGR", "MSTR", "CHIN", "channel initiator", "page set", "MQSC", "CSQUTIL", "queue sharing group", "QSG", "local queue", "remote queue", "alias queue", "CSQ9022I"]
  related: ["IBM MQ", "MQ Channel", "Dead-Letter Queue", "Subsystem", "Coupling Facility", "Db2 Log", "RRS", "CICS", "Unit of Work"]
categories: ["Middleware"]
tags: ["integration", "transactions", "operations"]
---

A **queue manager** is what an application connects to in order to put and get messages. On z/OS it is a formal subsystem with a four-character name and a command prefix, and it runs as two started tasks: the queue manager proper, `xxxxMSTR`, and the **channel initiator**, `xxxxCHIN`, which handles all network communication.

It owns several kinds of object. A **local queue** actually holds messages. A **remote queue** definition is a pointer to a queue on another queue manager; an **alias** is another name for a queue or topic; a **transmission queue** is a local queue holding messages on their way out. Objects are defined with **MQSC** commands such as `DEFINE QLOCAL` and `DISPLAY QSTATUS`, entered at the console with the command prefix, through the `CSQUTIL` batch utility, or from MQ Explorer.

Storage follows the Db2 model. Messages live in **page sets**, cached by buffer pools; every persistent message and every unit of work is written to dual **logs**, with archive logs behind them, and restart replays the log. A long-running unit of work or a full log has the same consequences as in Db2.

In a sysplex, queue managers can form a **queue sharing group**. **Shared queues** keep their messages in a Coupling Facility structure, so any member can serve them, and a message survives the loss of the queue manager that received it — the main reason to run MQ on z/OS rather than beside it.

Applications attach through an adapter for their environment — CICS, IMS, batch with RRS — so that MQ work commits together with database updates.
