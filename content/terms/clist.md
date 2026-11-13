---
title: "CLIST"
params:
  expansion: "Command List"
  short: "The original TSO/E scripting language — command lists for panel dialogs, installs and day-1 automation, older sibling of REXX."
  ref: { title: "IBM Docs: Overview of CLIST statements", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=conventions-overview-clist-statements" }
  aka: ["command list"]
  related: ["TSO/E", "REXX", "ISPF", "JCL", "Shell Script"]
  links:
    - title: "Wikipedia: CLIST"
      url: "https://en.wikipedia.org/wiki/CLIST"
categories: ["Development"]
tags: ["language", "automation", "interactive", "history"]
---

A **CLIST** is an interpreted TSO/E procedure: a file of TSO commands, variables, control flow (`IF`/`DO`/`SELECT`) and file I/O, executed by the TSO/E CLIST processor. Before REXX arrived, it was *the* way to wrap a sequence of TSO commands into one name, build ISPF dialogs, and generate JCL on the fly. A lot of installation code — the things run under your TSO logon procedure, site sign-ons, old admin menus — is still CLIST.

You run one by name from TSO (`%MYCLIST` or just the name), pass it parameters, and nest it inside other CLISTs. ISPF is the usual front end: a panel's action calls a CLIST, which talks to the terminal, allocates data sets and submits jobs.

The honest advice is historical: REXX is more capable, more readable, and portable beyond TSO, and IBM has said new code should use it. But you will *read* CLIST — old shops run on it — so recognising the dialect matters. Tell-tale signs: `PROC 0`, `&NAME` style variables (ampersand prefix, unlike REXX), `SET &X = &STR(...)`, and `WRITE` statements that chatter to the terminal.
