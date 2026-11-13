---
title: "zHyperLink"
params:
  expansion: "IBM zHyperLink Express"
  short: "A short, direct PCIe link from IBM Z to DS8000 disk for synchronous reads and writes measured in microseconds."
  ref: { title: "IBM Redbooks: Getting Started with IBM zHyperLink for z/OS", url: "https://www.redbooks.ibm.com/abstracts/redp5493.html" }
  aka: ["zHyperLink Express", "synchronous I/O"]
  related: ["FICON", "DASD", "Db2 for z/OS", "PCHID", "IBM MQ", "VSAM", "PAV", "zHPF", "DS8000"]
  links:
    - title: "IBM Docs: zHyperLink I/O"
      url: "https://www.ibm.com/docs/en/zos/3.1.0?topic=performance-zhyperlink-io"
categories: ["Hardware"]
tags: ["hardware", "io", "performance", "storage"]
---

Normal DASD I/O over FICON is asynchronous: z/OS starts it, gives the CPU to other work, and resumes the task when the interrupt arrives. zHyperLink does the opposite on purpose. The CPU issues the request and **waits** — spins — for the answer, which comes straight from the DS8000's cache over a point-to-point PCIe link (at most 150 m). Because there is no interrupt, no redispatch and no switch in the path, a cache-hit read completes in a small fraction of FICON's time.

Waiting only makes sense when the wait is shorter than the cost of switching away, so zHyperLink is used selectively. The main users are Db2 synchronous reads and active log writes, VSAM reads, and MQ log writes — small, latency-critical I/Os where response time goes straight into transaction response time. When the data is not in the storage cache, the request falls back to FICON automatically.

What newcomers get wrong: zHyperLink does **not** replace FICON. Every zHyperLink-attached volume still needs FICON paths, which carry everything else. And **zHyperWrite** is a different feature despite the name. It is about writing to both disks of a Metro Mirror pair in parallel. On z17 the card is zHyperLink Express 2.0, defined with FIDs (PCIe functions) rather than CHPIDs.
