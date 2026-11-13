---
title: "Dead-Letter Queue"
params:
  expansion: "IBM MQ dead-letter queue (DLQ)"
  short: "The queue where a queue manager puts messages it cannot deliver, each with a header saying why and where it was going."
  ref: { title: "IBM Docs: Working with dead-letter queues", url: "https://www.ibm.com/docs/en/ibm-mq/8.0.0?topic=objects-working-dead-letter-queues" }
  aka: ["DLQ", "undelivered message queue", "DEADQ", "MQDLH", "dead-letter header", "CSQUDLQH", "DLQ handler", "backout queue", "BOQNAME", "poison message", "BOTHRESH"]
  related: ["IBM MQ", "Queue Manager", "MQ Channel", "Unit of Work", "CICS", "System Automation", "Batch Scheduler"]
categories: ["Middleware"]
tags: ["integration", "troubleshooting", "operations"]
---

A message arriving over a channel must be put somewhere. If the target queue does not exist, is full, is put-inhibited, or the message is too long for it, the receiving queue manager has a choice: stop the channel, blocking everything behind the message, or set this one aside. The **dead-letter queue** is where it is set aside. It is an ordinary local queue, named in the queue manager's `DEADQ` attribute.

Each message placed there is prefixed with a **dead-letter header** (`MQDLH`) recording the original destination queue and queue manager, a **reason code** — `MQRC_Q_FULL`, `MQRC_UNKNOWN_OBJECT_NAME`, `MQRC_NOT_AUTHORIZED` and so on — and when it happened. Nothing is lost, but nothing is processed either, and message order relative to later traffic is broken.

Dealing with the queue is a routine operational task. The **dead-letter queue handler** utility (`CSQUDLQH` on z/OS) applies a rules table: retry the put a number of times, forward to another queue, or discard, selected by reason code and destination. More importantly, the queue depth should be monitored and alerted on, because a message there means a business transaction did not complete.

A related mechanism handles **poison messages** — ones an application reads, fails on, rolls back, and reads again forever. Each queue can name a **backout queue** and a threshold (`BOQNAME`, `BOTHRESH`); the application or its framework checks the message's backout count and moves it aside when the threshold is passed.

If no dead-letter queue is defined, an undeliverable message stops its channel, which is sometimes chosen deliberately where strict ordering matters more than flow.
