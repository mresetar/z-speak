---
title: "Cross-Memory"
params:
  expansion: "Cross-memory services (Program Call)"
  short: "The mechanism by which a program in one address space directly calls a routine in another, with no task switch in between."
  ref: { title: "IBM Docs: An overview of cross memory communication", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=communication-overview-cross-memory" }
  aka: ["XM", "XMS", "Program Call", "PC routine", "primary address space", "secondary address space", "home address space"]
  related: ["Address Space", "Access Register", "SVC", "Problem State", "Common Storage", "TCB", "ZSS", "Db2 for z/OS", "ESTAE"]
  links:
    - title: "IBM Docs: Synchronous cross memory communication"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=concepts-synchronous-cross-memory-communication"
categories: ["Operating System"]
tags: ["internals", "architecture", "performance"]
---

Address spaces isolate programs from each other, but a server such as Db2 lives in its own address space and must be called from thousands of others. Early MVS did this by placing shared code and data in common storage and scheduling work into the target address space — slow, and a strain on a scarce area.

Cross-memory services, introduced with MVS/SP in the early 1980s, let the hardware do it. A **Program Call** (`PC`) instruction names a service by number. The machine looks the number up in tables that the service provider has set up and the system controls, switches the addressing environment to the provider's address space, and branches to its routine. The caller's own task keeps running — now executing the provider's code against the provider's storage. A return instruction switches everything back.

No dispatching occurs, so a call costs little more than an ordinary subroutine call, yet the caller can reach only the entry points it has been authorised to use. During the call the machine distinguishes the *home* address space, where the task belongs, from the *primary*, where the code is running, and the *secondary*, usually the caller's.

Nearly every subsystem is built on this. Applications never issue a `PC` themselves, but they see its traces: abends in the `0Dx` range, and address-space identifiers that cannot be reused after a cross-memory server ends.
