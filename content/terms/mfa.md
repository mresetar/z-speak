---
title: "MFA"
params:
  expansion: "IBM Z Multi-Factor Authentication"
  short: "The product that makes z/OS logon require more than a password — a token code, a smart card, a certificate — enforced through RACF."
  ref: { title: "IBM: IBM Z Multi-Factor Authentication", url: "https://www.ibm.com/products/z-multi-factor-authentication" }
  aka: ["IBM Z MFA", "multi-factor authentication", "TOTP", "RSA SecurID", "out-of-band", "in-band"]
  related: ["RACF", "SAF", "PassTicket", "ESM", "TSO/E", "3270", "Key Ring", "Kerberos"]
  links:
    - title: "Wikipedia: Multi-factor authentication"
      url: "https://en.wikipedia.org/wiki/Multi-factor_authentication"
categories: ["Security"]
tags: ["security", "authentication"]
---

A z/OS password protects the systems of record, and for privileged users a password alone is no longer considered enough. IBM Z MFA adds further factors to the logon that RACF — or ACF2 or Top Secret — already controls. Supported factors include time-based one-time codes from an authenticator app, RSA SecurID, RADIUS and LDAP servers, YubiKeys, and certificates on smart cards. It is switched on per user, so a rollout can start with administrators.

The difficulty is that most z/OS logon screens have one eight-character password field and know nothing of second factors. MFA offers two answers. **In-band**, the user types the extra factor into the existing password field, alone or combined with the password. **Out-of-band**, the user first authenticates on a web page with whatever factors policy requires and receives a short-lived token to type as the password.

The hard part of any deployment is everything that is not a person at a keyboard: applications that cache a password and reuse it, batch submission, file transfers. Those need **PassTickets**, certificates or explicit exemptions.
