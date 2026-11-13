---
title: "UNIT"
params:
  expansion: "UNIT parameter and esoteric device names"
  short: "The JCL parameter that says what kind of device a data set goes on: a device type, a group name such as SYSDA, or one address."
  ref: { title: "IBM Docs: UNIT parameter", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statement-unit-parameter" }
  aka: ["esoteric", "esoteric name", "generic unit", "SYSDA", "SYSALLDA", "UNIT=TAPE", "UNIT=AFF", "VOL=SER", "unit affinity"]
  related: ["DD Statement", "DASD", "Virtual Tape", "SMS Classes", "ACS Routine", "HCD", "UCB", "Temporary Data Set"]
categories: ["Storage"]
tags: ["jcl", "storage", "tape"]
---

`UNIT` tells allocation where a data set may be placed or found. It takes one of three forms. A **device number** such as `UNIT=0A80` names one device and is rare outside system tasks. A **generic** name such as `3390` or `3590-1` means any device of that type. An **esoteric** name is a label the installation invents for a group of devices: `SYSDA` and `SYSALLDA` conventionally mean general-purpose disk, `TAPE` or `CART` a pool of tape drives, `VIO` virtual I/O. Esoterics are defined in the I/O configuration with **HCD**, so the same name can mean different things at different sites.

Sub-parameters refine it: `UNIT=(TAPE,2)` asks for two drives so that a multi-volume file need not wait for a remount, `DEFER` postpones the mount until the data set is opened, and `UNIT=AFF=ddname` puts a data set on the same drive as another, saving drives.

For cataloged data sets you normally code nothing — the catalog already records the volume and device type. For new disk data sets on an **SMS-managed** system the storage class and storage group decide placement, and `UNIT` and `VOL=SER` are mostly ignored; ACS routines often read the unit name only as a hint, for example routing anything with `UNIT=TAPE` to virtual tape.

That is the trap in old JCL. It is full of `UNIT=3380,VOL=SER=PROD01`, written when programmers chose volumes by hand, and it still runs because the system quietly overrides it. Copying those parameters into new JCL adds nothing and occasionally forces a data set somewhere it should not go.
