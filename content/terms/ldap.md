---
title: "LDAP"
params:
  expansion: "IBM Tivoli Directory Server for z/OS (LDAP server)"
  short: "The LDAP directory server shipped with z/OS, which can serve its own directory or expose RACF users and groups to LDAP clients."
  ref: { title: "IBM Docs: IBM Tivoli Directory Server for z/OS", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=tivoli-directory-server-zos" }
  aka: ["IBM TDS", "Tivoli Directory Server", "z/OS LDAP", "GLDSRV", "SDBM", "TDBM", "LDBM", "CDBM", "GDBM", "native authentication", "ds.conf", "ldapsearch"]
  related: ["RACF", "Kerberos", "SAF", "Digital Certificate", "z/OSMF", "WebSphere Liberty for z/OS", "Db2 for z/OS", "AT-TLS", "ESM"]
categories: ["Security"]
tags: ["security", "authentication", "integration"]
---

**LDAP** is the standard protocol for directories of users, groups and other entries, and z/OS includes a server for it: **IBM Tivoli Directory Server for z/OS**, a base element that runs as a started task (commonly `GLDSRV`).

What makes it distinctive is its choice of **back ends**, several of which can be configured in one server. **SDBM** presents the RACF database as a directory: an LDAP client can bind with a RACF user ID and password, search for users and groups, and — if authorised — change them. Nothing is copied; requests are turned into RACF commands. **TDBM** is a general-purpose directory stored in Db2, for large volumes. **LDBM** keeps a directory in z/OS UNIX files and memory, with no Db2 needed. **CDBM** holds the server's own configuration, and **GDBM** is a change log.

The most used feature is **native authentication**: entries live in an ordinary LDAP directory, but the password check is passed to RACF. An application that only knows how to authenticate against LDAP — a web portal, a middleware product, a Linux PAM module — can thereby validate z/OS credentials, and RACF's revocation and password rules apply.

It also underpins other z/OS functions. RACF can publish password changes and other events to it; some components keep policy or configuration data there; and it can take part in replication with directory servers on other platforms.

Because binds carry passwords, connections should always use TLS. And an LDAP route into RACF is a real administrative path: the SDBM back end obeys RACF authority, but it should be reviewed like any other.
