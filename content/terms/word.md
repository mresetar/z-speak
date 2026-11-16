---
title: "Word"
params:
  expansion: "Halfword, fullword and doubleword"
  short: "The mainframe's storage units: a halfword is 2 bytes, a word (fullword) 4 and a doubleword 8 — whatever the machine's register size."
  ref: { title: "IBM Docs: HLASM — DC instruction", url: "https://www.ibm.com/docs/en/hla-and-tf/1.6?topic=statements-dc-instruction" }
  aka: ["halfword", "fullword", "doubleword", "quadword", "boundary alignment", "big-endian", "bit 0"]
  related: ["HLASM", "z/Architecture", "PSW", "Control Block", "COBOL", "Packed Decimal", "Zoned Decimal", "Dump", "AMODE and RMODE"]
  links:
    - title: "Wikipedia: Word (computer architecture)"
      url: "https://en.wikipedia.org/wiki/Word_(computer_architecture)"
categories: ["Development"]
tags: ["fundamentals", "data", "internals"]
---

System/360 fixed these sizes in 1964 and they have not moved since:

| Unit | Bytes | Assembler | COBOL `COMP` picture |
|---|---|---|---|
| Halfword | 2 | `DC H'1'` | `PIC S9(4)` |
| Word / fullword | 4 | `DC F'1'` | `PIC S9(9)` |
| Doubleword | 8 | `DC FD'1'` | `PIC S9(18)` |
| Quadword | 16 | — | — |

A word stayed four bytes when registers grew to 64 bits with z/Architecture, so a general register today holds a doubleword, not a word. Documentation, control block maps and dump formatters all use these names, which is why "the fullword at offset 8" is a normal sentence on this platform.

Each unit has a natural **boundary**: halfwords on even addresses, fullwords on multiples of four, doublewords on multiples of eight. The assembler inserts padding to keep fields aligned, and COBOL does the same when `SYNCHRONIZED` is coded. Unexplained slack bytes in a record layout, and two programs that disagree about a record's length by a byte or two, usually trace back to alignment.

Two conventions surprise people arriving from other platforms. Integers are **big-endian** — the most significant byte comes first, so the fullword value 1 is `00000001` in a dump and reads naturally. And bits are numbered from the left starting at zero: **bit 0** is the most significant bit, the opposite of what most other architectures' manuals do.
