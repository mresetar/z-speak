---
title: "AFP"
params:
  expansion: "Advanced Function Presentation"
  short: "IBM's architecture for high-volume page printing, separating a document's data from the forms, fonts and layouts applied to it."
  ref: { title: "Wikipedia: Advanced Function Presentation", url: "https://en.wikipedia.org/wiki/Advanced_Function_Presentation" }
  aka: ["Advanced Function Printing", "PSF", "MO:DCA", "IPDS", "PAGEDEF", "FORMDEF", "overlay"]
  related: ["SYSOUT", "JES", "JCL", "Record Format", "GDDM"]
  links:
    - title: "IBM Docs: Introducing Advanced Function Presentation"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-introducing-advanced-function-presentation"
categories: ["System Services"]
tags: ["printing", "batch"]
---

A line printer prints what the program wrote, 132 characters across. AFP printers address every point on the page, and AFP is the set of formats and software that lets ordinary batch output drive them. The trick is separation: the application still writes plain records, and *resources* held in libraries say how to dress them. A **page definition** maps record fields to positions and fonts, a **form definition** selects paper, duplexing and overlays, and an **overlay** is an electronic pre-printed form.

JCL names them on the `OUTPUT` statement — `PAGEDEF=`, `FORMDEF=` — and **PSF** (Print Services Facility) takes the output from the JES spool, merges the resources, and sends an IPDS stream to the printer, tracking every page so a jam can be recovered exactly.

This is how bank statements, invoices and policies have been produced by the million for decades. The same documents are now mostly rendered to PDF or archived electronically, but the AFP resources remain the definition of what the document looks like, so they survive long after the printers have gone.
