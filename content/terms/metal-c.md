---
title: "Metal C"
params:
  expansion: "Metal C (the METAL option of the XL C compiler)"
  short: "A way of compiling C on z/OS that produces assembler source with no dependence on Language Environment, for system-level code."
  ref: { title: "IBM Docs: Programming with Metal C", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=c-programming-metal" }
  aka: ["METAL", "freestanding C", "__asm", "Metal C runtime library"]
  related: ["HLASM", "Language Environment", "SVC", "Problem State", "APF Authorization", "AMODE and RMODE", "Load Module", "C/C++"]
  links:
    - title: "IBM Docs: Building Metal C programs"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=c-building-metal-programs"
categories: ["Development"]
tags: ["language", "sysprog", "internals"]
---

Ordinary C on z/OS runs inside **Language Environment**, which supplies the stack, the heap and the library. System code often runs where Language Environment cannot go: in an exit, under an SRB, in supervisor state, in cross-memory mode. Such code has traditionally been written in assembler. Compiling with the `METAL` option lets it be written in C.

The compiler emits **HLASM source**, not an object module, and you assemble it. The generated code uses standard MVS linkage, so it can call and be called by assembler directly. Nothing is provided unless you ask: you choose how stack storage is obtained through prolog and epilog macros, and only a small runtime library of functions such as `memcpy` and `snprintf` is available — no `printf` to a terminal, no `fopen`.

Its distinctive feature is `__asm`, which embeds assembler statements in the C code, including invocations of system macros such as `WTO` or `STORAGE`, with C variables as operands.

It is a tool for systems programmers and product developers, not for applications. Open-source examples are easy to find: much of the low-level code in **Zowe**'s z/OS components is Metal C.
