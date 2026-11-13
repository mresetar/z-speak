---
title: "Key Ring"
params:
  expansion: "SAF key ring (RACF keyring)"
  short: "A named collection of certificates and keys held in the security database — z/OS's equivalent of a keystore file."
  ref: { title: "IBM Docs: RACF and key rings", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=certificates-racf-key-rings" }
  aka: ["keyring", "RACDCERT", "SAF keyring", "JCERACFKS", "keystore", "truststore", "virtual key ring"]
  related: ["RACF", "SAF", "AT-TLS", "ICSF", "Java on z/OS", "Crypto Express", "Communications Server", "Digital Certificate", "Master Key", "OpenSSH"]
  links:
    - title: "IBM Docs: RACDCERT (Manage RACF digital certificates)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=syntax-racdcert-manage-racf-digital-certificates"
categories: ["Security"]
tags: ["security", "encryption", "tls"]
---

On other platforms a server's certificate and private key sit in a file protected by a password. On z/OS they are normally kept in the security product, and a **key ring** is the object that groups them. A ring belongs to a user ID and holds connections to certificates: the server's own, marked as default, together with the certificate-authority certificates it should trust. One ring therefore serves as both keystore and truststore.

Rings are managed with the RACF `RACDCERT` command — `ADDRING`, `CONNECT`, `LISTRING` — and servers refer to them by name, as `ringname` or `userid/ringname`. AT-TLS policies, CICS, the z/OSMF and Zowe servers, FTP and anything using System SSL accept that form; Java reaches them through a `safkeyring://` URL and the `JCERACFKS` keystore type.

Two things trip people up. Being able to *read* a ring, and especially another user's private key, is governed by RACF profiles, so a server that "cannot find its certificate" is often simply not permitted. And the private key may not be in RACF at all but in **ICSF**, protected by the crypto hardware — in which case the server also needs access to the key there.
