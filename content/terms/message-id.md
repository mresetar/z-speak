---
title: "Message ID"
params:
  expansion: "Message identifier"
  short: "The code at the start of every system message — a component prefix, a number and a type letter — which is what you search the documentation for."
  ref: { title: "IBM Docs: z/OS MVS System Messages — Format of the message body", url: "https://www.ibm.com/docs/en/SSLTBW_3.1.0/com.ibm.zos.v3r1.ieam100/ieamx_msgfmt.htm" }
  aka: ["message identifier", "msgid", "message prefix", "type code", "action message", "WTOR", "IEF450I", "MPF", "MPFLSTxx", "messages and codes"]
  related: ["MCS Console", "SYSLOG", "ABEND", "SDSF", "System Automation", "NetView", "Condition Code", "SQLCODE", "CICS Abend Codes", "PARMLIB", "HASP"]
  links:
    - title: "IBM Docs: z/OS MVS System Messages — Message format"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=introduction-message-format"
    - title: "IBM Docs: z/OS Basic Skills — Overview of an abend"
      url: "https://www.ibm.com/docs/en/zos-basic-skills?topic=abend-overview"
categories: ["System Services"]
tags: ["fundamentals", "troubleshooting", "operations"]
---

Every message z/OS and its products issue starts with an identifier such as `IEF450I`, and the identifier is built to be decoded. The first three characters name the **component** that issued it (some products use a longer prefix), the digits number the message, and the optional final letter is a type code that says what kind of message it is.

| Suffix | Meaning |
|---|---|
| `I` | Information — no action required |
| `E` | Eventual action — something must be done, but the task carries on meanwhile |
| `A` | Immediate action — the operator must do something now; the task waits |
| `D` | Immediate decision — the operator must choose one of the listed replies; the task waits |
| `W` | System wait — a catastrophe; the system or a major subsystem must be restarted |
| `S` | Severe error — one for the system programmer |

The prefixes are worth learning, because they tell you which manual to open and often which team to call:

| Prefix | Component | Prefix | Component |
|---|---|---|---|
| `IEA`, `IEE`, `IEF` | Supervisor, commands, job scheduling | `DFH` | CICS |
| `IEC`, `IGD`, `IDC` | Data management, SMS, IDCAMS | `DSN` | Db2 |
| `$HASP` | JES2 | `DFS` | IMS |
| `ICH`, `IRR` | RACF | `CSQ` | IBM MQ |
| `IKJ`, `ISP` | TSO/E, ISPF | `CEE`, `IGZ` | Language Environment, COBOL runtime |
| `IXC`, `IXG`, `IWM` | XCF, System Logger, WLM | `BPX` | z/OS UNIX |
| `IST`, `EZ…` | VTAM, TCP/IP | `ICE`, `IEW` | DFSORT, binder |

The identifier, not the text, is the stable part. The wording changes between releases and is translated; the ID is what documentation, automation and other people's experience are indexed by. Searching for the ID gives the explanation, the system action and the expected response — and for an abend, the message usually carries the completion code and reason code that the real diagnosis depends on.

Messages that need a reply (**WTORs**) show a reply number in front, answered with `R nn,text`. Consoles would be unreadable if everything were shown, so `MPFLSTxx` in PARMLIB suppresses the routine ones from the display and hands selected IDs to automation — but suppressed messages are still written to SYSLOG, which is where to look when the console showed nothing.
