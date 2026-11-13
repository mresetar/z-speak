---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
params:
  expansion: ""          # full name, if the term is an acronym
  short: ""              # one sentence — this is what shows in the index
  ref: { title: "", url: "" }   # THE definitive online reference; deep-link the page describing the term, not a generic landing
  aka: []                # alternative names people use
  related: []            # exact titles of other terms
  links:
    - title: ""          # further reading, beyond the one definitive ref
      url: ""
categories: [""]         # exactly one: Hardware, Operating System, System Services, Storage, Middleware, Development, Security, Modern Z
tags: []
---

Two to five sentences of context: what problem it solves, where you meet it,
and the one thing newcomers get wrong about it.
