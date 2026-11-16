---
title: "CCSID"
params:
  expansion: "Coded Character Set Identifier"
  short: "The number that identifies exactly which character encoding a piece of data uses — 037, 1047, 1208 and so on."
  ref: { title: "Wikipedia: CCSID", url: "https://en.wikipedia.org/wiki/CCSID" }
  aka: ["code page", "codepage", "IBM-1047", "IBM-037", "encoding", "chtag"]
  related: ["EBCDIC", "z/OS UNIX", "Db2 for z/OS", "3270", "IND$FILE", "Zowe CLI", "OpenSSH", "FTP", "NFS", "Shell Script", "DBCS"]
  links:
    - title: "IBM Docs: Coded Character Set Identifiers"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=filemanager-coded-character-set-identifiers"
categories: ["Development"]
tags: ["data", "encoding"]
---

"EBCDIC" is not one encoding but a family. They agree on letters and digits and disagree on the rest: national characters and, awkwardly, some punctuation. A CCSID is IBM's registered number for one specific encoding, and it is what z/OS components use to say which they mean.

| CCSID | What it is |
|---|---|
| 037 | EBCDIC, US English — the traditional default for MVS data |
| 1047 | EBCDIC Latin-1 for open systems — z/OS UNIX and C |
| 500 | EBCDIC international Latin-1 |
| 1140 | 037 with the euro sign |
| 870 | EBCDIC Latin-2, for Central European languages |
| 819 | ISO 8859-1 (ASCII Latin-1) |
| 1208 | UTF-8 |
| 1200 | UTF-16 |

The classic symptom of a mismatch is square brackets, the caret, the vertical bar or `#` and `@` turning into something else: `[` and `]` sit at different code points in 037 and 1047, which breaks C source, JSON and shell scripts moved between them.

So a conversion needs two CCSIDs, not just the word "EBCDIC". Db2 records one per subsystem and table and converts for remote clients; z/OS UNIX files can carry a tag set with `chtag`; and file-transfer tools, terminal emulators, Zowe profiles and editors all have an encoding setting that has to match what the data really is.
