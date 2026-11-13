---
title: "C/C++"
params:
  expansion: "C and C++ on z/OS (XL C/C++ and Open XL C/C++)"
  short: "The C and C++ compilers for z/OS: the classic XL C/C++ and the newer Clang-based Open XL C/C++, used for system code and ported software."
  ref: { title: "IBM Docs: IBM Open XL C/C++ for z/OS", url: "https://www.ibm.com/docs/en/open-xl-c-cpp-zos/2.2.0" }
  aka: ["C", "C++", "XL C/C++", "z/OS XL C/C++", "Open XL C/C++", "xlc", "ibm-clang", "c89", "CCNDRVR", "XPLINK", "LP64", "C runtime library"]
  related: ["Metal C", "Language Environment", "z/OS UNIX", "Binder", "EBCDIC", "AMODE and RMODE", "HLASM", "COBOL", "Go on z/OS", "Node.js on z/OS"]
categories: ["Development"]
tags: ["language", "development", "unix"]
---

C is the third language of the mainframe after COBOL and assembler, and the one most infrastructure is now written in: large parts of z/OS itself, Db2, the TCP/IP stack, language runtimes and nearly all software ported from other platforms.

There are two compilers. **z/OS XL C/C++** is the long-standing one, an optional feature of z/OS, invoked in batch as `CCNDRVR` or from the shell as `xlc`, `c89` or `cxx`. **Open XL C/C++** is the newer product, built on the open-source **Clang and LLVM** code base and invoked as `ibm-clang`; it supports current language standards (up to C17 and C++20), generates 64-bit code, and is free of charge for z/OS licensees. Code written for Linux tends to compile with it with far fewer changes, which is why it is the compiler behind most recent ports.

Programs run under **Language Environment**, which supplies the C runtime library. Source can live in data sets or UNIX files, and `fopen` can open either — `fopen("//'MY.DATA.SET'", "r")` — as well as VSAM and memory files.

The platform leaves marks on the language. Character constants are **EBCDIC** unless you compile with an ASCII option, so `'A'` is `0xC1` and code that assumes `'a'..'z'` is one contiguous range is wrong. The machine is **big-endian**. There are three linkage conventions — the older standard linkage, **XPLINK** (faster calls, needed for 64-bit) and the 64-bit `LP64` model — and mixing them carelessly costs performance or fails to link.

For code that must run without Language Environment at all there is **Metal C**, a separate compiler option with its own entry.
