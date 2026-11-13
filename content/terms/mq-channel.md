---
title: "MQ Channel"
params:
  expansion: "IBM MQ channels (message channels and MQI channels)"
  short: "The MQ link that carries messages between two queue managers, or connects a remote client application to one."
  ref: { title: "IBM Docs: IBM MQ for z/OS concepts", url: "https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=overview-mq-zos-concepts" }
  aka: ["sender channel", "receiver channel", "SVRCONN", "CLNTCONN", "cluster channel", "CLUSSDR", "CLUSRCVR", "transmission queue", "XMITQ", "listener", "CHLAUTH", "in-doubt channel", "MCA"]
  related: ["IBM MQ", "Queue Manager", "Dead-Letter Queue", "AT-TLS", "Digital Certificate", "Communications Server", "VIPA", "Connect:Direct"]
categories: ["Middleware"]
tags: ["integration", "network", "operations"]
---

MQ applications never address a network. They put a message on a queue, and if that queue lives elsewhere, a **channel** moves it. A **message channel** is a one-way link between two queue managers, defined at both ends with the same name: a **sender** at one end and a **receiver** at the other. The sender takes messages from a **transmission queue** and delivers them in batches; the two ends agree on sequence numbers so that a batch is neither lost nor delivered twice, even across a network failure. Traffic in the other direction needs a second pair.

An **MQI channel** is different: it connects a client application, running without a local queue manager, to a queue manager over the network — the **server-connection** (`SVRCONN`) channel is the server end. Java and distributed applications reach z/OS queue managers this way.

**Clusters** remove most of the manual definitions. Queue managers in a cluster advertise their queues and create **cluster-sender** and **cluster-receiver** channels automatically, with workload balancing across instances of a queue.

On z/OS, channels run in the channel initiator address space, and a **listener** accepts inbound connections on a TCP port. Security has three layers: **TLS** for encryption and partner authentication, **channel authentication records** (`CHLAUTH`) that decide which partners and user IDs are admitted, and the user ID under which the arriving messages are put.

Operationally the signs of trouble are a rising depth on a transmission queue (the channel is stopped or retrying), a channel **in doubt** after a failure, which needs resolving before it restarts, and messages arriving on the dead-letter queue at the far end.
