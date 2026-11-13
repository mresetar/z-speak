---
title: "Connect:Direct"
params:
  expansion: "IBM Sterling Connect:Direct"
  short: "Managed, restartable, peer-to-peer file transfer — the way large institutions actually move files to the mainframe."
  ref: { title: "IBM Docs: IBM Sterling Connect:Direct", url: "https://www.ibm.com/docs/en/connect-direct" }
  aka: ["NDM", "Network Data Mover"]
  related: ["Data Set", "Batch Scheduler", "Communications Server", "MQ Channel", "FTP"]
  links:
    - title: "Wikipedia: Connect:Direct"
      url: "https://en.wikipedia.org/wiki/Connect:Direct"
categories: ["Middleware"]
tags: ["integration", "operations"]
---

Still widely called **NDM** after its original name. Unlike FTP it is a managed protocol: transfers are defined as **Processes**, they checkpoint and restart from the point of failure rather than the beginning, they authenticate both ends, and they can trigger a job on arrival.

That last part is why it matters operationally — a file landing is a scheduling event, and the nightly batch often begins when a partner's file arrives. It also handles the EBCDIC/ASCII conversion and record-format mapping that make mainframe file exchange different from copying bytes.

The product is now **IBM Sterling Connect:Direct**, and it exists for z/OS, UNIX, Windows and others; each installation is a **node**. A transfer always involves two: the **PNODE** that starts the Process and the **SNODE** at the other end, each defined to the other in a **network map**. A Process is a small script with statements such as `COPY`, `RUN JOB`, `RUN TASK` and conditional logic, submitted from batch, from ISPF panels, or through an API.

Security has its own vocabulary. Nodes authenticate each other and the submitting user is mapped to a local user ID on the remote side through **proxy** definitions; **Secure Plus** adds TLS. Things that go wrong are usually not the network: a data set that cannot be allocated on the receiving side, a record format or code page mismatch that garbles packed-decimal fields (binary data must not be translated), or a remote node that is simply not started. The statistics file on each node records every step of every Process and is where the investigation starts.
