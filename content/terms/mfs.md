---
title: "MFS"
params:
  expansion: "Message Format Service (IMS screen formatting)"
  short: "The IMS facility that maps between the fields on a terminal screen and the message segments an application program reads and writes."
  ref: { title: "IBM Docs: IMS 15.5 — Using Message Format Service", url: "https://www.ibm.com/docs/en/ims/15.5.0?topic=messages-using-message-format-service" }
  aka: ["Message Format Service", "MID", "MOD", "DIF", "DOF", "MFS format", "/FORMAT", "MFS Language utility", "FMT statement", "MFS Web Enablement"]
  related: ["IMS", "3270", "BMS", "IMS Region", "IMS Connect", "DL/I", "Pseudo-Conversational", "Segment"]
categories: ["Middleware"]
tags: ["ims", "terminal", "legacy"]
---

An IMS transaction program does not deal with screens. It reads an **input message** from the message queue and inserts an **output message** in reply, both as plain segments of data. **MFS** sits between the terminal and the queue and does the translation, so that the program is independent of the device — the counterpart of BMS in CICS.

A format is made of four control blocks. The **DIF** (device input format) and **DOF** (device output format) describe the screen: where each field is, its length and its attributes such as protected, numeric or highlighted. The **MID** (message input descriptor) and **MOD** (message output descriptor) describe the message as the program sees it, and say which device field feeds which message field, with literals, padding and defaults. The source is written as macro-like statements (`FMT`, `DEV`, `DFLD`, `MSG`, `MFLD`), compiled by the MFS Language utility, and stored in a format library; a change is brought online with an online change or equivalent command.

The flow is circular. A program's output names a MOD; the MOD in turn names the MID to use for the user's next input; and the first field of that input is normally the transaction code, which tells IMS which program to schedule. The `/FORMAT` command displays a format to start a dialogue.

MFS source remains valuable after the 3270 screens are gone, because it is the only formal description of a transaction's input and output messages. Tools that expose IMS transactions as web services or REST APIs read MID and MOD definitions — or the COBOL copybooks beside them — to build the mapping.
