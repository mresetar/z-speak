---
title: "CICS Transaction Gateway"
params:
  expansion: "CICS Transaction Gateway (CICS TG)"
  short: "A connector product that lets Java and other remote applications call CICS programs through a managed, pooled, secured gateway."
  ref: { title: "IBM Docs: CICS Transaction Gateway for z/OS 9.3", url: "https://www.ibm.com/docs/en/cics-tg-zos/9.3.0" }
  aka: ["CICS TG", "CTG", "ECI", "EXCI", "ECI resource adapter", "JCA", "Gateway daemon", "ESI", "CICS Universal Client"]
  related: ["CICS", "Channels and Containers", "MRO", "z/OS Connect", "WebSphere Liberty for z/OS", "Java on z/OS", "CICS Region", "PassTicket", "IBM MQ"]
categories: ["Middleware"]
tags: ["cics", "integration", "java"]
---

Long before REST APIs, application servers needed to call CICS programs. **CICS Transaction Gateway** is IBM's product for it. A Java application uses the **ECI** (External Call Interface) to say, in effect, "LINK to program X with this COMMAREA, or this channel of containers", and gets the output back. In a Java EE server the call is made through the **ECI resource adapter**, a JCA connector, so connections are pooled and can take part in the server's transactions.

The gateway can be deployed in two shapes. In **local mode** the client classes talk directly to CICS from the application server. In **remote mode** applications connect to a **Gateway daemon**, which holds the connections to CICS; on z/OS the daemon runs as a started task and reaches CICS regions over **IPIC** or **EXCI**, and several daemons can sit behind a sysplex distributor for availability. It also supports two-phase commit, so a CICS update can be coordinated with others in a global transaction.

Security is the part that needs design: the gateway can pass a user ID and password, a **PassTicket**, or an asserted identity under a trusted link, and CICS runs the program under the resulting user.

Where it fits today: z/OS Connect is the usual choice for exposing CICS programs as REST APIs to arbitrary consumers. CICS TG remains common where Java applications already use the JCA model, need transactional coordination, or call existing programs at high volume with their native data structures. The calling program must still build and parse the COBOL-shaped data, usually with generated record classes.
