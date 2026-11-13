---
title: "File Manager"
params:
  expansion: "IBM File Manager for z/OS"
  short: "A tool for browsing, editing, copying and creating data in data sets, VSAM, Db2 and IMS, with records formatted through copybooks."
  ref: { title: "IBM: File Manager for z/OS", url: "https://www.ibm.com/products/file-manager-for-zos" }
  aka: ["FM", "FM/Db2", "FM/IMS", "FM/CICS", "template", "File-AID"]
  related: ["Copybook", "VSAM", "Data Set", "Packed Decimal", "Zoned Decimal", "ISPF", "z/OS Debugger", "Fault Analyzer", "Easytrieve"]
categories: ["Development"]
tags: ["tooling", "data", "development"]
---

The ISPF editor is for text. Application data is not text: it is fixed-layout records full of packed and binary fields, often in VSAM files the editor cannot open at all. File Manager is for that data. You name a data set and a COBOL or PL/I copybook, and it displays each record as named fields with their values properly interpreted, in a table or one record at a time. You can edit by field, with the tool keeping lengths and formats valid.

A **template** is a copybook compiled into File Manager's own form, with selection criteria added — which record layout applies when, and which records to show. With templates the batch functions become useful: copy a file while selecting and reformatting records, generate test data, compare two files field by field, scramble sensitive values.

Separate components do the same for Db2 tables, IMS databases and CICS resources.

It is a development and support tool, and powerful enough to change production data directly, so access is usually restricted and audited. The long-standing competitor is BMC Compuware **File-AID**, and "File-AID" is commonly used as the generic word.
