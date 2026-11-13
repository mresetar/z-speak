---
title: "GDDM"
params:
  expansion: "Graphical Data Display Manager"
  short: "The z/OS and z/VM graphics subsystem that draws charts and images on 3270 graphics terminals and printers."
  ref: { title: "Wikipedia: Graphical Data Display Manager", url: "https://en.wikipedia.org/wiki/Graphical_Data_Display_Manager" }
  aka: ["GDDM-PGF", "Presentation Graphics Feature", "ICU", "ADMGDF"]
  related: ["3270", "ISPF", "QMF", "AFP", "TSO/E"]
  links:
    - title: "IBM Docs: Graphical Data Display Manager (GDDM)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=products-graphical-data-display-manager-gddm"
categories: ["System Services"]
tags: ["interactive", "terminal", "history"]
---

Before the PC, a business chart on a screen meant a 3270 graphics terminal, and the software that drew it was GDDM. It gives programs a device-independent interface for lines, areas, text and images, and renders the result on whatever is attached — a graphics display, an emulator, a plotter, a page printer. Its Presentation Graphics Feature adds a chart-making utility that end users could drive directly.

Very little new is written for it. It persists because other products call it: ISPF uses it for graphics areas in panels, QMF for charts, and various older applications for maps and diagrams. That is why a GDDM library still appears in TSO logon procedures and why terminal emulators offer a "graphics" option.

For most people today, GDDM is a name in a `STEPLIB` or an unexplained `ADM` message. Knowing that the prefix belongs to the graphics subsystem is usually all that is needed.
