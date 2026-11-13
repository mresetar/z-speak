---
title: "Enclave"
params:
  expansion: "WLM enclave (a transaction that spans address spaces)"
  short: "A WLM construct that lets one piece of work be managed and accounted as a unit of its own, wherever it runs."
  ref: { title: "IBM Docs: Multisystem enclave support", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=participants-multisystem-enclave-support" }
  aka: ["WLM enclave", "independent enclave", "dependent enclave", "enclave SRB", "preemptable SRB"]
  related: ["WLM", "TCB", "zIIP", "DDF", "Dispatcher", "Db2 for z/OS", "SMF", "Stored Procedure"]
categories: ["System Services"]
tags: ["performance", "internals", "transactions"]
---

Classic z/OS manages work by address space: a job is a job, and its priority belongs to the whole address space. That breaks down for servers. A Db2 distributed address space handles thousands of unrelated requests, and treating them all alike would make a trivial lookup and a huge report equally important.

An **enclave** solves this. A server creates one for each incoming request and classifies it to WLM — by user ID, plan, client address and so on — and from then on the request has its own service class, goal and dispatching priority, independent of the address space that hosts it. Tasks and SRBs join the enclave while they work for it, and an enclave can span address spaces and, as a **multisystem enclave**, systems.

Db2 **DDF** threads are the best-known case, alongside WebSphere and Liberty requests, Db2 stored procedures and parallel query tasks. Enclaves are also the vehicle for **zIIP** eligibility: much of the work IBM allows on a zIIP runs as enclave SRBs. An **independent** enclave is a transaction of its own; a **dependent** one extends an existing address space's transaction.

The practical consequences are in classification and reporting. Distributed Db2 work must be classified under the `DDF` subsystem type in the WLM policy or it falls into a low default. And CPU time used in enclaves is reported in the enclave's service class and in SMF 30 fields for the owning address space, which trips up anyone adding the numbers.

Do not confuse it with a Language Environment enclave, which is an unrelated use of the word.
