---
title: "XEDIT"
params:
  expansion: "The z/VM CMS System Product Editor"
  short: "The full-screen editor of z/VM's CMS, with a prefix area for line commands and macros written in REXX."
  ref: { title: "Wikipedia: XEDIT", url: "https://en.wikipedia.org/wiki/XEDIT" }
  aka: ["X", "System Product Editor", "prefix commands", "THE", "KEDIT"]
  related: ["CMS", "z/VM", "REXX", "ISPF", "3270"]
  links:
    - title: "IBM Docs: z/VM XEDIT User's Guide"
      url: "https://www.ibm.com/docs/en/zvm/7.5.0?topic=use-zvm-xedit-users-guide"
categories: ["Operating System"]
tags: ["vm", "interactive", "tooling"]
---

`XEDIT fn ft fm`, or just `X`, opens a file in the editor every CMS user lives in. The screen has a command line and, beside each line of the file, a **prefix area** where you type short line commands — `d` to delete, `a` to add, `cc` … `cc` with `f` to copy a block. Anyone who knows the ISPF editor will recognise the idea, though the commands differ.

Its real strength is programmability. Any XEDIT subcommand can be issued from a **REXX** macro (a file of type `XEDIT`), and the `PROFILE XEDIT` macro runs on every invocation, so users build up personal editing environments. Many CMS full-screen tools are XEDIT with a profile on top.

The design has outlived its platform: KEDIT for PCs and the open-source THE (The Hessling Editor) are XEDIT work-alikes, kept alive by people who never wanted to give up the prefix area.
