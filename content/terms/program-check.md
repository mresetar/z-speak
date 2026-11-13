---
title: "Program Check"
params:
  expansion: "Program interruption and the S0Cx abends"
  short: "The hardware's refusal to execute an instruction, reported as an S0C1 to S0CF abend whose last digit says what was wrong."
  ref: { title: "IBM Docs: Analyzing abends", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=hangs-analyzing-abends" }
  aka: ["program interruption", "program exception", "S0C1", "S0CB", "S0C9", "operation exception", "protection exception", "data exception", "PIC"]
  related: ["ABEND", "PSW", "Interrupt", "Packed Decimal", "Storage Key", "Dump", "Language Environment", "ESTAE"]
categories: ["Operating System"]
tags: ["troubleshooting", "internals", "beginner"]
---

When a processor cannot or may not carry out an instruction it raises a **program interrupt**, with a code naming the reason. If no recovery routine handles it, z/OS ends the task with system abend `S0Cx`, where *x* is that code. These are the commonest abends a programmer sees, and a handful account for nearly all of them.

**0C1, operation exception:** the bytes being executed are not an instruction. The program has branched into data or to a routine that was never linked in — look for an unresolved reference in the binder listing. **0C4, protection or addressing exception:** storage was referenced that the program does not own or that does not exist. A subscript out of range, a missing parameter, or a bad pointer are the usual causes; the reason code (4, 10, 11, 3B) says which kind. **0C7, data exception:** a decimal instruction met a field that is not valid packed decimal — an uninitialised counter, spaces in a numeric field, a record read with the wrong layout. **0C9 and 0CB:** division by zero or a quotient too large, in binary and decimal respectively.

To find the cause you need the failing instruction and the data it used. The PSW at the time of error gives the address; subtracting the program's load point gives an offset to look up in the compiler listing. Language Environment does this arithmetic for you in the **CEEDUMP** traceback, and names the statement if the program was compiled with the right options.

The trap is that the failing instruction is where the damage was detected, not always where it was done.
