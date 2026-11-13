---
title: "z/VSE"
params:
  expansion: "z/Virtual Storage Extended"
  short: "IBM's smaller mainframe operating system, descended from DOS/360, now continued by 21st Century Software as VSEn."
  ref: { title: "Wikipedia: VSE (operating system)", url: "https://en.wikipedia.org/wiki/VSE_(operating_system)" }
  aka: ["VSE", "VSEn", "DOS/VSE", "VSE/ESA", "POWER", "ICCF"]
  related: ["z/OS", "z/VM", "CICS", "VSAM", "JCL", "IBM Z", "z/TPF"]
categories: ["Operating System"]
tags: ["zos", "platform", "history"]
---

When System/360 was announced, the full operating system was late and too large for small machines, so IBM shipped a simpler Disk Operating System. That stopgap acquired a loyal customer base and evolved through DOS/VS, VSE/ESA and z/VSE alongside the MVS line. It runs on the same hardware as z/OS, typically at smaller sites and very often as a guest of **z/VM**.

It is recognisably related to z/OS but not compatible with it. There is CICS, VSAM, COBOL and TCP/IP, but the job control language is different (`// JOB`, `// EXEC`, ending in `/&`), the spooler is **POWER** rather than JES, programs live in sublibraries rather than PDSs, and the interactive facility is ICCF rather than TSO/ISPF.

IBM has withdrawn z/VSE; development passed under licence to 21st Century Software, which ships it as **VSEn**. When a job advertisement or a migration project says "VSE", expect the skills to overlap with z/OS at the application level and differ almost everywhere below it.
