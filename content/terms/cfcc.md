---
title: "CFCC"
params:
  expansion: "Coupling Facility Control Code"
  short: "The firmware that runs in a Coupling Facility partition — the Coupling Facility's own operating system, and not z/OS."
  ref: { title: "IBM Docs: HMC — Coupling Facility Control Code (CFCC) commands", url: "https://www.ibm.com/docs/en/help-ibm-hmc-z17?topic=introduction-coupling-facility-control-code-cfcc-commands" }
  aka: ["CFLEVEL", "Coupling Facility Control Code", "CF LPAR", "CFSizer", "dynamic CF dispatching"]
  related: ["Coupling Facility", "ICF", "CF Structure", "CFRM", "Coupling Links", "Parallel Sysplex", "HMC", "LPAR"]
  links:
    - title: "IBM Docs: Understanding the coupling facility level (CFLEVEL)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=facility-understanding-coupling-level-cflevel"
categories: ["Hardware"]
tags: ["hardware", "sysplex", "clustering"]
---

A Coupling Facility is an LPAR, but nothing is IPLed in it from disk. When the partition is activated in coupling facility mode, the machine loads CFCC — licensed internal code delivered with the hardware — and that code is the whole of the Coupling Facility: it manages the structures, answers requests arriving over the coupling links, and talks to the operator through the HMC's operating system messages panel, with a small command set of its own.

Its version is the **CFLEVEL**, and it goes with the machine generation. A new CFLEVEL brings new function, but z/OS systems connecting to it need the corresponding support, and structures often need *more* storage at a higher level. Recalculating structure sizes with IBM's CFSizer tool is therefore a standard step in any hardware upgrade.

CFCC behaves unlike a normal operating system. It does not wait for interrupts but polls for work, to keep response times in microseconds — so a Coupling Facility with dedicated processors appears 100 per cent busy by design, and one sharing processors needs special dispatching options to avoid starving its neighbours.

It also has no disk of its own. Structure contents live in memory, and their resilience comes from duplexing, rebuild into another Coupling Facility, and the logs of the exploiters.
