---
title: "FICON"
params:
  expansion: "Fibre Connection"
  short: "IBM Z's channel protocol over Fibre Channel — how z/OS talks to disk, tape and other systems' channels."
  ref: { title: "IBM Redbooks: IBM Z Connectivity Handbook", url: "https://www.redbooks.ibm.com/abstracts/sg245444.html" }
  aka: ["FICON Express", "FCP", "FC CHPID", "ESCON"]
  related: ["Channel Subsystem", "PCHID", "zHyperLink", "DASD", "Virtual Tape", "Pervasive Encryption", "CTC", "zHPF", "DS8000", "Control Unit"]
  links:
    - title: "Wikipedia: FICON"
      url: "https://en.wikipedia.org/wiki/FICON"
categories: ["Hardware"]
tags: ["hardware", "io", "storage"]
---

Mainframe I/O is **channel programs**: chains of commands (CCWs) that the channel subsystem runs against a device while the CPU does other work. FICON carries those channel programs over standard Fibre Channel links, switches and directors. It replaced **ESCON** fibre in the late 1990s. Every DASD read, tape mount and channel-to-channel link between z/OS systems on a typical system travels over FICON.

The same FICON Express card (z17: FICON Express32-4P, 32 Gbps, four ports per card) runs one of two protocols per port, chosen by CHPID type. **FC** carries FICON, plus **zHPF** (High Performance FICON), which bundles a whole channel program into far fewer exchanges and is how modern DASD I/O is actually done. **FCP** carries plain SCSI over Fibre Channel, which is how Linux on IBM Z and z/VM reach SAN storage.

What newcomers miss is that FICON I/O is **asynchronous**. z/OS starts the I/O, dispatches something else, and takes an interrupt when it completes, so a few hundred microseconds of latency do not waste the CPU. That design is also its ceiling. For the tiny, cache-hit reads Db2 does constantly, the interrupt-and-redispatch overhead is most of the cost, which is exactly the gap zHyperLink was built to close. Recent cards can also encrypt data in flight between the host and the storage (Fibre Channel Endpoint Security).
