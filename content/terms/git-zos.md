---
title: "Git on z/OS"
params:
  expansion: "Git as the source code manager for z/OS applications"
  short: "Using Git, the industry-standard version control system, for mainframe source — with the code in z/OS UNIX files instead of PDS members."
  ref: { title: "Git", url: "https://git-scm.com/" }
  aka: ["Rocket Git", "zopen", "z/OS Open Tools", ".gitattributes", "zos-working-tree-encoding", "GitLab", "GitHub"]
  related: ["Dependency Based Build", "Endevor", "CI/CD Pipeline", "z/OS UNIX", "zFS", "CCSID", "Zowe Explorer", "IBM Z Open Editor", "PDS", "OpenSSH", "Shell Script"]
  links:
    - title: "z/OS Open Tools (zopen community)"
      url: "https://zopen.community/"
    - title: "Wikipedia: Git"
      url: "https://en.wikipedia.org/wiki/Git"
categories: ["Modern Z"]
tags: ["devops", "tooling", "modernization"]
---

Traditional mainframe change management keeps source in PDS members under a product such as Endevor. Moving to Git means the repository is the source of truth: developers clone it, work on branches, and merge through reviews, exactly as on any other platform. The central server — GitLab, GitHub, Bitbucket, Azure DevOps — runs off the mainframe.

Git itself runs on z/OS, in the z/OS UNIX environment, in a port from Rocket Software or from the open-source z/OS Open Tools project. A build clones the repository into a zFS directory, and the build tool — typically **DBB** — copies the files into data sets for the compilers and binds the results.

Encoding is the part with no equivalent elsewhere. The repository stores text as UTF-8; the compilers need EBCDIC. A `.gitattributes` file states, by file pattern, which code page each file is converted to in the z/OS working tree, for example `*.cbl zos-working-tree-encoding=ibm-1047`. A wrong or missing entry produces source that compiles with odd errors, or special characters that do not survive a round trip.

A migration also has to settle what a PDS never asked: how libraries map to folders and file extensions, what happens to sequence numbers in columns 73 to 80, and how to treat members containing unprintable characters. IBM provides a migration tool with DBB for the mechanical part; the design decisions are the real work.
