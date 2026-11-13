---
title: "Endevor"
params:
  expansion: "CA Endevor Software Change Manager"
  short: "The dominant mainframe source control and promotion system — code moves through environments under its control, not yours."
  ref: { title: "Broadcom — Endevor Software Change Manager", url: "https://techdocs.broadcom.com/us/en/ca-mainframe-software/traditional-management/ca-endevor-software-change-manager.html" }
  aka: ["ChangeMan ZMF", "SCLM", "SCM"]
  related: ["PDS", "Load Module", "Dependency Based Build", "COBOL", "Panvalet", "Librarian", "Git on z/OS", "CI/CD Pipeline"]
categories: ["Development"]
tags: ["development", "governance"]
---

Endevor manages source in **environments** and **stages** (DEV → QA → PROD), and a **promotion** does not just copy source: it recompiles, relinks, moves the load module, and records who did it and why. Footprints written into the load module let you prove which source built the running program — a control auditors like very much.

The alternatives are Broadcom **ChangeMan ZMF** and IBM's older **SCLM**. All three predate Git and model the same thing: change as a governed, auditable transition rather than a commit.

Shops moving to Git usually keep the promotion controls and rebuild them around a pipeline — which is the problem **Dependency Based Build** exists to solve.

The inventory has a fixed shape: environment, **system**, **subsystem**, **type** and **element**. A source member is an element of a type such as COBOL or JCL, and each type has **processors** — in effect JCL procedures kept under Endevor's control — that say what generating, moving or deleting that kind of element means. A **generate** runs the compile and link; a **move** promotes; and work bound for production is collected in a **package**, which is cast, approved by the people named in an approver group, and executed as one unit that can be backed out.

The developer's routine is sign out an element, edit, generate, test, and move it up the map. Sign-out is the concurrency control, with parallel development handled by a separate facility that detects overlapping changes. Access today is through ISPF panels, an Eclipse plug-in, the Zowe CLI plug-in and a VS Code extension, and a bridge product lets teams work in Git while Endevor remains the system of record. The product is now Broadcom's, and older documentation calls it CA Endevor SCM.
