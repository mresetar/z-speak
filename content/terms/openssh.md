---
title: "OpenSSH"
params:
  expansion: "z/OS OpenSSH (ssh, sftp, scp and the sshd daemon)"
  short: "The standard secure shell on z/OS: encrypted remote login to the UNIX shell and encrypted file transfer with sftp and scp."
  ref: { title: "IBM Docs: Introduction to z/OS OpenSSH", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=guide-introduction-zos-openssh" }
  aka: ["SSH", "sshd", "SFTP", "scp", "ssh-keygen", "authorized_keys", "sshd_config", "zos_sshd_config", "port 22", "key-based authentication", "SSHD started task"]
  related: ["z/OS UNIX", "OMVS Segment", "FTP", "Key Ring", "ICSF", "Ansible for IBM Z", "Zowe CLI", "Git on z/OS", "Kerberos", "CCSID", "Shell Script"]
categories: ["Security"]
tags: ["security", "unix", "network"]
---

**z/OS OpenSSH** is IBM's port of the open-source OpenSSH suite and a base element of z/OS. It provides the `sshd` daemon, normally run as a started task listening on port 22, and the client commands `ssh`, `sftp`, `scp` and `ssh-keygen`. For anyone coming from Linux it is the familiar way in: `ssh user@host` gives a z/OS UNIX shell, with no 3270 emulator involved.

Much modern tooling depends on it. Ansible reaches z/OS over SSH, Git uses it for remotes, the Zowe CLI has an SSH profile, and many file transfers that were once FTP are now SFTP because security policy forbids clear-text protocols.

Authentication can be by password — checked by RACF, so revocation and password rules apply — or by **public key**, with the user's public keys in `~/.ssh/authorized_keys`. z/OS adds its own options: keys can be kept in RACF **key rings** instead of files, cryptography can be delegated to ICSF and the hardware, and a second configuration file, `zos_sshd_config`, holds the platform-specific settings. A user needs an OMVS segment and a home directory before any of it works.

The z/OS-specific trap is character encoding. The shell session is converted between the client's ASCII and EBCDIC automatically. For `sftp` and `scp` the default is a binary transfer, so text files may arrive unreadable unless conversion is requested or the files are tagged. And SFTP works on z/OS UNIX files: reaching MVS data sets needs an extra step, a copy command on the z/OS side or a product that extends SFTP to data sets.
