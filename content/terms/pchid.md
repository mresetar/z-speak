---
title: "PCHID"
params:
  expansion: "Physical channel identifier"
  short: "The physical port number of an I/O card in the machine — mapped to the logical CHPIDs that operating systems actually use."
  ref: { title: "IBM Docs: CHPID", url: "https://www.ibm.com/docs/en/systems-hardware/zsystems/3932-AGZ?topic=functions-chpid" }
  aka: ["CHPID", "channel path ID", "LCSS", "MIF", "FID", "CHPID Mapping Tool"]
  related: ["Channel Subsystem", "HCD", "FICON", "LPAR", "SAP", "HSA", "Control Unit"]
  links:
    - title: "IBM Docs: Defining or editing channels using a PCHID and a port"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=characteristics-defining-editing-channels-using-pchid-port"
categories: ["Hardware"]
tags: ["hardware", "io", "configuration"]
---

Every port on every I/O card has a fixed **PCHID**, a three-digit hex number set by the slot the card sits in. It is physical, like a street address: the service engineer who replaces a card or a cable works in PCHIDs.

Operating systems never see PCHIDs. They see **CHPIDs** (channel path IDs), two hex digits, `00`–`FF`, defined in the I/O configuration (IOCDS) built with HCD. A CHPID lives in a **logical channel subsystem** (LCSS). z17 has six, each with its own 256 CHPIDs, and the IOCDS says which PCHID each CHPID uses. Through **MIF** (Multiple Image Facility) one physical channel can be shared by many LPARs, each seeing the same CHPID. Newer PCIe-style features — RoCE, zHyperLink, Network Express functions — are defined with **FIDs** (function IDs) instead, but they still sit on a PCHID.

This indirection is why you can move or replace hardware without changing every system definition, and why IBM supplies the **CHPID Mapping Tool** to spread CHPIDs across cards and drawers so that no single card failure takes out all paths to a device. What trips people up is a conversation where both sides say "channel 4A". `D M=CHP(4A)` on z/OS is logical, and the label on the cable is physical. Always ask which one is meant.
