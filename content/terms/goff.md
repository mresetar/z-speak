---
title: "GOFF"
params:
  expansion: "Generalized Object File Format"
  short: "The modern object module format produced by z/OS compilers and HLASM, lifting the limits of the 80-byte card-image format."
  ref: { title: "Wikipedia: GOFF", url: "https://en.wikipedia.org/wiki/GOFF" }
  aka: ["object module", "OBJ", "XOBJ", "object deck"]
  related: ["Load Module", "HLASM", "CSECT", "PDS", "COBOL", "AMODE and RMODE", "Binder"]
  links:
    - title: "IBM Docs: Generalized object file format (GOFF)"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=facilities-generalized-object-file-format-goff"
categories: ["Development"]
tags: ["assembler", "development", "internals"]
---

A compiler or assembler produces an object module, which the binder turns into an executable. The original format dates from OS/360: 80-byte records laid out like punched cards, with eight-character external names and one kind of content. GOFF replaces it with variable-length records, long mixed-case names, 64-bit addresses, and **classes** — separate streams within one module for code, static data, debugging information and more.

Those features are what newer languages need. XPLINK and 64-bit C/C++, Java native code, and Enterprise COBOL from version 5 onward generate GOFF; HLASM does when you specify the `GOFF` option.

The practical consequence is downstream. GOFF input needs the **binder**, not the old linkage editor, and the result is usually a *program object* that must be stored in a **PDSE** rather than a PDS. "Why does my load library have to be a PDSE now?" is, most of the time, a GOFF question.
