---
title: "Sequential Data Set"
params:
  expansion: "Physical sequential data set (DSORG=PS)"
  short: "The plainest kind of z/OS file: records one after another, read from the first to the last."
  ref: { title: "IBM Docs: Processing Sequential Data Sets", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=files-processing-sequential-data-sets" }
  aka: ["PS", "DSORG=PS", "flat file", "QSAM file", "large format", "DSNTYPE=LARGE", "striped data set"]
  related: ["Data Set", "QSAM", "Record Format", "SPACE", "Extended Format", "GDG", "DFSORT", "PDS", "Temporary Data Set", "Easytrieve"]
categories: ["Storage"]
tags: ["storage", "data", "fundamentals"]
---

A **sequential data set** holds records in the order they were written and gives them back in the same order. It has no index and no members. This is the workhorse of batch: extract files, report files, the input and output of every sort, transmission files to and from partners, unloads and backups.

Its attributes are fixed when it is created: organisation `DSORG=PS`, a record format, a record length and a block size. Programs read and write it with **QSAM** (`READ` and `WRITE` in COBOL) or the lower-level BSAM. The only ways to change it are to rewrite it from the start, to append with `DISP=MOD`, or — for fixed-length records — to update a record in place.

There are three variants. A **basic** format data set is limited to 65,535 tracks per volume, about 3.4 GB on a 3390. **Large format** (`DSNTYPE=LARGE`) removes that limit. **Extended format** adds striping across volumes for speed, compression and encryption, and needs SMS. A data set can also span many volumes, and on tape it can be effectively unlimited.

Newcomers should note what it is not. It is not a stream of bytes with line ends: each record has a defined length, and trailing blanks are part of the data. It cannot be shared for update: a job writing it needs exclusive use. And "sequential" describes the organisation, not the device — the same data set can live on disk or tape, and programs written decades apart can read it.
