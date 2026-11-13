---
title: "MVS"
params:
  expansion: "Multiple Virtual Storage"
  short: "The 1974 ancestor of z/OS — and still the word people use for its traditional, non-UNIX side."
  ref: { title: "IBM Docs: z/OS MVS", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-mvs" }
  aka: ["MVS/ESA", "MVS/XA", "MVS/370", "BCP", "Base Control Program"]
  related: ["z/OS", "Address Space", "JCL", "Hercules"]
  links:
    - title: "Wikipedia: MVS"
      url: "https://en.wikipedia.org/wiki/MVS"
categories: ["Operating System"]
tags: ["history", "zos"]
---

MVS introduced a separate virtual address space per job, which is still the core isolation model of z/OS. The product name became OS/390 and then z/OS, but the term never died: `MVS` appears in command prefixes, message IDs, module names, and in everyday speech.

When a colleague says "do it on the MVS side", they mean data sets and JCL rather than z/OS UNIX files and shell scripts.

The lineage is worth knowing because the names are still in use. MVS/370 arrived in 1974 with 24-bit addressing, MVS/XA (1983) brought 31-bit, MVS/ESA (1988) added data spaces, OS/390 (1995) packaged MVS with its companion products, and z/OS (2001) made it 64-bit. Each step kept running the programs of the one before.

Formally, MVS lives on as the **Base Control Program** (BCP), the core element of z/OS. That is why the manuals are still called *z/OS MVS System Commands*, *MVS System Codes* and *MVS JCL Reference*, and why APIs and tools say "MVS data sets" when they mean the traditional, non-UNIX kind.

One old release has a second life. MVS 3.8J, from 1981, is free to use and runs under the Hercules emulator, so it is the version hobbyists actually get to install and operate.
