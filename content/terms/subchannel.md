---
title: "Subchannel"
params:
  expansion: "Subchannel and multiple subchannel sets (MSS)"
  short: "The channel subsystem's own representation of one device as seen by one LPAR; every I/O request is started on a subchannel."
  ref: { title: "IBM Docs: Defining multiple subchannel sets", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=configuration-defining-multiple-subchannel-sets" }
  aka: ["subchannel set", "MSS", "SS0", "SS1", "SCHIB", "SSCH", "start subchannel", "subchannel number"]
  related: ["Channel Subsystem", "UCB", "PAV", "HCD", "Control Unit", "EXCP", "HyperSwap", "PPRC", "Interrupt"]
categories: ["Hardware"]
tags: ["hardware", "io", "internals"]
---

z/OS does not talk to a device directly. For every device an LPAR can use, the **channel subsystem** in the machine holds a **subchannel**: a small block of state recording the device number, the channel paths that reach it, whether an I/O is in progress and the status of the last one. z/OS has a matching **UCB** on its side, and the two are tied together at IPL.

To perform I/O, z/OS issues the **Start Subchannel** instruction, naming the subchannel and pointing at a channel program. From then on the channel subsystem does the work — choosing a path, retrying on a busy path, driving the exchange with the control unit — and reports the outcome with an I/O interrupt. This division is why the processors are free to do other work during I/O, and why path selection is not something z/OS manages itself.

Each LPAR could originally have about 64,000 subchannels, which sounds ample until every base volume has several **PAV** aliases and a remote-copy secondary. **Multiple subchannel sets** raised the limit: current machines offer up to four sets (SS0 to SS3). Base devices stay in set 0, while aliases and secondaries can be placed in the other sets, reusing the same four-digit device numbers. A device in another set is written with a leading digit, as in `1A800`.

You meet subchannel sets in HCD when defining devices, in the IPL parameters (which set to IPL from matters after a **HyperSwap**), and in display commands that show five-digit device numbers.
