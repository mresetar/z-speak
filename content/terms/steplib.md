---
title: "STEPLIB"
params:
  expansion: "Step library (DD statement)"
  short: "The DD that says 'look for this step's programs here first' — and the usual answer to why a job ran the wrong version."
  ref: { title: "IBM Docs: Program library definition and search order", url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=batch-program-library-definition-search-order" }
  aka: ["JOBLIB", "TASKLIB", "search order"]
  related: ["Load Module", "LNKLST", "JCL", "PDS", "Binder"]
  links:
    - title: "IBM Docs: STEPLIB DD statement"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=statements-steplib-dd-statement"
categories: ["Development"]
tags: ["batch", "jcl", "beginner"]
---

When a job step asks for a program by member name, z/OS searches load libraries in a fixed order: `JOBLIB` (whole job), then `STEPLIB` (this step), then the system areas — **LNKLST** and LPA. A `STEPLIB` DD is how a job picks up a test version of a program without disturbing the production copy everyone else gets, and it is the standard trick for running the new release alongside the old one.

The gotchas are all about precedence. A `STEPLIB` applies to one step; a `JOBLIB` to all of them — and the step-level one wins. Concatenating an unauthorised library into a `STEPLIB` of an APF-authorised program breaks its authorisation. And the classic incident: someone's `STEPLIB` shadows the LNKLST copy, so "the fix we applied isn't working" is really "a stale module in a STEPLIB is winning the search".

Under ISPF/TSO the equivalent is `TSOLIB`/LIBDEF territory, and for Language Environment enclaves a `TASKLIB` can carry the same idea down a level — but the mental model, "first hit in the search order wins", is the same everywhere.
