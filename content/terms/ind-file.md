---
title: "IND$FILE"
params:
  expansion: "The 3270 host file transfer program"
  short: "The host program behind a 3270 emulator's Send File and Receive File — file transfer through the terminal session itself."
  ref: { title: "Wikipedia: IND$FILE", url: "https://en.wikipedia.org/wiki/IND$FILE" }
  aka: ["INDFILE", "3270 file transfer", "Send/Receive"]
  related: ["3270", "TSO/E", "CMS", "CICS", "EBCDIC", "Record Format", "CCSID"]
  links:
    - title: "IBM Docs: PC file transfer program"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=systems-pc-file-transfer-program"
categories: ["System Services"]
tags: ["interactive", "terminal", "tooling"]
---

When you choose "send file to host" in a terminal emulator, the emulator types a command such as `IND$FILE PUT 'USERID.TEST.DATA' ASCII CRLF` at the TSO READY prompt and then exchanges the file's contents with the host program in specially formatted 3270 data. No FTP server, no extra port, no firewall rule: if you have a logon screen, you have file transfer. Versions exist for TSO, CMS and CICS.

The options carry the meaning. `ASCII` requests translation between ASCII and EBCDIC, and `CRLF` turns line ends into records; leave both off for binary data. For a new data set you may add `RECFM`, `LRECL` and `SPACE`. Getting these wrong is the usual cause of a transferred file that looks like garbage or has every line run together.

It is slow, and it must be run from the READY prompt or ISPF option 6, not from an arbitrary panel. It remains the fallback for getting a file onto a system where nothing else is open — and for the same reason security teams treat it as a data-exfiltration path worth controlling.
