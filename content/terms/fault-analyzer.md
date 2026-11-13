---
title: "Fault Analyzer"
params:
  expansion: "IBM Fault Analyzer for z/OS"
  short: "Captures an application abend as it happens and produces a readable report: the failing source statement, the data, and the likely cause."
  ref: { title: "IBM: Fault Analyzer for z/OS", url: "https://www.ibm.com/products/fault-analyzer-for-zos" }
  aka: ["FA", "IDIDA", "fault history file", "Abend-AID"]
  related: ["ABEND", "IPCS", "z/OS Debugger", "File Manager", "Language Environment", "CICS", "COBOL", "Dump", "CICS Abend Codes"]
  links:
    - title: "IBM Docs: Fault Analyzer: Real-time analysis"
      url: "https://www.ibm.com/docs/en/fafz/14.1.0?topic=analyzer-real-time-analysis"
categories: ["Development"]
tags: ["troubleshooting", "development", "tooling"]
---

When an application abends, the raw material is a system completion code, a PSW, registers and a storage dump. Turning that into "statement 1423 moved spaces into a packed field" takes a compile listing, hex arithmetic and experience. Fault Analyzer does the arithmetic. It is driven by abend exits, so it gets control at the moment of failure in batch, CICS, IMS or Db2 work, analyses the situation in place, and writes a report.

The report gives the abend in plain language, the failing statement in the source, the fields that statement used with their values, the call chain, and open files with their last records. A summary goes to the job output, and the full fault entry is saved in a **history file** that can be browsed from ISPF or an IDE, and re-analysed later with better information.

To map a failing address back to a source line, it needs the compiler listing or a side file from the build. Keeping those for every production module is the organisational price.

The direct competitor is BMC Compuware **Abend-AID**, whose name many people use for the whole category. For system-level problems the tool is still IPCS.
