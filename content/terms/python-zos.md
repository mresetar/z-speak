---
title: "Python on z/OS"
params:
  expansion: "IBM Open Enterprise SDK for Python (and other modern languages on z/OS)"
  short: "Python, Node.js and Go run natively on z/OS in the UNIX environment, mainly for automation, tooling and data-facing services."
  ref: { title: "IBM Docs: IBM Open Enterprise SDK for Python", url: "https://www.ibm.com/docs/en/python-zos" }
  aka: ["IBM Open Enterprise SDK for Python", "Node.js on z/OS", "Go on z/OS", "pip", "_BPXK_AUTOCVT", "zoautil_py", "Python"]
  related: ["z/OS UNIX", "Z Open Automation Utilities", "Ansible for IBM Z", "zIIP", "CCSID", "Java on z/OS", "zFS", "REXX", "Node.js on z/OS", "Go on z/OS", "Shell Script"]
  links:
    - title: "IBM Docs: Getting started with IBM Open Enterprise SDK for Python"
      url: "https://www.ibm.com/docs/en/python-zos/3.13.0?topic=getting-started-open-enterprise-sdk-python"
categories: ["Modern Z"]
tags: ["language", "automation", "modernization"]
---

IBM ships supported builds of today's general-purpose languages for z/OS, as no-charge products named **IBM Open Enterprise SDK** for Python, for Node.js and for Go. They run in z/OS UNIX, are installed in the file system, and behave as they do elsewhere: `python3 script.py`, `pip install`, virtual environments.

Python is the one that matters most to a systems team. The **ZOAU** Python library lets a script work with data sets, submit jobs and issue operator commands, making Python a practical successor to REXX for automation written by people who did not grow up on the platform. The Ansible collections for z/OS also need Python on the target system. A good share of Python processing is eligible for **zIIP**, which keeps it off the software bill.

The reason to run code *on* z/OS instead of calling it from outside is proximity: next to the data, with no network hop and under the same security.

Encoding is the persistent complication. These runtimes think in UTF-8 while the data sets and many files around them are EBCDIC. z/OS bridges the two with file tags and automatic conversion, controlled by environment variables such as `_BPXK_AUTOCVT`. A script that prints unreadable characters, or a package that will not install, is nearly always a tagging or conversion setting — and packages containing compiled C code must be available for z/OS, which limits the choice somewhat.
