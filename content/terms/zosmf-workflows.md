---
title: "z/OSMF Workflows"
params:
  expansion: "z/OS Management Facility Workflows task"
  short: "Guided, repeatable procedures in z/OSMF: ordered steps that explain, collect variables, and run JCL, scripts or REST calls."
  ref: { title: "IBM Docs: z/OSMF — What is a workflow?", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=framework-what-is-workflow" }
  aka: ["workflow", "workflow definition file", "z/OS Upgrade Workflow", "Cloud Provisioning"]
  related: ["z/OSMF", "JCL", "REXX", "ServerPac", "SMP/E", "Zowe", "Ansible for IBM Z", "Systems Programmer"]
  links:
    - title: "IBM Docs: Creating workflow definitions for z/OS"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-creating-workflow-definitions-zos"
categories: ["Modern Z"]
tags: ["automation", "sysprog", "modernization"]
---

Much systems programming knowledge lives in documents of the form "edit this member, submit that job, then issue this command". A z/OSMF workflow turns such a document into something executable. Its author writes a **workflow definition** in XML: a tree of steps, each with instructions, the skills or role required, dependencies on earlier steps, and optionally a template — JCL, a REXX exec, a shell script or a REST request — with variables to be filled in.

When someone creates an instance, z/OSMF tracks who owns each step and its state. Steps can be assigned to colleagues, performed manually and marked complete, or run by z/OSMF with the variables substituted. Simple workflows can run end to end unattended, and can be started through the REST API.

IBM uses the format widely. The z/OS upgrade procedure is now delivered as a workflow instead of a book, ServerPac configuration is a set of workflows, and many products ship theirs. Cloud Provisioning builds on the same engine to let a developer request, say, a new CICS region or Db2 subsystem from a catalogue.
