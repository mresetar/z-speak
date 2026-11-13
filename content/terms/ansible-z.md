---
title: "Ansible for IBM Z"
params:
  expansion: "Red Hat Ansible Certified Content for IBM Z"
  short: "Ansible collections that configure and operate z/OS, so the mainframe joins the same automation as everything else."
  ref: { title: "Red Hat Ansible Content for IBM Z", url: "https://ibm.github.io/z_ansible_collections_doc/" }
  aka: ["ibm_zos_core", "z/OS core collection", "Ansible"]
  related: ["Zowe", "Z Open Automation Utilities", "z/OSMF", "PARMLIB", "Wazi Deploy", "Python on z/OS", "OpenSSH"]
  links:
    - title: "Wikipedia: Ansible (software)"
      url: "https://en.wikipedia.org/wiki/Ansible_(software)"
categories: ["Modern Z"]
tags: ["automation", "devops"]
---

The `ibm.ibm_zos_core` collection gives modules for the operations you would otherwise script by hand: `zos_data_set`, `zos_job_submit`, `zos_copy`, `zos_operator`, `zos_mvs_raw`. Further collections cover CICS, IMS, Db2, MQ and z/OS UNIX.

Underneath, the modules run over SSH to z/OS UNIX and call **ZOAU**. What that buys is not novelty but *sameness*: one playbook, one inventory and one pipeline covering Linux, cloud and z/OS, rather than a separate mainframe process nobody outside the team can read.

A playbook targets z/OS like any other host, with a few extra inventory variables that say where Python and ZOAU are installed on the z/OS side. That is the first prerequisite people miss: the managed z/OS system needs **IBM Open Enterprise SDK for Python**, **ZOAU** and a working SSH daemon before the first module will run. The control node is an ordinary Linux or macOS machine — Ansible itself does not run on z/OS as a controller in normal use.

Two habits from other platforms need adjusting. Encoding: files and templates are converted between UTF-8 and **EBCDIC**, and getting the code page wrong produces unreadable members rather than an error. And idempotence: modules such as `zos_data_set` and `zos_lineinfile` are idempotent, but `zos_job_submit` runs a job every time, so a playbook built mostly from submitted JCL is a script, not a description of desired state.
