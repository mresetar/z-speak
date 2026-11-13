---
title: "Digital Certificate"
params:
  expansion: "X.509 digital certificates on z/OS"
  short: "A signed statement binding a public key to an identity; on z/OS they live in the security database and underpin every TLS connection."
  ref: { title: "IBM Docs: RACF and digital certificates", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-racf-digital-certificates" }
  aka: ["certificate", "X.509", "CERTAUTH", "SITE certificate", "certificate authority", "CA", "PKI Services", "certificate name filtering"]
  related: ["Key Ring", "AT-TLS", "RACF", "ICSF", "Crypto Express", "Policy Agent", "z/OSMF", "Health Checker", "TN3270", "MQ Channel"]
  links:
    - title: "Wikipedia: X.509"
      url: "https://en.wikipedia.org/wiki/X.509"
categories: ["Security"]
tags: ["security", "encryption", "tls"]
---

A certificate contains a public key, the name of its owner, a validity period, and the signature of a **certificate authority** vouching for the rest. Whoever holds the matching private key can prove they are the named owner. That is the basis of TLS: a server presents its certificate, and the client checks the signature chain back to an authority it already trusts.

z/OS normally keeps certificates in the security product. In RACF, the `RACDCERT` command manages three kinds: **personal** certificates belonging to a user ID — which includes the IDs servers run under; **CERTAUTH** certificates of authorities; and **SITE** certificates shared among servers. The private key is stored either in the RACF database or in **ICSF**, protected by crypto hardware. Certificates are then connected to **key rings**, which is what servers actually refer to.

They also work in the other direction. A client's certificate can be mapped to a RACF user ID, by registering it or by filtering rules on its name, so that a person or a remote system logs on with no password at all.

The dominant operational problem is expiry. A certificate that lapses takes its service down, and one in the middle of a chain takes down everything beneath it. A RACF health check warns of certificates close to expiring, and renewal has to be planned ahead, since the new certificate must be distributed to every partner that trusts the old one.
