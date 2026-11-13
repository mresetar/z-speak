---
title: "PassTicket"
params:
  expansion: "RACF PassTicket"
  short: "A short-lived, one-time substitute for a password, generated from a shared secret so that one application can sign a user on to another."
  ref: { title: "IBM Docs: The RACF PassTicket", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=passtickets-racf-passticket" }
  aka: ["PTKTDATA", "secured signon", "IRRPTAUTH", "one-time password"]
  related: ["RACF", "SAF", "MFA", "Zowe API Mediation Layer", "CICS", "ICSF", "ESM", "CICS Transaction Gateway", "Kerberos"]
  links:
    - title: "IBM Docs: The RACF PassTicket (interfaces)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=interfaces-racf-passticket"
categories: ["Security"]
tags: ["security", "authentication"]
---

A gateway that has already authenticated a user often needs to log that user on to a back-end — a CICS region, a TSO address space, z/OSMF. Storing or forwarding the real password is unacceptable. A PassTicket is the alternative: an eight-character value computed from the user ID, the target **application name**, a secret key and the current time. The target presents it to RACF in place of a password; RACF, knowing the same key, recomputes and compares.

A PassTicket is valid for about ten minutes and, by default, can be used only once. The key lives in a profile in the `PTKTDATA` class named for the application, and a separate permission controls who may generate tickets for which users and applications.

They appear wherever single sign-on reaches z/OS: session managers, the Zowe API Mediation Layer, products that launch work under a user's identity. They also solve a problem created by **MFA**, where a password can no longer be replayed.

The security rests entirely on that key and on who is allowed to generate tickets. Anyone with both can become any user of the application, so the profiles deserve the scrutiny given to privileged accounts. Recent z/OS releases add an enhanced PassTicket with a stronger algorithm.
