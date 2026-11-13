---
title: "ESM"
params:
  expansion: "External Security Manager"
  short: "The generic name for the product answering security calls: RACF, CA ACF2 or CA Top Secret."
  ref: { title: "IBM Docs: z/OS Security Server RACF", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=zos-security-server-racf" }
  aka: ["security manager"]
  related: ["RACF", "SAF", "PassTicket", "MFA", "Key Ring", "ACF2", "Top Secret", "RACF Group", "RACF Class", "SETROPTS"]
  links:
    - title: "Wikipedia: ACF2"
      url: "https://en.wikipedia.org/wiki/ACF2"
categories: ["Security"]
tags: ["security"]
---

All three implement the same SAF interface with quite different philosophies — RACF is profile-and-group based, ACF2 rule-based with default-deny from the start, Top Secret ownership based. Documentation says "your ESM" when the instruction applies to whichever you run.

Whichever it is, it is the single most important control on the platform: the ESM decides who can read a data set, run a transaction, issue an operator command, or gain **APF**-authorised power.

The three differ most in their defaults and vocabulary. **RACF** historically protected only what had a profile, which is why the `PROTECTALL` option matters. **ACF2** and **Top Secret** deny by default. A RACF person talks about profiles, classes and `PERMIT`; an ACF2 person about logonids and rule sets; a Top Secret person about ACIDs and ownership. The skills transfer in concept but not in command syntax, and converting from one product to another is a multi-year project.

For a developer the practical point is that you never call the ESM directly. Products issue `RACROUTE` through **SAF**, and the answer comes back as a return code. When something fails with a message such as `ICH408I` (RACF) or `ACF04056` (ACF2), that message — not the application error — tells you which resource and which access level were refused, and it is what the security team will ask you for.
