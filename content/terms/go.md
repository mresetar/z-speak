---
title: "Go on z/OS"
params:
  expansion: "IBM Open Enterprise SDK for Go"
  short: "Google's Go language, ported by IBM to z/OS at no charge, compiling to static native programs suited to tools, agents and network services."
  ref: { title: "IBM Docs: Overview of IBM Open Enterprise SDK for Go", url: "https://www.ibm.com/docs/en/sdk-go-zos/1.26.0?topic=overview-open-enterprise-sdk-go" }
  aka: ["Go", "Golang", "IBM Open Enterprise SDK for Go", "go build", "goroutine", "cgo", "GOOS=zos"]
  related: ["z/OS UNIX", "C/C++", "Node.js on z/OS", "Python on z/OS", "Java on z/OS", "zCX", "OpenShift on IBM Z", "Linux on IBM Z", "EBCDIC"]
categories: ["Modern Z"]
tags: ["language", "modernization", "open-source"]
---

**Go** is the language behind much of today's infrastructure software — Docker, Kubernetes, Terraform and countless command-line tools. IBM supplies it for z/OS as **IBM Open Enterprise SDK for Go**, a no-charge product that follows the community release numbering. It runs in z/OS UNIX and behaves as Go does anywhere: `go build`, `go test`, modules, the standard library.

Its attraction on the mainframe is the same as elsewhere. Go compiles to a single, statically linked native executable with no runtime to install alongside it, starts instantly, and has concurrency built in through **goroutines**. That suits agents, exporters, small servers and administrative utilities. Open-source tools written in Go are a main reason to have it: a growing number build for z/OS (`GOOS=zos`, architecture `s390x`), and several monitoring and DevOps vendors ship their z/OS agents as Go programs.

The compiler exploits z/Architecture instructions, and Go code can call C through **cgo** and reach z/OS services that way. Workloads written in Go are partly eligible for **zIIP** processors.

Portability is good but not automatic. Source is UTF-8 and the runtime treats text as UTF-8, so interaction with EBCDIC data — data sets, console messages, other programs' output — needs explicit conversion or tagged files. Packages that reach into operating-system specifics, such as low-level networking or file-system features, may lack a z/OS implementation. And Go is a different target from Go on **Linux on IBM Z**: both are `s390x`, but a binary built for one will not run on the other.

It is not a replacement for COBOL in business logic. Think of it as the language for the tooling around the applications.
