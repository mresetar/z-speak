---
title: "CFRM"
params:
  expansion: "Coupling Facility Resource Management"
  short: "The sysplex policy that names the Coupling Facilities and defines every structure allowed in them — size, placement and options."
  ref: { title: "IBM Docs: The role of CFRM in a sysplex", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=resources-role-cfrm-in-sysplex" }
  aka: ["CFRM policy", "couple data set", "CDS", "IXCMIAPU", "SFM", "SETXCF"]
  related: ["CF Structure", "Coupling Facility", "XCF", "Parallel Sysplex", "Automatic Restart Manager", "WLM", "System Logger"]
  links:
    - title: "IBM Docs: The CFRM couple data set"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=complex-cfrm-couple-data-set"
categories: ["System Services"]
tags: ["sysplex", "sysprog", "configuration"]
---

A sysplex keeps its shared configuration in **couple data sets**: the sysplex couple data set, holding membership and status, and function couple data sets for individual services. The CFRM couple data set holds **policies** describing the Coupling Facilities and, for each structure, its name, initial and maximum size, the preference list of Coupling Facilities it may be placed in, and options such as duplexing.

A policy is written as control statements for the administrative utility `IXCMIAPU` and activated with `SETXCF START,POLICY,TYPE=CFRM,POLNAME=…`. One policy is active at a time, though several can be stored.

Activating a new policy does not immediately change structures that are already allocated: the changes stay *pending* until each affected structure is rebuilt or reallocated. Checking for pending changes afterwards is part of the procedure.

CFRM has siblings managed in the same way and often mentioned together: **SFM** (sysplex failure management, which decides what happens to a system that stops responding), ARM, WLM and LOGR policies each have their own couple data set.
