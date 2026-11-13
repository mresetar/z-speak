---
title: "NFS"
params:
  expansion: "z/OS Network File System (NFS server and client)"
  short: "The z/OS feature that lets other systems mount z/OS UNIX files and MVS data sets as a remote file system, and lets z/OS mount theirs."
  ref: { title: "IBM Docs: Using z/OS Network File System", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-using-zos-network-file-system" }
  aka: ["Network File System", "z/OS NFS", "MVSNFS", "NFS client", "NFS server", "mvslogin", "NFSv4", "exports data set", "site attributes", "text and binary processing", "mount"]
  related: ["z/OS UNIX", "zFS", "Data Set", "Kerberos", "FTP", "OpenSSH", "CCSID", "Linux on IBM Z", "DFSMS"]
categories: ["Storage"]
tags: ["storage", "unix", "network"]
---

**NFS** is the long-established UNIX protocol for using files on another machine as if they were local. z/OS includes both halves as part of DFSMS. The **NFS server** is a started task that lets Linux, UNIX and Windows clients mount z/OS storage; the **NFS client** lets z/OS UNIX mount directories exported by other systems, where they appear under a mount point like any other file system.

The server exports two kinds of data. z/OS UNIX directories (in zFS) behave as any NFS export would. More unusually, it can present **MVS data sets**: a high-level qualifier is mounted as a directory, each data set under it appears as a file, and a PDS appears as a directory of members. Since data sets have attributes that files do not, the server uses **attributes** given at mount time or in the file name — record format, record length, space, and whether to process the data as **text** (converting between ASCII and EBCDIC and between line ends and records) or **binary**.

Security takes two forms. With the older system authentication, a client user first identifies themselves to RACF with the `mvslogin` command. With NFS version 4 and **Kerberos**, the identity arrives in a ticket and optional integrity and encryption protect the traffic. An **exports** data set limits which clients may mount what.

It is the right tool when a program expects a file system rather than a transfer — a shared build directory, or a product on Linux that reads a z/OS-generated extract in place. It is the wrong tool for bulk file exchange between organisations, and the text-versus-binary choice bites here just as in FTP: a data set with packed-decimal fields mounted as text is silently corrupted on read.
