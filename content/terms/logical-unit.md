---
title: "Logical Unit"
params:
  expansion: "SNA logical unit (LU), LU types and logon modes"
  short: "An SNA network endpoint: the named port through which a terminal, printer or program holds sessions with others."
  ref: { title: "IBM Docs: Logical units", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=networks-logical-units" }
  aka: ["LU", "LU2", "LU 6.2", "LU0", "LU1", "LU3", "logmode", "logon mode table", "MODEENT", "PLU", "SLU", "LU pool", "session"]
  related: ["SNA", "VTAM", "3270", "TN3270", "CICS", "Enterprise Extender", "TSO/E", "IMS", "MRO"]
categories: ["System Services"]
tags: ["network", "legacy", "terminal"]
---

In SNA, communication does not happen between machines or addresses but between **logical units**. An LU is a named endpoint, up to eight characters, through which an end user — a person at a terminal, a printer, an application program — reaches the network. Two LUs communicate over a **session**, started when one sends the other a **BIND** request describing the rules.

LUs are grouped into **types** by the protocol they speak. **LU 2** is a 3270 display, the commonest by far. **LU 1** and **LU 3** are printers. **LU 0** is a free-form type used by older banking and retail devices. **LU 6.2** is program-to-program communication (APPC), used between CICS regions, by IMS, and by distributed transaction software. In a session one side is the **primary** LU, typically the host application, and the other the **secondary**.

The session's parameters come from a **logon mode** entry (a logmode), chosen by name from a **mode table** in VTAM. It sets things like the size of the screen, whether extended attributes are supported and the size of message units. A terminal that connects with the wrong logmode gets a wrongly sized or garbled screen, or a rejected BIND with sense code `0821`.

LUs outlived the hardware. When a PC emulator connects with **TN3270**, the Telnet server assigns the connection an LU name from a pool, and from then on VTAM and the application see an ordinary LU 2. Applications use that name: CICS derives its terminal ID from it, and security and printer routing may be keyed on it. That is why sites map particular clients to fixed LU names, and why "what is your LU name?" is still a help-desk question.
