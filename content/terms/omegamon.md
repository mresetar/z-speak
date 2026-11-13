---
title: "OMEGAMON"
params:
  expansion: "IBM Z OMEGAMON"
  short: "IBM's family of real-time performance monitors, one per subsystem — z/OS, CICS, Db2, IMS, MQ, networks, storage."
  ref: { title: "IBM: IBM Z OMEGAMON", url: "https://www.ibm.com/products/omegamon" }
  aka: ["OMEGAMON XE", "Candle", "e3270ui", "TEP", "MainView", "SYSVIEW"]
  related: ["RMF", "SMF", "WLM", "NetView", "System Automation", "CICS", "Db2 for z/OS"]
  links:
    - title: "Wikipedia: IBM OMEGAMON"
      url: "https://en.wikipedia.org/wiki/IBM_OMEGAMON"
categories: ["System Services"]
tags: ["performance", "observability", "operations"]
---

**RMF** and SMF tell you what happened; a real-time monitor tells you what is happening now and lets you act on it. OMEGAMON is IBM's, acquired with Candle Corporation in 2004. It is a suite, not one product: there is an OMEGAMON for z/OS, for CICS, for Db2, for IMS, for MQ, for networks, for storage and for the JVM, each with deep knowledge of its subsystem's internals.

A user typically asks questions like "which task is holding this lock", "why is this CICS region short on storage", "which thread is burning CPU in Db2" — and can cancel, reprioritise or change settings from the same screen. Thresholds raise alerts that feed automation. There are several interfaces over the same agents: the terse classic 3270 screens, the enhanced 3270 user interface, and graphical front ends.

The category matters more than the brand. The equivalents are BMC's MainView and Broadcom's SYSVIEW, and a site normally has one of the three; the concepts and the kinds of screens carry over.
