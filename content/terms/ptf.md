---
title: "PTF"
params:
  expansion: "Program Temporary Fix"
  short: "A shipped, tested fix for a reported defect — the mainframe's patch."
  ref: { title: "IBM Docs: z/OS Basic Skills — PTF SYSMOD", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zsysprog/zsysprogc_ptfsysmod.htm" }
  aka: ["fix", "maintenance"]
  related: ["APAR", "SMP/E", "HOLDDATA", "SYSMOD"]
  links:
    - title: "Wikipedia: Program temporary fix"
      url: "https://en.wikipedia.org/wiki/Program_temporary_fix"
categories: ["System Services"]
tags: ["maintenance", "sysprog"]
---

Despite "temporary", a PTF is the permanent, general-availability fix. The sequence is: a customer reports a problem → IBM opens an **APAR** → a circumvention or **PE**-free fix is built → it ships as a PTF → it is rolled into the next release.

Shops apply maintenance in bundles on a cadence — **RSU** (Recommended Service Upgrade) levels, or an equivalent policy — rather than PTF by PTF, plus out-of-band HIPER and security fixes. A **PE** (PTF in Error) is one later found to be broken, and superseded.

A PTF is one kind of **SYSMOD**, the unit SMP/E installs. Its number follows a pattern — `UJ` or `UI` plus five digits for z/OS, other prefixes for other products — and its header carries the relationships that make maintenance safe: `PRE` (must already be on), `REQ` (must go on together), `SUP` (replaces these earlier PTFs). Because fixes supersede one another, the number in an old APAR may no longer exist as a separate PTF; SMP/E resolves that for you.

Some PTFs carry a **HOLD**: an instruction that something must be done by hand, such as an IPL, a bind, or a changed default. SMP/E refuses to apply a held PTF until the hold is explicitly bypassed, which forces someone to read the text. **HOLDDATA** arriving later can also mark an already received PTF as in error. In practice you ask two questions about any PTF: is it applied, and is it applied on the system that is actually running — the second depends on when that system was last IPLed from the updated libraries.
