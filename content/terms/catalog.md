---
title: "Catalog"
params:
  expansion: "ICF Catalog (Master and User catalogs)"
  short: "The index that maps a data set name to the volume it lives on — z/OS's name service for storage."
  ref: { title: "IBM Docs: z/OS Basic Skills — What is a catalog?", url: "https://www.ibm.com/docs/en/zosbasics/com.ibm.zos.zconcepts/zconcepts_172.htm" }
  aka: ["ICF catalog", "master catalog", "usercat"]
  related: ["Data Set", "DASD", "VSAM", "VTOC", "Dynamic Allocation"]
  links:
    - title: "IBM Docs: Catalog Structure"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=catalogs-catalog-structure"
categories: ["Storage"]
tags: ["storage", "sysprog"]
---

Because JCL usually names data sets without saying where they are, something must resolve the name. The **master catalog** holds system data sets and **aliases**; an alias sends a high-level qualifier to a **user catalog**, which holds the actual entries.

Catalogs are single points of pain: a damaged or unavailable user catalog makes every data set under that HLQ unreachable, even though the data is intact. Hence `LISTCAT`, regular backups (`IDCAMS EXPORT`), and the sysprog reflex of checking the catalog first when data sets "disappear".

Since the 1980s these have been **ICF catalogs**, each made of two parts. The **BCS** (basic catalog structure) is the catalog itself, a VSAM KSDS mapping names to volumes. The **VVDS** (VSAM volume data set, `SYS1.VVDS.Vvolser`) lives on each volume and holds the detail for VSAM and SMS-managed data sets there. A data set is healthy only when BCS, VVDS and **VTOC** agree, and the IDCAMS `DIAGNOSE` command exists to find where they do not.

A data set can exist on disk without being cataloged, and a catalog entry can point at a data set that is gone; both produce confusing errors, "data set not found" or `NOT CATLGD 2` in a job log being the common ones. The second means the job created the data set but a same-named entry already existed, so the new one is on disk uncataloged — a classic cause of a later step reading yesterday's data. SMS-managed data sets must always be cataloged, which removes most of these cases.
