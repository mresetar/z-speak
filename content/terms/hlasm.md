---
title: "HLASM"
params:
  expansion: "High Level Assembler"
  short: "The z/Architecture assembler — used for system exits, performance-critical code and anything close to the metal."
  ref: { title: "IBM Docs: z/OS — HLASM", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=hlasm" }
  aka: ["assembler", "BAL", "ALC", "ASM", "assembler language", "IBM assembler"]
  related: ["COBOL", "Load Module", "z/OS", "CSECT", "GOFF", "Metal C", "Binder", "Control Block", "C/C++", "Fortran"]
  links:
    - title: "Wikipedia: IBM High Level Assembler"
      url: "https://en.wikipedia.org/wiki/IBM_High_Level_Assembler"
categories: ["Development"]
tags: ["language", "sysprog"]
---

Most application code is not assembler, but the parts that must be — RACF exits, SMF exits, subsystem interfaces, authorised (**APF**) code, vendor products — are. Its macro facility is genuinely powerful, and the operating system's own interfaces are still documented as assembler macros (`GETMAIN`, `ATTACH`, `WTO`).

Reading a little HLASM is a practical skill even for application developers: dump analysis and `S0C4` debugging eventually land you in a listing.

A few conventions make listings readable. Source is column-sensitive: a name starts in column 1, the operation is conventionally in column 10 and operands in 16, and a character in column 72 continues the statement. Code lives in a **CSECT**, data layouts are described by DSECTs, and a `USING` statement tells the assembler which register addresses which area. Programs call each other with standard linkage: register 13 points to a save area, 14 holds the return address, 15 the entry point and, on return, the return code.

The assembler itself is program `ASMA90`. Its macros come from libraries such as `SYS1.MACLIB` and `SYS1.MODGEN`, which is where the system's interfaces are actually defined.

For new system-level code the alternative is **Metal C**, which compiles C into HLASM source. It reduces how much assembler you write, not how much you need to be able to read.
