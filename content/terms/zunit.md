---
title: "zUnit"
params:
  expansion: "z/OS Automated Unit Testing Framework (ZUnit)"
  short: "IBM's framework for unit-testing COBOL and PL/I programs in isolation, by recording their inputs and stubbing out files, Db2 and CICS."
  ref: { title: "IBM Docs: IBM Developer for z/OS — ZUnit", url: "https://www.ibm.com/docs/en/developer-for-zos/16.0.x?topic=api-zunit-zos-automated-unit-testing-framework-extensions-api-reference" }
  aka: ["ZUnit", "Test Accelerator for Z", "TAZ", "Virtual Test Platform", "VTP", "Galasa", "Total Test", "stub"]
  related: ["IDz", "COBOL", "PL/I", "CI/CD Pipeline", "z/OS Debugger", "CICS", "Db2 for z/OS", "Dependency Based Build"]
  links:
    - title: "IBM Docs: Unit testing Enterprise COBOL and PL/I applications (deprecated)"
      url: "https://www.ibm.com/docs/en/developer-for-zos/16.0.x?topic=eclipse-unit-testing-enterprise-cobol-pli-applications-deprecated"
categories: ["Modern Z"]
tags: ["development", "tooling", "modernization"]
---

A COBOL program is hard to test alone. It reads files, issues SQL, makes CICS calls, and is usually exercised only by running the whole job or transaction against real data. Unit testing needs the opposite: one program, with known inputs, run in seconds and without its surroundings.

ZUnit, part of IBM Developer for z/OS, provides that. The developer runs the program once in its real environment while the tool **records** the data passing across its boundaries — records read, rows returned, parameters received. From the recording it generates a test case and **stubs**, so that on later runs the file, Db2, CICS or IMS calls are answered from the recorded data and the program's outputs are compared with expected values. Tests run in batch, so a pipeline can execute them after every build.

IBM has since repackaged and extended this as **Test Accelerator for Z**, which adds recording and replay of whole transactions and batch jobs for integration testing, and newer IDz releases mark the original ZUnit component as deprecated in its favour. The idea is unchanged; the product name you meet depends on the release.

Others in the same space are BMC's Total Test, Broadcom's Test4z, and **Galasa**, an open-source framework for automated integration tests.

The obstacle is rarely the tool. It is that old programs are large and do several things at once, so worthwhile tests often begin with making the code testable.
