---
title: "EBCDIC"
params:
  expansion: "Extended Binary Coded Decimal Interchange Code"
  short: "The mainframe's character encoding. Not ASCII, and the cause of a large share of integration bugs."
  ref: { title: "IBM Docs: z/OS Basic Skills — The EBCDIC character set", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zappldev/zappldev_14.htm" }
  aka: ["EBCDIC code page", "host code page"]
  related: ["z/OS UNIX", "Packed Decimal", "Data Set", "CCSID", "C/C++", "Go on z/OS"]
  links:
    - title: "Wikipedia: EBCDIC"
      url: "https://en.wikipedia.org/wiki/EBCDIC"
categories: ["Development"]
tags: ["data", "encoding"]
---

EBCDIC descends from punched cards. In it, `A` is `x'C1'` and `0` is `x'F0'`, and — the detail that bites — **the letters are not contiguous**: there is a gap between `I` and `J`, and between `R` and `S`. Sorting rules therefore differ from ASCII, and so does the collating order of mixed alphanumeric keys.

Code pages matter: `IBM-037` (US), `IBM-1047` (the usual z/OS UNIX one), `IBM-273`, `IBM-870` and others for European languages, which is why the same byte can print as `$`, `£` or `#` depending on who reads it. Square brackets and the euro sign are perennial trouble.

On the z/OS UNIX side files carry a **tag** (`chtag`) declaring their encoding, and `iconv` converts. Getting tagging wrong is why a file transferred by FTP or Git looks like mojibake.
