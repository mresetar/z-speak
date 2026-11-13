---
title: "FTP"
params:
  expansion: "z/OS FTP server and client (File Transfer Protocol)"
  short: "The file transfer service in z/OS Communications Server, which reads and writes MVS data sets and UNIX files and can submit jobs."
  ref: { title: "IBM Docs: Transferring files using FTP", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=applications-transferring-files-using-ftp" }
  aka: ["FTPD", "FTPS", "FTP.DATA", "SITE command", "LOCSITE", "FILETYPE=JES", "FILETYPE=SQL", "quote site", "ASCII and binary transfer", "batch FTP", "ftp client"]
  related: ["Communications Server", "OpenSSH", "Connect:Direct", "AT-TLS", "CCSID", "Record Format", "JES", "Data Set", "NJE", "Zowe CLI"]
categories: ["System Services"]
tags: ["network", "data", "operations"]
---

**FTP** on z/OS is part of Communications Server: a server daemon (`FTPD`) and a client usable from TSO, the UNIX shell or a batch job. It is old and plain, and still one of the most used ways of moving files to and from the mainframe, because every platform has a client.

The z/OS implementation understands both file systems. A working directory can be a data set prefix (`'PROD.DATA.'`) or a UNIX path, and you switch between them with `cd`. Because a data set needs attributes that a remote client knows nothing about, the **SITE** command sets them before an upload: `quote site recfm=fb lrecl=80 cyl pri=10 sec=5`. Defaults come from the `FTP.DATA` configuration file.

Two features have no counterpart elsewhere. `site filetype=jes` turns the server into a job interface: `put` submits a file as JCL, `dir` lists your jobs, and `get` retrieves the output. `filetype=sql` runs a query against Db2 and returns the result. Tools and scripts lean on the JES mode heavily.

Transfer mode is where mistakes are made. **ASCII** mode translates text between the client's code page and EBCDIC and maps line ends to records; **binary** copies bytes unchanged. Text sent as binary is unreadable; a file containing packed or binary fields sent as ASCII is corrupted beyond repair. Variable-length records and load modules need further options.

Plain FTP sends passwords and data in the clear. z/OS supports **FTPS** — FTP over TLS, natively or through AT-TLS — which is not the same protocol as **SFTP**, the SSH file transfer provided by OpenSSH. Auditors increasingly require one of the two, and partners must agree on which.
