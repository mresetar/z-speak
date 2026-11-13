---
title: "zFS"
params:
  expansion: "z/OS File System"
  short: "The file system holding z/OS UNIX directories and files, stored inside a VSAM linear data set."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is a zFS file system?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_179.htm" }
  aka: ["HFS"]
  related: ["z/OS UNIX", "VSAM", "Data Set", "RACF", "OMVS Segment", "NFS"]
  links:
    - title: "Wikipedia: ZFS (z/OS file system)"
      url: "https://en.wikipedia.org/wiki/ZFS_(z/OS_file_system)"
categories: ["Storage"]
tags: ["unix", "storage"]
---

A zFS is a VSAM LDS mounted at a point in the UNIX hierarchy — `/u/app1`, `/var`, product install directories. So `/etc/ssh/sshd_config` really lives inside something like `OMVS.ZFS.ETC` on a DASD volume.

zFS replaced the older **HFS**, which is no longer supported. In a sysplex, file systems are shared through **sysplex root** and function-shipping, which makes mount ownership and `automount` policy a genuine operational topic.

A file system is created by defining the data set and formatting it — `zfsadm define` and `zfsadm format` do both — and attached with a `MOUNT` command from TSO or the shell. Mounts that must survive an IPL are listed in the `BPXPRMxx` PARMLIB member, or handled on demand by automount, which is how user home directories are usually provided.

Space works differently from what UNIX users expect. A zFS is a fixed-size data set, so a file system can report "no space left" while the disk volume is half empty. It has to be grown, either explicitly with `zfsadm grow` or automatically if it was mounted with `aggrgrow` and has room to extend.

Two security models overlap. The data set is protected by a RACF data set profile, but access to the files inside is decided by UNIX permission bits and ACLs, using the UID and GID from each user's OMVS segment. Backups are normally taken of the whole data set with DFSMSdss, not file by file.

It has nothing to do with the ZFS of Solaris and Linux beyond the letters.
